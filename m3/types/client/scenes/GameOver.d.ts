import Phaser from "phaser";
export interface GameOverInitData {
    isStageMode?: boolean;
    stageId?: number;
    isStageVictory?: boolean;
    stars?: number;
    score?: number;
}
export declare class GameOverScene extends Phaser.Scene {
    private continueBtn;
    private initData;
    constructor();
    init(data?: GameOverInitData): void;
    create(): void;
    private renderStageResultContent;
    private renderStandardResultContent;
    private showRecordBadge;
    private onContinue;
    private onRetry;
    private playClickSfx;
}
