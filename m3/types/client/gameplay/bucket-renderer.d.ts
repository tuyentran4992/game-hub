import Phaser from 'phaser';
import type { BucketLayout } from './physics-layout';
/**
 * Configure Matter physics gravity, bounds, and walls for the bucket.
 */
export declare function setupPhysics(scene: Phaser.Scene, layout: BucketLayout): void;
/**
 * Build static Matter rectangle physics bodies for the left/right walls and floor.
 */
export declare function buildBucketWalls(scene: Phaser.Scene, layout: BucketLayout): void;
/**
 * Draw the bucket visuals: drop shadow, frosted acrylic backplate, glossy specular sheens,
 * cedar wood pillars with golden dome caps, sturdy foundation, and corner rivets.
 */
export declare function drawBucket(scene: Phaser.Scene, layout: BucketLayout): void;
/**
 * Create the danger line graphics object and draw initial stroke.
 */
export declare function createDangerLine(scene: Phaser.Scene, layout: BucketLayout): Phaser.GameObjects.Graphics;
/**
 * Draw the danger line dashed stroke with glowing halo.
 */
export declare function drawDangerLineStroke(g: Phaser.GameObjects.Graphics, layout: BucketLayout, alpha: number): void;
/**
 * Trigger or kill pulsing animation on the danger line depending on nearDanger state.
 */
export declare function refreshDangerLine(scene: Phaser.Scene, dangerLine: Phaser.GameObjects.Graphics, layout: BucketLayout, nearDanger: boolean): void;
