import Phaser from "phaser";
/** Sprite diameter (world px) per tier 0..14 — DESIGN-SPEC (48 → 320). */
export declare const FRUIT_SIZES: readonly number[];
/** Fallback fill color per tier (DESIGN-SPEC) for the geometric circle. */
export declare const FRUIT_COLORS: readonly string[];
/** Diameter of a fruit of {@link tier} (world px). */
export declare function fruitDiameter(tier: number): number;
/** Physics radius of a fruit of {@link tier} = diameter / 2. */
export declare function fruitRadius(tier: number): number;
/** Stable texture key for the generated geometric fallback (used when the real
 *  PNG sprite is missing — Phase C step 14b swaps in real sprites). */
export declare function fallbackKey(tier: number): string;
/**
 * Resolve a renderable texture key for {@link tier}: the real sprite if the Boot
 * loader has it, otherwise the generated geometric fallback (guaranteed to exist
 * after this call). Idempotent — safe to call every drop.
 */
export declare function resolveFruitTexture(scene: Phaser.Scene, tier: number): string;
