import Phaser from 'phaser';
import type { BucketLayout } from './physics-layout';
import { type StageConfig } from '../logic/stages';
import type { ObstacleState } from '../logic/obstacles';
export interface HudElements {
    scoreText: Phaser.GameObjects.Text;
    bestScoreText: Phaser.GameObjects.Text;
    swapButtonContainer?: Phaser.GameObjects.Container | undefined;
    swapCountText?: Phaser.GameObjects.Text | undefined;
    shakeButtonContainer?: Phaser.GameObjects.Container | undefined;
    shakeCountText?: Phaser.GameObjects.Text | undefined;
    nextPreview1: Phaser.GameObjects.Image;
    nextPreview2: Phaser.GameObjects.Image;
    dailyBannerText?: Phaser.GameObjects.Text | undefined;
    stageBannerText?: Phaser.GameObjects.Text | undefined;
    comboPopup: Phaser.GameObjects.Text;
}
export interface HudCallbacks {
    onSwap: () => void;
    onShake: () => void;
    onPause: () => void;
    onOpenAlbum: () => void;
}
export interface HudContextState {
    gameMode: 'classic' | 'stage' | 'daily';
    stageId?: number | undefined;
    stageConfig?: StageConfig | undefined;
    stageDropsRemaining?: number | undefined;
    stageDropsUsed?: number | undefined;
    stageObstacleStates?: ObstacleState[] | undefined;
    getCombinedStageTiers?: (() => Map<number, number>) | undefined;
    onUpdateActionBar?: (() => void) | undefined;
}
export declare function createHud(scene: Phaser.Scene, layout: BucketLayout, callbacks: HudCallbacks, state: HudContextState): HudElements;
export declare function updateHud(scene: Phaser.Scene, elements: HudElements, state: HudContextState): void;
export declare function updateNextFruitHud(scene: Phaser.Scene, elements: HudElements): void;
export declare function createComboPopup(scene: Phaser.Scene, layout: BucketLayout): Phaser.GameObjects.Text;
export declare function flashCombo(scene: Phaser.Scene, comboPopup: Phaser.GameObjects.Text): void;
export declare function floatPowerupPopup(scene: Phaser.Scene, text: string, x: number, y: number, colorHex: string): void;
