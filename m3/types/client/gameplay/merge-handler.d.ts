import type { MergeEngine } from "../logic/merge-engine";
import type Phaser from "phaser";
/** A fruit in a collision pair, identified by a scene-assigned stable id. */
export interface CollidingFruit {
    readonly id: number;
    readonly tier: number;
}
/** One accepted merge: consume fruits `aId`+`bId`, spawn a fruit of `newTier`
 *  that grants `scoreGain` points (already credited to the engine by merge). */
export interface MergePlan {
    readonly aId: number;
    readonly bId: number;
    readonly newTier: number;
    readonly scoreGain: number;
}
/** Represents a dropped fruit instance currently in the scene */
export interface DroppedFruit {
    id: number;
    obj: Phaser.Physics.Matter.Image;
    tier: number;
}
/** A merge scheduled for execution on the next frame */
export interface PendingMerge {
    aId: number;
    bId: number;
    newTier: number;
    scoreGain: number;
}
/** Handle to a Matter.js body in a collision event */
export type MatterBodyHandle = unknown;
/** Handle to a Matter collision event */
export interface CollisionEventHandle {
    pairs: Array<{
        bodyA: MatterBodyHandle;
        bodyB: MatterBodyHandle;
    }>;
}
/**
 * Resolve a batch of collision pairs into ordered merge plans. Pure over the
 * input array (it is not mutated); the only side effect is delegated score/combo
 * bookkeeping via {@link engine.merge}.
 */
export declare function resolveMergeBatch(pairs: ReadonlyArray<readonly [CollidingFruit, CollidingFruit]>, nowMs: number, engine: MergeEngine): MergePlan[];
