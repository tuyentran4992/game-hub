import { type PowerupState } from "./powerups";
export interface FruitSpec {
    tier: number;
    chain: string[];
    score: number[];
}
export declare const CHAIN12: readonly string[];
export declare const SCORE_TIER: readonly number[];
export interface MergeState {
    score: number;
    bestScore: number;
    comboCount: number;
    lastMergeTime: number;
    lastDropTime: number;
    gameOver: boolean;
    continueUsed: boolean;
    continueMax: number;
    playCount: number;
    seed: number;
    isDailyMode: boolean;
    dailyDropsRemaining: number;
}
export declare class MergeEngine {
    state: MergeState;
    powerups: PowerupState;
    private dropQueue;
    constructor(seed?: number);
    /** Snapshot of the next 2 upcoming fruit tiers (preview). Pure: no state side effect beyond queue advance. */
    peekNext(): readonly number[];
    /** Consume the next fruit tier to drop and refill the queue. */
    nextFruit(): number;
    /** Pure gate: true iff enough time has passed since the last drop AND not game-over.
     *  No side effect — caller must call {@link recordDrop} when it actually drops. */
    canDrop(nowMs: number): boolean;
    /** Record that a drop happened at {@link nowMs} (advances the cooldown timer). */
    recordDrop(nowMs: number): void;
    setDailyMode(enabled: boolean, fruitLimit?: number): void;
    /** New run with a fresh seed (Retry, M3 §7). Defaults to the stored seed. */
    reseed(seed?: number): void;
    merge(aTier: number, bTier: number, nowMs?: number): {
        tier: number;
        scoreGain: number;
    } | null;
    setGameOver(onDanger: boolean, settled: boolean): boolean;
    canContinue(): boolean;
    /** Consume the rewarded continue (earned): clear game over, resume play. Marks
     *  continueUsed so a 2nd game-over this turn falls through to interstitial. */
    useContinue(): void;
    /** Interstitial only from the 2nd game-over onward within a turn (M3-07).
     *  playCount resets each new turn (startNewGame), so a fresh run never starts
     *  with an interstitial. */
    shouldShowInterstitial(): boolean;
    canSwap(): boolean;
    swapGhost(currentGhostTier: number): {
        success: boolean;
        newGhostTier: number;
    };
    canShake(): boolean;
    useShake(): boolean;
    addSwap(count?: number): number;
    addShake(count?: number): number;
    /**
     * Process rewards after each merge:
     * - Combo reward (x3 -> Swap, x5 -> Shake)
     * - Score milestone reward (every 1000 pts -> Shake)
     * - High Score milestone check (first time current score > past best score)
     */
    processMergeMilestones(): {
        reward: "swap" | "shake" | null;
        isNewRecordBroken: boolean;
    };
    startNewGame(): void;
}
