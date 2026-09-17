// M3 Juicy Merge — Action Power-ups Logic (Pure TS, zero Phaser dependencies)
// Manages Hammer, Bomb, and Rainbow Wildcard interactions.
export const DEFAULT_INITIAL_INVENTORY = {
    hammer: 3,
    bomb: 2,
    rainbow: 2,
};
export const MAX_ACTION_POWERUPS = 99;
export const DEFAULT_BOMB_BLAST_RADIUS = 160;
export function createDefaultActionInventory() {
    return { ...DEFAULT_INITIAL_INVENTORY };
}
export function canUseActionPowerup(inventory, type) {
    return (inventory[type] || 0) > 0;
}
export function consumeActionPowerup(inventory, type) {
    if (!canUseActionPowerup(inventory, type)) {
        return false;
    }
    inventory[type]--;
    return true;
}
export function grantActionPowerup(inventory, type, count = 1) {
    const current = inventory[type] || 0;
    inventory[type] = Math.min(MAX_ACTION_POWERUPS, current + count);
    return inventory[type];
}
/**
 * Calculates which fruits and obstacles are inside the bomb blast area.
 */
export function evaluateBombBlast(explosionPos, blastRadius, fruitPositions, obstaclePositions) {
    const affectedFruitIds = [];
    const affectedObstacleIds = [];
    for (const fruit of fruitPositions) {
        const dx = fruit.x - explosionPos.x;
        const dy = fruit.y - explosionPos.y;
        if (dx * dx + dy * dy <= blastRadius * blastRadius) {
            affectedFruitIds.push(fruit.id);
        }
    }
    for (const obs of obstaclePositions) {
        const dx = obs.x - explosionPos.x;
        const dy = obs.y - explosionPos.y;
        if (dx * dx + dy * dy <= blastRadius * blastRadius) {
            affectedObstacleIds.push(obs.id);
        }
    }
    return { affectedFruitIds, affectedObstacleIds };
}
/**
 * Checks if a rainbow fruit can merge with a target fruit.
 * Rainbow wildcard can merge with any valid tier fruit up to maxTier - 1.
 */
export function canRainbowMergeWith(targetTier, maxTier = 14) {
    return targetTier >= 0 && targetTier < maxTier;
}
//# sourceMappingURL=action-powerups.js.map