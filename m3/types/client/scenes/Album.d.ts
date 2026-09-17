import Phaser from "phaser";
export declare class AlbumScene extends Phaser.Scene {
    private returnScene;
    constructor();
    init(data: {
        returnScene?: string;
    }): void;
    create(): void;
}
