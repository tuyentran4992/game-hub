import Phaser from 'phaser';
import type { BucketLayout } from './physics-layout';
export interface ActionBarElements {
    container: Phaser.GameObjects.Container;
    hammerButtonBg: Phaser.GameObjects.Graphics;
    bombButtonBg: Phaser.GameObjects.Graphics;
    rainbowButtonBg: Phaser.GameObjects.Graphics;
    hammerCountText: Phaser.GameObjects.Text;
    bombCountText: Phaser.GameObjects.Text;
    rainbowCountText: Phaser.GameObjects.Text;
    hammerInstructionText: Phaser.GameObjects.Text;
}
export interface ActionBarState {
    isHammerMode: boolean;
    isBombActiveNext: boolean;
    isRainbowActiveNext: boolean;
    isGameOver: () => boolean;
}
export interface ActionBarCallbacks {
    promptRefillPowerups: () => void;
    refreshGhost: () => void;
    onActionUsed?: () => void;
}
export declare function createActionBar(scene: Phaser.Scene, layout: BucketLayout, state: ActionBarState, callbacks: ActionBarCallbacks): ActionBarElements;
export declare function renderActionButtonBg(g: Phaser.GameObjects.Graphics, w: number, h: number, colorHex: number, isActive: boolean): void;
export declare function updateActionBar(elements: ActionBarElements, state: ActionBarState): void;
export declare function onUseHammer(state: ActionBarState, callbacks: ActionBarCallbacks, elements: ActionBarElements): void;
export declare function onUseBomb(state: ActionBarState, callbacks: ActionBarCallbacks, elements: ActionBarElements): void;
export declare function onUseRainbow(state: ActionBarState, callbacks: ActionBarCallbacks, elements: ActionBarElements): void;
