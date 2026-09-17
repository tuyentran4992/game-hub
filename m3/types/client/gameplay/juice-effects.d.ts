import type Phaser from "phaser";
/** Musical detune scale in cents for combo streaks (Do-Re-Mi-Fa-Sol-La-Si-Do). */
export declare const COMBO_DETUNE_STEPS: readonly number[];
/**
 * Compute the musical pitch detune (in cents) for a given combo streak count.
 * Pure function, fully unit-testable.
 */
export declare function computeComboDetune(comboCount: number): number;
/**
 * Resolve the hex color number for juice particles based on fruit tier.
 * Pure function, fully unit-testable.
 */
export declare function getFruitJuiceColor(tier: number): number;
/**
 * Spawn radial juice droplets that burst outward, decelerate, and fade out.
 */
export declare function playJuiceSplash(scene: Phaser.Scene, x: number, y: number, tier: number): void;
/**
 * Spawn celebratory star bursts for high-tier merges (optimized particle count).
 */
export declare function playStarBurst(scene: Phaser.Scene, x: number, y: number, depth?: number): void;
/**
 * Spawns an individual multi-layered firework explosion with glowing sparks and confetti (optimized).
 */
export declare function spawnFireworkBurst(scene: Phaser.Scene, x: number, y: number, depth?: number): void;
/**
 * Launch a full multi-rocket firework celebration show across the screen.
 */
export declare function playFireworksCelebration(scene: Phaser.Scene, burstCount?: number, depth?: number): void;
/**
 * Trigger jackpot climax for high tier (Melon / Watermelon / Cosmic):
 * Gentle screen pop + crisp fireworks.
 */
export declare function playJackpotClimax(scene: Phaser.Scene, x: number, y: number, depth?: number): void;
/**
 * Visual and particle effects for hammer smash on fruit or obstacle.
 */
export declare function playHammerSmashVfx(scene: Phaser.Scene, x: number, y: number, onHit?: () => void): void;
/**
 * Visual and particle explosion effect for bomb blast.
 */
export declare function playBombExplosionVfx(scene: Phaser.Scene, x: number, y: number, radius: number, onDetonate?: () => void): void;
