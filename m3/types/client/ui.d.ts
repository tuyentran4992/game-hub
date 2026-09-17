import Phaser from "phaser";
export interface ButtonOpts {
    testid?: string;
    variant?: "primary" | "ghost" | "amber" | "emerald" | "purple" | "gold";
    width?: number;
    height?: number;
    fontSize?: number;
    textColor?: string;
    icon?: string;
    enableShimmer?: boolean;
}
export interface ButtonResult {
    container: Phaser.GameObjects.Container;
    textObj: Phaser.GameObjects.Text;
}
/**
 * 3D Chunky Candy Button (Playgama / Poki Top-Tier Visual Standard):
 * - Soft ambient bottom drop shadow (6px)
 * - 3D dark bottom bevel extrusion (10px depth)
 * - Top glossy specular highlight sheen arc
 * - Shimmer light sweep animation across button face
 * - Bold punchy typography with double stroke and drop shadow
 * - Bouncy spring press physics
 */
export declare function drawButton(scene: Phaser.Scene, x: number, y: number, label: string, opts?: ButtonOpts): ButtonResult;
/**
 * Draw modern ambient tropical sunset skybox with radial spotlight and floating light sparkles.
 */
export declare function drawBackground(scene: Phaser.Scene): void;
/**
 * Draw a Frosted Glass Card Panel with smooth rounded corners, drop shadow, and clean border.
 */
export declare function drawFrostedCard(scene: Phaser.Scene, x: number, y: number, w: number, h: number, rad?: number, strokeColor?: number): Phaser.GameObjects.Graphics;
/**
 * Draw a 3D Toy-Style Embossed HUD Badge (Score / Powerup / Status)
 */
export declare function draw3DBadge(scene: Phaser.Scene, x: number, y: number, w: number, h: number, baseColor: number, bevelColor: number, rad?: number): Phaser.GameObjects.Container;
export declare function isUserMuted(): boolean;
export declare function applyMute(game: Phaser.Game, sdkAudioEnabled?: boolean): void;
export declare function drawMuteButton(scene: Phaser.Scene): Phaser.GameObjects.Container;
export declare function drawLeaderboardButton(scene: Phaser.Scene, x?: number, y?: number): Phaser.GameObjects.Container;
