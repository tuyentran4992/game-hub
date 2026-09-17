import { type MechanicsConfig } from "../logic/config";
export interface BucketLayout {
    /** Left inner edge X of the bucket playfield. */
    readonly bucketX0: number;
    /** Right inner edge X of the bucket playfield. */
    readonly bucketX1: number;
    /** Inner width of the bucket (CONFIG.bucketWidth). */
    readonly bucketWidth: number;
    /** Top (mouth) Y of the bucket. */
    readonly bucketTopY: number;
    /** Bottom (floor) Y of the bucket. */
    readonly bucketBottomY: number;
    /** Inner height of the bucket. */
    readonly bucketHeight: number;
    /** Y where the ghost hovers / a dropped fruit spawns (bucket mouth). */
    readonly spawnY: number;
    /** Danger-line Y (M3-03) — ~20% into the bucket from the mouth (used in step 11). */
    readonly dangerY: number;
    /** Visual + physics thickness of the bucket walls/floor. */
    readonly wallThickness: number;
}
/**
 * Compute the bucket layout for a world of {@link width} × {@link height}.
 * The bucket sits flush with the bottom of the screen and occupies
 * `bucketHeightRatio` of the height (default 0.70), centered on X.
 */
export declare function computeBucketLayout(width: number, height: number, cfg?: MechanicsConfig): BucketLayout;
export declare const computeLayout: typeof computeBucketLayout;
