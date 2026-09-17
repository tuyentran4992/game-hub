import { type DropSpawnBand } from "./config";
/**
 * Seeded PRNG (mulberry32). Deterministic for a given 32-bit seed.
 * A session must use a single instance (no mid-session re-seed) to stay replayable.
 */
export declare class SeededRng {
    private state;
    constructor(seed: number);
    /** Next float in [0, 1). Pure: advances internal state, returns deterministic value. */
    next(): number;
    /** Next integer in [min, max] inclusive. */
    nextInt(min: number, max: number): number;
    /** Reset to a new seed (keeps the same instance — for "Retry" → new run). */
    reseed(seed: number): void;
}
/**
 * Drop queue: pre-generates the next 2 fruits for the "next" preview and yields
 * them one at a time on {@link nextFruit}. The active spawn band is chosen by the
 * number of fruits generated so far, so the pool level-scales with progression.
 *
 * Deterministic: two {@link DropQueue} instances with the same seed (and pool)
 * produce an identical fruit sequence.
 */
export declare class DropQueue {
    private readonly rng;
    private readonly pool;
    private readonly queue;
    private generated;
    constructor(seed: number, pool?: readonly DropSpawnBand[]);
    /** Snapshot of the next 2 upcoming tiers (preview). Does not advance state.
     *  Returns a copy so callers cannot mutate the live queue. */
    peek(): readonly number[];
    /**
     * Swap the front upcoming fruit with the currently held fruit.
     * Returns the new fruit tier to be held.
     */
    swapFront(currentTier: number): number;
    /** Consume the front fruit and refill the back; returns the dropped tier. */
    nextFruit(): number;
    /** Rebuild the queue from a fresh seed (used on "Retry" → new run, M3 §7). */
    reseed(seed: number): void;
    private generate;
    private activeBand;
    private pickWeighted;
}
