export type ActionPowerupType = "hammer" | "bomb" | "rainbow";
export interface ActionPowerupInventory {
    hammer: number;
    bomb: number;
    rainbow: number;
}
export declare const DEFAULT_INITIAL_INVENTORY: ActionPowerupInventory;
export declare const MAX_ACTION_POWERUPS = 99;
export declare const DEFAULT_BOMB_BLAST_RADIUS = 160;
export declare function createDefaultActionInventory(): ActionPowerupInventory;
export declare function canUseActionPowerup(inventory: ActionPowerupInventory, type: ActionPowerupType): boolean;
export declare function consumeActionPowerup(inventory: ActionPowerupInventory, type: ActionPowerupType): boolean;
export declare function grantActionPowerup(inventory: ActionPowerupInventory, type: ActionPowerupType, count?: number): number;
/**
 * Calculates which fruits and obstacles are inside the bomb blast area.
 */
export declare function evaluateBombBlast(explosionPos: {
    x: number;
    y: number;
}, blastRadius: number, fruitPositions: Array<{
    id: number;
    x: number;
    y: number;
}>, obstaclePositions: Array<{
    id: number;
    x: number;
    y: number;
}>): {
    affectedFruitIds: number[];
    affectedObstacleIds: number[];
};
/**
 * Checks if a rainbow fruit can merge with a target fruit.
 * Rainbow wildcard can merge with any valid tier fruit up to maxTier - 1.
 */
export declare function canRainbowMergeWith(targetTier: number, maxTier?: number): boolean;
