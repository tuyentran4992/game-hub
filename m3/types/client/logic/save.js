// M3 Juicy Merge — Best-score & Stage Progress save/load (M3-08).
// Persists the best score, stage progression, action powerups, and daily challenge
// through an injectable SaveAdapter so the engine stays pure.
import { getUnlockedMilestoneTiers } from "./daily-challenge";
import { createDefaultActionInventory, canUseActionPowerup, consumeActionPowerup, grantActionPowerup, } from "./action-powerups";
/** Current save schema version. */
export const SAVE_SCHEMA_VERSION = 2;
/**
 * Best-score & Progression store backed by an injectable {@link SaveAdapter}.
 */
export class ScoreStore {
    adapter;
    bestScore = 0;
    unlockedTiers;
    dailyCompletedDate;
    dailyBestScore;
    dailyStreakCount = 0;
    unlockedStage = 1;
    stageStars = {};
    stageHighscores = {};
    powerups = createDefaultActionInventory();
    loaded = false;
    constructor(adapter) {
        this.adapter = adapter;
    }
    /** Load save payload from storage. Idempotent. Never throws (M3-08). */
    async load() {
        if (this.loaded)
            return;
        try {
            const data = (await this.adapter.loadData());
            this.bestScore =
                data && typeof data.best_score === "number" ? data.best_score : 0;
            if (data && Array.isArray(data.unlocked_tiers)) {
                this.unlockedTiers = new Set(data.unlocked_tiers);
            }
            this.dailyCompletedDate =
                data && typeof data.daily_completed_date === "string"
                    ? data.daily_completed_date
                    : null;
            this.dailyBestScore =
                data && typeof data.daily_best_score === "number"
                    ? data.daily_best_score
                    : 0;
            this.dailyStreakCount =
                data && typeof data.daily_streak_count === "number"
                    ? data.daily_streak_count
                    : 0;
            this.unlockedStage =
                data && typeof data.unlocked_stage === "number"
                    ? Math.max(1, data.unlocked_stage)
                    : 1;
            this.stageStars =
                data && typeof data.stage_stars === "object" && data.stage_stars !== null
                    ? { ...data.stage_stars }
                    : {};
            this.stageHighscores =
                data && typeof data.stage_highscores === "object" && data.stage_highscores !== null
                    ? { ...data.stage_highscores }
                    : {};
            this.powerups =
                data && typeof data.powerups === "object" && data.powerups !== null
                    ? {
                        hammer: typeof data.powerups.hammer === "number" ? data.powerups.hammer : 3,
                        bomb: typeof data.powerups.bomb === "number" ? data.powerups.bomb : 2,
                        rainbow: typeof data.powerups.rainbow === "number" ? data.powerups.rainbow : 2,
                    }
                    : createDefaultActionInventory();
            // Đồng bộ các quả Thần Thoại nếu streak đã đạt mốc
            if (this.dailyStreakCount > 0) {
                const milestoneTiers = getUnlockedMilestoneTiers(this.dailyStreakCount);
                const unlocked = this.getUnlockedTiers();
                for (const t of milestoneTiers) {
                    unlocked.add(t);
                }
            }
        }
        catch (e) {
            console.warn("loadData failed, starting fresh", e);
            this.bestScore = 0;
            this.unlockedTiers = undefined;
            this.dailyCompletedDate = null;
            this.dailyBestScore = 0;
            this.dailyStreakCount = 0;
            this.unlockedStage = 1;
            this.stageStars = {};
            this.stageHighscores = {};
            this.powerups = createDefaultActionInventory();
        }
        this.loaded = true;
    }
    /** Mark store as needing a reload. */
    reset() {
        this.bestScore = 0;
        this.loaded = false;
    }
    getUnlockedTiers() {
        if (!this.unlockedTiers) {
            this.unlockedTiers = new Set([0, 1]);
        }
        return this.unlockedTiers;
    }
    getUnlockedStage() {
        return this.unlockedStage;
    }
    getStageStars(stageId) {
        return this.stageStars[stageId] || 0;
    }
    getStageHighscore(stageId) {
        return this.stageHighscores[stageId] || 0;
    }
    async recordStageResult(stageId, stars, score) {
        const existingStars = this.stageStars[stageId] || 0;
        if (stars > existingStars) {
            this.stageStars[stageId] = stars;
        }
        const existingScore = this.stageHighscores[stageId] || 0;
        if (score > existingScore) {
            this.stageHighscores[stageId] = score;
        }
        if (stars > 0 && stageId >= this.unlockedStage && stageId < 30) {
            this.unlockedStage = stageId + 1;
        }
        await this.saveProgress();
    }
    canUsePowerup(type) {
        return canUseActionPowerup(this.powerups, type);
    }
    async consumePowerup(type) {
        const success = consumeActionPowerup(this.powerups, type);
        if (success) {
            await this.saveProgress();
        }
        return success;
    }
    async grantPowerup(type, count = 1) {
        const newCount = grantActionPowerup(this.powerups, type, count);
        await this.saveProgress();
        return newCount;
    }
    /**
     * Persist entire game progress.
     */
    async saveProgress() {
        const payload = {
            best_score: this.bestScore,
            unlocked_stage: this.unlockedStage,
            stage_stars: this.stageStars,
            stage_highscores: this.stageHighscores,
            powerups: this.powerups,
            schema_version: SAVE_SCHEMA_VERSION,
        };
        if (this.unlockedTiers && this.unlockedTiers.size > 0) {
            payload.unlocked_tiers = Array.from(this.unlockedTiers);
        }
        if (this.dailyCompletedDate) {
            payload.daily_completed_date = this.dailyCompletedDate;
        }
        if (typeof this.dailyBestScore === "number" && this.dailyBestScore > 0) {
            payload.daily_best_score = this.dailyBestScore;
        }
        if (typeof this.dailyStreakCount === "number" && this.dailyStreakCount > 0) {
            payload.daily_streak_count = this.dailyStreakCount;
        }
        try {
            return await this.adapter.saveData(payload);
        }
        catch (e) {
            console.warn("saveData failed, keeping session state", e);
            return false;
        }
    }
    /** Called on game over. If score strictly beats best → persist + sendScore once. */
    async onGameOver(score) {
        if (score > this.bestScore) {
            this.bestScore = score;
            await this.saveProgress();
            try {
                this.adapter.sendScore(this.bestScore);
            }
            catch (e) {
                console.warn("sendScore failed", e);
            }
        }
        return this.bestScore;
    }
}
//# sourceMappingURL=save.js.map