// M3 Juicy Merge — Gameplay Scene (Orchestrator)
// Coordinates physics, HUD, action bar, input, merge processor, and celebrations.
import Phaser from 'phaser';
import { ctx } from '../context';
import { dur } from '../tokens';
import { PauseModal } from '../ui/PauseModal';
import { promptRefillPowerupsModal, showDailyExtraDropsModal } from '../ui/powerup-modals';
import { computeLayout } from '../gameplay/physics-layout';
import { isWorldSettled } from '../logic/settle';
import { checkGameOver } from '../logic/game-over';
import { createObstacleVisual } from '../gameplay/obstacle-sprite';
import { createObstacle } from '../logic/obstacles';
import { getStageConfig } from '../logic/stages';
import { fruitRadius } from '../gameplay/fruit-sprite';
import { setupPhysics, drawBucket, createDangerLine, refreshDangerLine } from '../gameplay/bucket-renderer';
import { createHud, updateHud, flashCombo, floatPowerupPopup } from '../gameplay/hud-manager';
import { createActionBar, updateActionBar } from '../gameplay/action-bar';
import { createGhost, refreshGhost, createAimLine, refreshAimLine, bindInput, onSwapFruit, onShakeBucket } from '../gameplay/input-controller';
import { setupCollisions, spawnFruit, removeFruit, getCombinedStageTiers } from '../gameplay/merge-processor';
import { celebrateNewRecord, celebrateNewFruitDiscovery, celebrateDailyVictory, showCosmicVictoryModal, floatScorePopup } from '../gameplay/celebrations';
export class GameplayScene extends Phaser.Scene {
    gameMode = 'classic';
    stageId = 1;
    stageConfig = undefined;
    stageDropsRemaining = 0;
    stageDropsUsed = 0;
    stageCreatedTiers = new Map();
    stageObstacleStates = [];
    stageObstacleObjects = new Map();
    stageVictoryCelebrated = false;
    fruits = [];
    fruitsById = new Map();
    mergingFruitIds = new Set();
    pendingMerges = [];
    nextFruitId = 1;
    layout;
    ghostTier = 0;
    ghostX = 0;
    ghost;
    aimLine;
    dangerLine;
    hudElements;
    actionBarElements = undefined;
    isHammerMode = false;
    isBombActiveNext = false;
    isRainbowActiveNext = false;
    isShakingBucket = false;
    isPaused = false;
    isPromptingRefill = false;
    gameOverTriggered = false;
    cosmicVictoryCelebrated = false;
    dailyVictoryCelebrated = false;
    hasClaimedDailyExtraDrops = false;
    wasNearDanger = false;
    lastMotionMs = 0;
    lastUiClickTime = 0;
    sceneStartTime = 0;
    constructor() {
        super('GameplayScene');
    }
    init(data) {
        if (data?.mode === 'daily' || data?.isDailyMode || ctx.isDailyMode) {
            this.gameMode = 'daily';
            ctx.isDailyMode = true;
            this.stageConfig = undefined;
        }
        else if (data?.mode === 'stage' || data?.isStageMode) {
            this.gameMode = 'stage';
            this.stageId = data.stageId ?? 1;
            this.stageConfig = getStageConfig(this.stageId);
            ctx.isDailyMode = false;
        }
        else {
            this.gameMode = 'classic';
            ctx.isDailyMode = false;
            this.stageConfig = undefined;
        }
        this.fruits = [];
        this.fruitsById.clear();
        this.mergingFruitIds.clear();
        this.pendingMerges = [];
        this.nextFruitId = 1;
        this.wasNearDanger = false;
        this.isPaused = false;
        this.isPromptingRefill = false;
        this.gameOverTriggered = false;
        this.cosmicVictoryCelebrated = false;
        this.dailyVictoryCelebrated = false;
        this.hasClaimedDailyExtraDrops = false;
        this.isHammerMode = false;
        this.isBombActiveNext = false;
        this.isRainbowActiveNext = false;
        this.isShakingBucket = false;
        this.stageVictoryCelebrated = false;
        this.stageCreatedTiers.clear();
        this.stageObstacleObjects.clear();
        this.stageObstacleStates = [];
        if (this.gameMode === 'stage' && this.stageConfig) {
            this.stageDropsRemaining = this.stageConfig.maxDrops;
            this.stageDropsUsed = 0;
            this.stageObstacleStates = (this.stageConfig.obstacles || []).map((o) => createObstacle(o));
        }
        this.sceneStartTime = this.time ? this.time.now : 0;
        this.lastUiClickTime = this.sceneStartTime;
        this.lastMotionMs = this.sceneStartTime;
    }
    create() {
        const { width, height } = this.scale;
        this.sceneStartTime = this.time.now;
        this.lastUiClickTime = this.time.now;
        this.lastMotionMs = this.time.now;
        this.layout = computeLayout(width, height);
        setupPhysics(this, this.layout);
        if (this.textures.exists('bg_gradient')) {
            const bg = this.add.image(width / 2, height / 2, 'bg_gradient').setDisplaySize(width, height).setDepth(-10);
            bg.setData('testid', 'game-bg');
        }
        drawBucket(this, this.layout);
        this.aimLine = createAimLine(this);
        this.dangerLine = createDangerLine(this, this.layout);
        if (!ctx.engine.state.gameOver)
            ctx.engine.startNewGame();
        this.ghostTier = ctx.engine.nextFruit();
        this.ghostX = (this.layout.bucketX0 + this.layout.bucketX1) / 2;
        this.ghost = createGhost(this, this.layout, this.ghostX, this.ghostTier);
        refreshGhost(this, this.layout, this.getControllerState());
        if (this.gameMode === 'stage') {
            for (const obsState of this.stageObstacleStates) {
                const worldX = this.layout.bucketX0 + this.layout.bucketWidth * obsState.xRatio;
                const worldY = this.layout.bucketTopY + this.layout.bucketHeight * obsState.yRatio;
                const obsObj = createObstacleVisual(this, obsState, worldX, worldY);
                this.stageObstacleObjects.set(String(obsState.id), obsObj);
            }
        }
        this.hudElements = createHud(this, this.layout, {
            onSwap: () => onSwapFruit(this, this.layout, this.getControllerState(), this.getControllerCallbacks()),
            onShake: () => onShakeBucket(this, this.getControllerState(), this.getControllerCallbacks()),
            onPause: () => this.onPauseGame(),
            onOpenAlbum: () => {
                this.lastUiClickTime = this.time.now;
                this.scene.pause();
                this.scene.launch('AlbumScene', { returnScene: 'GameplayScene' });
            },
        }, {
            gameMode: this.gameMode,
            stageId: this.stageId,
            stageConfig: this.stageConfig,
            stageDropsRemaining: this.stageDropsRemaining,
            stageDropsUsed: this.stageDropsUsed,
            stageObstacleStates: this.stageObstacleStates,
            getCombinedStageTiers: () => getCombinedStageTiers(this),
            onUpdateActionBar: () => {
                if (this.actionBarElements)
                    updateActionBar(this.actionBarElements, this.getActionBarState());
            },
        });
        if (this.gameMode === 'stage') {
            this.actionBarElements = createActionBar(this, this.layout, this.getActionBarState(), {
                promptRefillPowerups: () => this.promptRefillPowerups(),
                refreshGhost: () => refreshGhost(this, this.layout, this.getControllerState()),
            });
        }
        bindInput(this, this.layout, this.getControllerState(), this.getControllerCallbacks());
        setupCollisions(this, this, this.getMergeProcessorCallbacks());
        this.events.on('resume', () => {
            this.isPaused = false;
            this.lastMotionMs = this.time.now;
            this.lastUiClickTime = this.time.now;
            this.matter.world.resume();
            refreshAimLine(this.aimLine, this.layout, this.ghostX, this.ghostTier, this.gameOverTriggered);
        });
        this.events.on('pause', () => {
            this.aimLine.clear();
            this.matter.world.pause();
        });
    }
    update(time, _delta) {
        if (this.isPaused)
            return;
        if (this.gameOverTriggered)
            return;
        if (this.fruits.length === 0 || this.isShakingBucket) {
            this.lastMotionMs = time;
            if (this.wasNearDanger) {
                this.wasNearDanger = false;
                refreshDangerLine(this, this.dangerLine, this.layout, false);
            }
            return;
        }
        const atRest = this.fruits.map((f) => {
            const b = f.obj.body;
            if (!b)
                return true;
            const spawnTime = f.obj.getData('spawnTime') || 0;
            if (time - spawnTime < 600)
                return false;
            if (b.isSleeping)
                return true;
            const speed = typeof b.speed === 'number' ? b.speed : Math.sqrt((b.velocity?.x ?? 0) ** 2 + (b.velocity?.y ?? 0) ** 2);
            return speed < 0.5;
        });
        const anyMoving = atRest.some((r) => !r);
        if (anyMoving)
            this.lastMotionMs = time;
        const settled = isWorldSettled(atRest, time, this.lastMotionMs, 500);
        const nearDanger = this.fruits.some((f) => f.obj.y - fruitRadius(f.tier) <= this.layout.dangerY + 30);
        if (nearDanger !== this.wasNearDanger) {
            this.wasNearDanger = nearDanger;
            refreshDangerLine(this, this.dangerLine, this.layout, nearDanger);
            if (nearDanger)
                this.playSfx('sfx_danger', 0.4);
        }
        if (settled) {
            const fruitPositions = this.fruits.map((f) => ({ y: f.obj.y, tier: f.tier }));
            if (checkGameOver(fruitPositions, this.layout.dangerY, true)) {
                this.triggerGameOver();
            }
        }
    }
    getActionBarState() {
        return {
            isHammerMode: this.isHammerMode,
            isBombActiveNext: this.isBombActiveNext,
            isRainbowActiveNext: this.isRainbowActiveNext,
            isGameOver: () => this.isGameOver(),
        };
    }
    getControllerState() {
        return {
            ghostX: this.ghostX,
            ghostTier: this.ghostTier,
            isHammerMode: this.isHammerMode,
            isBombActiveNext: this.isBombActiveNext,
            isRainbowActiveNext: this.isRainbowActiveNext,
            isShakingBucket: this.isShakingBucket,
            isPaused: this.isPaused,
            gameOverTriggered: this.gameOverTriggered,
            sceneStartTime: this.sceneStartTime,
            lastUiClickTime: this.lastUiClickTime,
            lastMotionMs: this.lastMotionMs,
            gameMode: this.gameMode,
            stageDropsUsed: this.stageDropsUsed,
            stageDropsRemaining: this.stageDropsRemaining,
            stageConfig: this.stageConfig,
            hasClaimedDailyExtraDrops: this.hasClaimedDailyExtraDrops,
            fruits: this.fruits,
            stageObstacleObjects: this.stageObstacleObjects,
            ghost: this.ghost,
            aimLine: this.aimLine,
            hammerInstructionText: this.actionBarElements?.hammerInstructionText,
            swapButtonContainer: this.hudElements?.swapButtonContainer,
            shakeButtonContainer: this.hudElements?.shakeButtonContainer,
        };
    }
    getControllerCallbacks() {
        return {
            promptRefillPowerups: () => this.promptRefillPowerups(),
            updateHud: () => this.updateHudState(),
            updateActionBar: () => {
                if (this.actionBarElements)
                    updateActionBar(this.actionBarElements, this.getActionBarState());
            },
            spawnFruit: (tier, x, y) => spawnFruit(this, tier, x, y, this),
            removeFruit: (fruit) => removeFruit(this, fruit, this),
            checkStageProgress: () => { },
            showDailyExtraDropsModal: () => this.showDailyExtraDropsModal(),
            triggerGameOver: () => this.triggerGameOver(),
            playSfx: (key, v, d) => this.playSfx(key, v, d),
        };
    }
    getMergeProcessorCallbacks() {
        return {
            updateHud: () => this.updateHudState(),
            flashCombo: () => flashCombo(this, this.hudElements.comboPopup),
            floatScorePopup: (gain, x, y) => floatScorePopup(this, gain, x, y),
            floatPowerupPopup: (text, x, y, colorHex) => floatPowerupPopup(this, text, x, y, colorHex),
            celebrateNewRecord: () => celebrateNewRecord(this, this.layout.dangerY, (k, v, d) => this.playSfx(k, v, d)),
            celebrateNewFruitDiscovery: (name) => celebrateNewFruitDiscovery(this, this.layout.dangerY, name, (k, v, d) => this.playSfx(k, v, d)),
            celebrateDailyVictory: (rewardName) => celebrateDailyVictory(this, this.layout.dangerY, rewardName, (k, v, d) => this.playSfx(k, v, d)),
            showCosmicVictoryModal: () => showCosmicVictoryModal(this, (k, v, d) => this.playSfx(k, v, d)),
            triggerGameOver: () => this.triggerGameOver(),
            playSfx: (key, v, d) => this.playSfx(key, v, d),
        };
    }
    updateHudState() {
        if (this.hudElements) {
            updateHud(this, this.hudElements, {
                gameMode: this.gameMode,
                stageId: this.stageId,
                stageConfig: this.stageConfig,
                stageDropsRemaining: this.stageDropsRemaining,
                stageDropsUsed: this.stageDropsUsed,
                stageObstacleStates: this.stageObstacleStates,
                getCombinedStageTiers: () => getCombinedStageTiers(this),
                onUpdateActionBar: () => {
                    if (this.actionBarElements)
                        updateActionBar(this.actionBarElements, this.getActionBarState());
                },
            });
        }
    }
    triggerGameOver() {
        if (this.gameOverTriggered)
            return;
        this.gameOverTriggered = true;
        ctx.engine.setGameOver(true, false);
        this.playSfx('sfx_gameover');
        this.matter.world.pause();
        this.aimLine.clear();
        this.time.delayedCall(dur.fast, () => {
            this.scene.pause();
            this.scene.launch('GameOverScene', {
                isDailyMode: this.gameMode === 'daily',
                isStageMode: this.gameMode === 'stage',
                stageId: this.stageId,
                isStageVictory: false,
                score: ctx.engine.state.score,
            });
        });
    }
    isGameOver() {
        return this.gameOverTriggered;
    }
    clearFruitsAboveDanger() {
        const dangerY = this.layout.dangerY;
        for (const f of [...this.fruits]) {
            if (f.obj.y - fruitRadius(f.tier) <= dangerY + 40) {
                removeFruit(this, f, this);
            }
        }
        this.wasNearDanger = false;
        this.gameOverTriggered = false;
        ctx.engine.setGameOver(false, false);
        refreshDangerLine(this, this.dangerLine, this.layout, false);
        this.matter.world.resume();
        this.lastMotionMs = this.time.now;
        this.updateHudState();
    }
    getLastMotionMs() {
        return this.lastMotionMs;
    }
    isNearDanger() {
        return this.wasNearDanger;
    }
    playSfx(key, volume = 0.5, detune = 0) {
        if (!this.sound.get(key) && !this.cache.audio.exists(key))
            return;
        this.sound.play(key, { volume, detune });
    }
    onPauseGame() {
        if (this.gameOverTriggered || this.isPromptingRefill || this.isPaused)
            return;
        this.isPaused = true;
        this.matter.world.pause();
        this.aimLine.clear();
        new PauseModal(this, {
            onResume: () => {
                this.isPaused = false;
                this.lastMotionMs = this.time.now;
                this.lastUiClickTime = this.time.now;
                this.matter.world.resume();
                refreshAimLine(this.aimLine, this.layout, this.ghostX, this.ghostTier, this.gameOverTriggered);
            },
            onRestart: () => {
                this.isPaused = false;
                this.lastMotionMs = this.time.now;
                this.lastUiClickTime = this.time.now;
                this.matter.world.resume();
                ctx.engine.startNewGame();
                for (const f of [...this.fruits])
                    removeFruit(this, f, this);
                this.fruits = [];
                this.ghostTier = ctx.engine.nextFruit();
                refreshGhost(this, this.layout, this.getControllerState());
                this.updateHudState();
                refreshAimLine(this.aimLine, this.layout, this.ghostX, this.ghostTier, this.gameOverTriggered);
            },
            onHome: async () => {
                this.isPaused = false;
                await ctx.triggerSmartInterstitial();
                this.scene.stop('GameplayScene');
                this.scene.start('StartScene');
            },
        });
    }
    promptRefillPowerups() {
        if (this.isPromptingRefill || this.gameOverTriggered)
            return;
        this.isPromptingRefill = true;
        promptRefillPowerupsModal(this, () => this.updateHudState(), () => { this.isPromptingRefill = false; });
    }
    showDailyExtraDropsModal() {
        if (this.gameOverTriggered)
            return;
        showDailyExtraDropsModal(this, () => {
            this.hasClaimedDailyExtraDrops = true;
            this.updateHudState();
        }, () => this.triggerGameOver());
    }
}
//# sourceMappingURL=Gameplay.js.map