import Phaser from "phaser";
export declare class LeaderboardModal {
    private scene;
    private root;
    private backdrop;
    private panel;
    constructor(scene: Phaser.Scene);
    private drawPanel;
    private loadAndRenderEntries;
    private drawRow;
    private drawMyRankCard;
    close(): void;
}
