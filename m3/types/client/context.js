// Context chia sẻ — chứa engine logic thuần (tách testable) + SDK + best-score store.
import { sdk } from '@game/sdk';
import { MergeEngine } from './logic/merge-engine';
import { ScoreStore } from './logic/save';
import { CONFIG } from './logic/config';
import { checkNewFruitUnlocked } from './logic/album';
import { getDailySeed, getTodayDateString, isDailyCompletedToday, getDailyDifficulty, checkMilestoneJustUnlocked, } from './logic/daily-challenge';
/** SaveAdapter backed by the Playables SDK (BR-11). Injected into ScoreStore so
 *  the logic layer has no SDK import — tests inject a mock adapter instead. */
class SdkSaveAdapter {
    loadData() { return sdk.loadData(); }
    saveData(data) { return sdk.saveData(data); }
    sendScore(score) { sdk.sendScore(score); }
}
class GameContext {
    engine;
    sdk = sdk;
    score;
    isDailyMode = false;
    // Smart Interstitial Cooldown Tracker
    lastInterstitialTime = 0;
    gameplayStartTime = 0;
    constructor() {
        // Seed from config (M3-04): deterministic when set, else default 1.
        const seed = CONFIG.seed ?? 1;
        this.engine = new MergeEngine(seed);
        this.score = new ScoreStore(new SdkSaveAdapter());
    }
    /** Load persisted best score before play (M3-08). Idempotent, never throws. */
    async load() {
        await this.score.load();
        // Mirror the loaded best into engine state so Gameplay/GameOver read one place.
        this.engine.state.bestScore = this.score.bestScore;
    }
    /** Called on game over: persist + report a new best if this run beat it (M3-08).
     *  Takes the score explicitly so a fast Retry (which zeroes state) can't race the
     *  async save and persist a 0. */
    async onGameOver(score) {
        const best = await this.score.onGameOver(score);
        this.engine.state.bestScore = best;
        return best;
    }
    /**
     * Khám phá quả mới trong Album.
     */
    async discoverFruit(tier) {
        const unlocked = this.score.getUnlockedTiers();
        const { isNewDiscovery, fruitInfo } = checkNewFruitUnlocked(tier, unlocked);
        if (isNewDiscovery) {
            await this.score.saveProgress();
        }
        return { isNew: isNewDiscovery, info: fruitInfo };
    }
    /**
     * Lấy cấu hình độ khó hiện tại của Daily Challenge.
     */
    getCurrentDailyDifficulty() {
        return getDailyDifficulty(this.score.dailyStreakCount);
    }
    /**
     * Khởi động chế độ Daily Challenge với độ khó tương ứng ngày hiện tại.
     */
    startDailyChallenge() {
        this.isDailyMode = true;
        this.recordGameplayStart();
        const todayStr = getTodayDateString();
        const seed = getDailySeed(todayStr);
        const diff = this.getCurrentDailyDifficulty();
        this.engine.setDailyMode(true, diff.fruitLimit);
        this.engine.reseed(seed);
        this.engine.startNewGame();
    }
    /**
     * Khởi động chế độ Cổ điển (Classic Mode).
     */
    startClassicMode() {
        this.isDailyMode = false;
        this.recordGameplayStart();
        this.engine.setDailyMode(false);
        this.startNewTurn();
    }
    /**
     * Đánh dấu hoàn thành Daily Challenge hôm nay và mở khóa phần thưởng mốc.
     */
    async recordDailyVictory(score) {
        const todayStr = getTodayDateString();
        const alreadyWonToday = this.isDailyCompletedToday();
        let milestoneReward = null;
        if (!alreadyWonToday) {
            this.score.dailyStreakCount = (this.score.dailyStreakCount || 0) + 1;
            milestoneReward = checkMilestoneJustUnlocked(this.score.dailyStreakCount);
            if (milestoneReward) {
                this.score.getUnlockedTiers().add(milestoneReward.tier);
            }
        }
        this.score.dailyCompletedDate = todayStr;
        this.score.dailyBestScore = Math.max(this.score.dailyBestScore ?? 0, score);
        await this.score.saveProgress();
        return { milestoneReward, currentStreak: this.score.dailyStreakCount };
    }
    isDailyCompletedToday() {
        return isDailyCompletedToday(this.score.dailyCompletedDate);
    }
    /** Start a fresh turn on Retry (M3-04): a brand-new random seed for run variety
     *  + a clean engine reset (score=0, playCount=0, continue available again). */
    startNewTurn() {
        this.recordGameplayStart();
        if (this.isDailyMode) {
            this.startDailyChallenge();
            return;
        }
        const seed = (Math.floor(Math.random() * 0x100000000)) >>> 0;
        this.engine.reseed(seed);
        this.engine.startNewGame();
    }
    /** Persist current best/progress when leaving gameplay (e.g. back to Start menu). */
    saveSession() {
        void this.score.saveProgress();
    }
    // --- Rewarded Ad Placements ------------------------------------------------
    /**
     * Xem quảng cáo để bơm thêm +2 lượt Swap và +2 lượt Shake ngay trong ván chơi.
     */
    async refillPowerupsViaAd() {
        const earned = await this.sdk.requestRewardedAd('powerup_refill');
        if (earned) {
            this.engine.powerups.swapCount += 2;
            this.engine.powerups.shakeCount += 2;
            return true;
        }
        return false;
    }
    /**
     * Xem quảng cáo để nhân đôi điểm số cuối trận (2X Final Score).
     */
    async doubleFinalScoreViaAd(currentScore) {
        const earned = await this.sdk.requestRewardedAd('double_score');
        if (earned) {
            const doubled = currentScore * 2;
            this.engine.state.score = doubled;
            await this.onGameOver(doubled);
            return doubled;
        }
        return null;
    }
    /**
     * Xem quảng cáo nhận thêm +15 lượt thả trong Daily Challenge khi hết lượt.
     */
    async grantDailyExtraDropsViaAd() {
        const earned = await this.sdk.requestRewardedAd('daily_extra_drops');
        if (earned) {
            this.engine.state.dailyDropsRemaining += 15;
            return true;
        }
        return false;
    }
    // --- Smart Interstitial Cooldown ------------------------------------------
    recordGameplayStart() {
        this.gameplayStartTime = Date.now();
    }
    /**
     * Kích hoạt Interstitial thông minh nếu đã chơi >= 40s và cách lần ad trước >= 80s.
     */
    async triggerSmartInterstitial() {
        const now = Date.now();
        const playedDuration = now - this.gameplayStartTime;
        const cooldownDuration = now - this.lastInterstitialTime;
        if (playedDuration >= 40000 && cooldownDuration >= 80000) {
            this.lastInterstitialTime = now;
            await this.sdk.requestInterstitialAd();
        }
    }
    async getLeaderboardEntries(quantityTop = 10, userScore = 0) {
        return this.sdk.getLeaderboardEntries('best_score', quantityTop, userScore);
    }
    audioEnabled = true;
    isAudioEnabled() {
        return this.audioEnabled && this.sdk.isAudioEnabled();
    }
    setAudioEnabled(enabled) {
        this.audioEnabled = enabled;
    }
}
export const ctx = new GameContext();
//# sourceMappingURL=context.js.map