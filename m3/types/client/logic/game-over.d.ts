/** Minimal fruit shape the check needs. Scene fruit objects satisfy this structurally. */
export interface FruitPos {
    /** Center y in world/physics coordinates. */
    y: number;
    /** 0-based chain tier (unused by the check but part of the real fruit shape). */
    tier?: number;
}
/**
 * Pure gate: true iff the world has settled AND at least one fruit's center is
 * above the danger line (`y < dangerY`). Scene owns settle detection (Bước 11).
 *
 * @param fruits   fruits currently in the bucket.
 * @param dangerY  y-coordinate of the danger line (fruits with y < dangerY are above it).
 * @param settled  whether all bodies have come to rest (scene-derived).
 */
export declare function checkGameOver(fruits: readonly FruitPos[], dangerY: number, settled: boolean): boolean;
