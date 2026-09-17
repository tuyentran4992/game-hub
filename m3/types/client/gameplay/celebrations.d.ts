import Phaser from 'phaser';
export declare function celebrateNewRecord(scene: Phaser.Scene, dangerY: number, playSfx: (key: string, volume?: number, detune?: number) => void): void;
export declare function celebrateNewFruitDiscovery(scene: Phaser.Scene, dangerY: number, name: string, playSfx: (key: string, volume?: number, detune?: number) => void): void;
export declare function celebrateDailyVictory(scene: Phaser.Scene, dangerY: number, rewardName?: string, playSfx?: (key: string, volume?: number, detune?: number) => void): void;
export declare function showCosmicVictoryModal(scene: Phaser.Scene, playSfx: (key: string, volume?: number, detune?: number) => void): void;
export declare function floatScorePopup(scene: Phaser.Scene, gain: number, x: number, y: number): void;
