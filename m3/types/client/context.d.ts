import { MergeEngine } from './logic/merge-engine';
import { ScoreStore } from './logic/save';
import { type FruitInfo } from './logic/album';
import { type MilestoneReward, type DailyDifficulty } from './logic/daily-challenge';
declare class GameContext {
    readonly engine: MergeEngine;
    readonly sdk: import("@game/sdk").SDKHandler;
    readonly score: ScoreStore;
    isDailyMode: boolean;
    private lastInterstitialTime;
    private gameplayStartTime;
    constructor();
    /** Load persisted best score before play (M3-08). Idempotent, never throws. */
    load(): Promise<void>;
    /** Called on game over: persist + report a new best if this run beat it (M3-08).
     *  Takes the score explicitly so a fast Retry (which zeroes state) can't race the
     *  async save and persist a 0. */
    onGameOver(score: number): Promise<number>;
    /**
     * Khám phá quả mới trong Album.
     */
    discoverFruit(tier: number): Promise<{
        isNew: boolean;
        info: FruitInfo;
    }>;
    /**
     * Lấy cấu hình độ khó hiện tại của Daily Challenge.
     */
    getCurrentDailyDifficulty(): DailyDifficulty;
    /**
     * Khởi động chế độ Daily Challenge với độ khó tương ứng ngày hiện tại.
     */
    startDailyChallenge(): void;
    /**
     * Khởi động chế độ Cổ điển (Classic Mode).
     */
    startClassicMode(): void;
    /**
     * Đánh dấu hoàn thành Daily Challenge hôm nay và mở khóa phần thưởng mốc.
     */
    recordDailyVictory(score: number): Promise<{
        milestoneReward: MilestoneReward | null;
        currentStreak: number;
    }>;
    isDailyCompletedToday(): boolean;
    /** Start a fresh turn on Retry (M3-04): a brand-new random seed for run variety
     *  + a clean engine reset (score=0, playCount=0, continue available again). */
    startNewTurn(): void;
    /** Persist current best/progress when leaving gameplay (e.g. back to Start menu). */
    saveSession(): void;
    /**
     * Xem quảng cáo để bơm thêm +2 lượt Swap và +2 lượt Shake ngay trong ván chơi.
     */
    refillPowerupsViaAd(): Promise<boolean>;
    /**
     * Xem quảng cáo để nhân đôi điểm số cuối trận (2X Final Score).
     */
    doubleFinalScoreViaAd(currentScore: number): Promise<number | null>;
    /**
     * Xem quảng cáo nhận thêm +15 lượt thả trong Daily Challenge khi hết lượt.
     */
    grantDailyExtraDropsViaAd(): Promise<boolean>;
    recordGameplayStart(): void;
    /**
     * Kích hoạt Interstitial thông minh nếu đã chơi >= 40s và cách lần ad trước >= 80s.
     */
    triggerSmartInterstitial(): Promise<void>;
    getLeaderboardEntries(quantityTop?: number, userScore?: number): Promise<import("@game/sdk").LeaderboardData>;
    private audioEnabled;
    isAudioEnabled(): boolean;
    setAudioEnabled(enabled: boolean): void;
}
export declare const ctx: GameContext;
export {};
