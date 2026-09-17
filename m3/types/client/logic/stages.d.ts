import { type ObstacleInitConfig } from "./obstacles";
import { type ActionPowerupType } from "./action-powerups";
export type StageGoalType = "target_fruit" | "target_score" | "clear_obstacles";
export interface StageGoal {
    readonly type: StageGoalType;
    /** Fruit tier index (0: cherry, 1: strawberry ... 11: watermelon) */
    readonly targetTier?: number;
    /** Target count of fruit or obstacles */
    readonly targetCount?: number;
    /** Target score to achieve */
    readonly targetScore?: number;
}
export interface StageConfig {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly maxDrops: number;
    readonly goals: readonly StageGoal[];
    readonly obstacles?: readonly ObstacleInitConfig[];
    readonly starScores: readonly [number, number, number];
    readonly rewardPowerup?: ActionPowerupType;
    readonly rewardCount?: number;
}
/**
 * 30 Handcrafted stages designed for progression, depth, and variety.
 */
export declare const STAGES: readonly StageConfig[];
export declare function getStageConfig(stageId: number): StageConfig | undefined;
export declare function getAllStages(): readonly StageConfig[];
export interface StageProgressResult {
    isCompleted: boolean;
    isFailed: boolean;
    stars: number;
    progressSummary: string;
    goalsStatus: Array<{
        goal: StageGoal;
        met: boolean;
        current: number;
        target: number;
    }>;
}
export declare const FRUIT_TIER_NAMES: Record<number, string>;
export declare function evaluateStageProgress(stage: StageConfig, currentDrops: number, currentScore: number, tierCounts: Map<number, number>, remainingObstacles: number): StageProgressResult;
export declare function calculateTotalStars(stageStars: Record<number, number>): number;
