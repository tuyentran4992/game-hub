export type ObstacleType = "ice" | "crate" | "bubble";
export interface ObstacleState {
    readonly id: number;
    readonly type: ObstacleType;
    /** Normalized X position within bucket (0 = left wall, 1 = right wall) or world px */
    readonly xRatio: number;
    /** Normalized Y position within bucket (0 = top, 1 = bottom) or world px */
    readonly yRatio: number;
    readonly width: number;
    readonly height: number;
    hp: number;
    readonly maxHp: number;
    isDestroyed: boolean;
    /** Fruit tier trapped inside if this is a bubble obstacle */
    readonly containedFruitTier?: number | undefined;
}
export interface ObstacleInitConfig {
    id: number;
    type: ObstacleType;
    xRatio: number;
    yRatio: number;
    width?: number;
    height?: number;
    hp?: number;
    containedFruitTier?: number;
}
export declare const DEFAULT_OBSTACLE_SIZES: Record<ObstacleType, {
    width: number;
    height: number;
    defaultHp: number;
}>;
export declare const DEFAULT_MERGE_DAMAGE_RADIUS = 130;
export declare function createObstacle(config: ObstacleInitConfig): ObstacleState;
export declare function damageObstacle(obstacle: ObstacleState, damage?: number): {
    obstacle: ObstacleState;
    wasDestroyed: boolean;
};
export declare function calculateDistance(x1: number, y1: number, x2: number, y2: number): number;
/**
 * Checks for obstacles near a merge event and applies damage to them.
 * When fruits merge, the resulting shockwave damages nearby ice, crates, and bubbles.
 */
export declare function evaluateObstacleDamageOnMerge(mergePos: {
    x: number;
    y: number;
}, obstacles: ObstacleState[], obstacleWorldPositions: Map<number, {
    x: number;
    y: number;
}>, damageRadius?: number): {
    damaged: ObstacleState[];
    destroyed: ObstacleState[];
};
export declare function getActiveObstacleCount(obstacles: ObstacleState[]): number;
export declare function areAllObstaclesCleared(obstacles: ObstacleState[]): boolean;
