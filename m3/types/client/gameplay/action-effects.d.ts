import Phaser from "phaser";
/**
 * Plays the Hammer Smash animation: Hammer appears above, swoops down, strikes, shakes screen.
 */
export declare function playHammerSmashVfx(scene: Phaser.Scene, x: number, y: number, onStrike?: () => void): void;
/**
 * Plays the Bomb explosion animation: expanding shockwave, fire particles, camera shake.
 */
export declare function playBombExplosionVfx(scene: Phaser.Scene, x: number, y: number, blastRadius: number, onExplode?: () => void): void;
