// M3 Juicy Merge — bucket/physics layout (PURE, testable).
// Computes the world geometry of the playfield from the camera size + config so
// Gameplay (render + Matter wiring) and the layout it implies stay decoupled from
// the magic numbers. Pure: no Phaser/scene dependency, fully unit-testable.
//
// Mobile-first portrait world (720×1280): the bucket fills most of the vertical
// space, centered horizontally, with the drop mouth near the top third.
import { CONFIG } from "../logic/config";
/**
 * Compute the bucket layout for a world of {@link width} × {@link height}.
 * The bucket sits flush with the bottom of the screen and occupies
 * `bucketHeightRatio` of the height (default 0.70), centered on X.
 */
export function computeBucketLayout(width, height, cfg = CONFIG) {
    const bucketWidth = Math.min(cfg.bucketWidth, width);
    const bottomMargin = 80;
    const bucketBottomY = height - bottomMargin;
    const bucketHeight = Math.round(bucketBottomY * cfg.bucketHeightRatio);
    const bucketX0 = Math.round((width - bucketWidth) / 2);
    const bucketX1 = bucketX0 + bucketWidth;
    const bucketTopY = bucketBottomY - bucketHeight;
    const spawnY = bucketTopY + Math.round(bucketHeight * cfg.dropStartRatio);
    const dangerY = bucketTopY + Math.round(bucketHeight * cfg.dangerLineRatio);
    return {
        bucketX0,
        bucketX1,
        bucketWidth,
        bucketTopY,
        bucketBottomY,
        bucketHeight,
        spawnY,
        dangerY,
        wallThickness: 24,
    };
}
export const computeLayout = computeBucketLayout;
//# sourceMappingURL=physics-layout.js.map