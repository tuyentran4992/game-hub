import Phaser from 'phaser';
import type { DroppedFruit, PendingMerge, CollisionEventHandle, MatterBodyHandle, CollidingFruit } from './merge-handler';
import { type ObstacleGameObject } from './obstacle-sprite';
import { type ObstacleState } from '../logic/obstacles';
import { type StageConfig } from '../logic/stages';
export interface MergeProcessorContext {
    fruits: DroppedFruit[];
    fruitsById: Map<number, DroppedFruit>;
    mergingFruitIds: Set<number>;
    pendingMerges: PendingMerge[];
    nextFruitId: number;
    stageObstacleStates: ObstacleState[];
    stageObstacleObjects: Map<string, ObstacleGameObject>;
    stageCreatedTiers: Map<number, number>;
    stageConfig?: StageConfig | undefined;
    stageId?: number | undefined;
    stageDropsUsed: number;
    stageDropsRemaining: number;
    stageVictoryCelebrated: boolean;
    cosmicVictoryCelebrated: boolean;
    dailyVictoryCelebrated: boolean;
    gameOverTriggered: boolean;
    lastMotionMs: number;
    gameMode: 'classic' | 'stage' | 'daily';
    layout: {
        bucketTopY: number;
        bucketBottomY: number;
        bucketHeight: number;
        bucketX0: number;
        bucketX1: number;
        dangerY: number;
        spawnY: number;
    };
}
export interface MergeProcessorCallbacks {
    updateHud: () => void;
    flashCombo: () => void;
    floatScorePopup: (gain: number, x: number, y: number) => void;
    floatPowerupPopup: (text: string, x: number, y: number, colorHex: string) => void;
    celebrateNewRecord: () => void;
    celebrateNewFruitDiscovery: (name: string) => void;
    celebrateDailyVictory: (rewardName?: string) => void;
    showCosmicVictoryModal: () => void;
    triggerGameOver: () => void;
    playSfx: (key: string, volume?: number, detune?: number) => void;
}
export declare function fruitOf(body: MatterBodyHandle | null | undefined): CollidingFruit | null;
export declare function spawnFruit(scene: Phaser.Scene, tier: number, x: number, y: number, ctxState: MergeProcessorContext): DroppedFruit;
export declare function removeFruit(scene: Phaser.Scene, df: DroppedFruit, ctxState: MergeProcessorContext): void;
export declare function setupCollisions(scene: Phaser.Scene, ctxState: MergeProcessorContext, callbacks: MergeProcessorCallbacks): void;
export declare function handleCollisions(scene: Phaser.Scene, event: CollisionEventHandle, ctxState: MergeProcessorContext, callbacks: MergeProcessorCallbacks): void;
export declare function executeSingleMerge(scene: Phaser.Scene, aId: number, bId: number, newTier: number, scoreGain: number, ctxState: MergeProcessorContext, callbacks: MergeProcessorCallbacks): void;
export declare function detonateBomb(scene: Phaser.Scene, x: number, y: number, bombFruitId: number | undefined, ctxState: MergeProcessorContext, callbacks: MergeProcessorCallbacks): void;
export declare function getCombinedStageTiers(ctxState: MergeProcessorContext): Map<number, number>;
export declare function checkStageProgress(scene: Phaser.Scene, ctxState: MergeProcessorContext, callbacks: MergeProcessorCallbacks): void;
