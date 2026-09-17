import { type ActionPowerupInventory, type ActionPowerupType } from "./action-powerups";
/** Edge-side persistence + score reporting. */
export interface SaveAdapter {
    loadData(): Promise<unknown | null>;
    saveData(data: unknown): Promise<boolean>;
    sendScore(score: number): void;
}
/** Persisted save payload. */
export interface SavePayload {
    best_score: number;
    unlocked_tiers?: number[];
    daily_completed_date?: string;
    daily_best_score?: number;
    daily_streak_count?: number;
    unlocked_stage?: number;
    stage_stars?: Record<number, number>;
    stage_highscores?: Record<number, number>;
    powerups?: ActionPowerupInventory;
    schema_version: number;
}
/** Current save schema version. */
export declare const SAVE_SCHEMA_VERSION = 2;
/**
 * Best-score & Progression store backed by an injectable {@link SaveAdapter}.
 */
export declare class ScoreStore {
    private readonly adapter;
    bestScore: number;
    unlockedTiers?: Set<number> | undefined;
    dailyCompletedDate?: string | null | undefined;
    dailyBestScore?: number | undefined;
    dailyStreakCount: number;
    unlockedStage: number;
    stageStars: Record<number, number>;
    stageHighscores: Record<number, number>;
    powerups: ActionPowerupInventory;
    private loaded;
    constructor(adapter: SaveAdapter);
    /** Load save payload from storage. Idempotent. Never throws (M3-08). */
    load(): Promise<void>;
    /** Mark store as needing a reload. */
    reset(): void;
    getUnlockedTiers(): Set<number>;
    getUnlockedStage(): number;
    getStageStars(stageId: number): number;
    getStageHighscore(stageId: number): number;
    recordStageResult(stageId: number, stars: number, score: number): Promise<void>;
    canUsePowerup(type: ActionPowerupType): boolean;
    consumePowerup(type: ActionPowerupType): Promise<boolean>;
    grantPowerup(type: ActionPowerupType, count?: number): Promise<number>;
    /**
     * Persist entire game progress.
     */
    saveProgress(): Promise<boolean>;
    /** Called on game over. If score strictly beats best → persist + sendScore once. */
    onGameOver(score: number): Promise<number>;
}
