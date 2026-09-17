import Phaser from "phaser";
import { type ObstacleState } from "../logic/obstacles";
export interface ObstacleGameObject {
    state: ObstacleState;
    container: Phaser.GameObjects.Container;
    body?: MatterJS.BodyType | undefined;
    mainSprite: Phaser.GameObjects.Image;
    crackGraphics: Phaser.GameObjects.Graphics;
}
export declare function ensureObstacleTextures(scene: Phaser.Scene): void;
/**
 * Creates a visual and physics representation of an obstacle in the bucket.
 */
export declare function createObstacleVisual(scene: Phaser.Scene, state: ObstacleState, worldX: number, worldY: number): ObstacleGameObject;
/**
 * Updates crack visuals when an obstacle takes damage.
 */
export declare function updateObstacleDamageVisual(obsObj: ObstacleGameObject): void;
/**
 * Plays burst destruction VFX and removes the obstacle object.
 */
export declare function playObstacleDestructionEffect(scene: Phaser.Scene, obsObj: ObstacleGameObject): void;
