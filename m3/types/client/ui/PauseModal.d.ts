import Phaser from "phaser";
export interface PauseModalCallbacks {
    onResume: () => void;
    onRestart: () => void;
    onHome: () => void;
}
export declare class PauseModal {
    private scene;
    private root;
    private callbacks;
    private soundBtnTxt;
    private isClosing;
    constructor(scene: Phaser.Scene, callbacks: PauseModalCallbacks);
    resume(): void;
    restart(): void;
    home(): void;
    destroy(): void;
}
