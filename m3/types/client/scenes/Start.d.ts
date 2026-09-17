import Phaser from "phaser";
export declare class StartScene extends Phaser.Scene {
    private chainImages;
    private chainBackdrop?;
    private cornerImage?;
    private menuButtons;
    private logoContainer?;
    constructor();
    create(): void;
    /**
     * Daily Challenge Summary & Roadmap Modal
     */
    private showDailyChallengeModal;
    private createJuicyLogo;
    private startBgm;
    private drawFruitChain;
    private drawCornerDecor;
}
