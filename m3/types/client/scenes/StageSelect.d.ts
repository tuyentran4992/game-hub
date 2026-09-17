import Phaser from "phaser";
export declare class StageSelectScene extends Phaser.Scene {
    private currentPage;
    private totalPages;
    private cardsContainer;
    private pageIndicatorText;
    constructor();
    create(): void;
    private playClickSfx;
    private createHeader;
    private renderCurrentPage;
    private createStageNode;
    private createPaginationControls;
    private updatePage;
}
