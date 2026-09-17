/**
 * Pure settle gate.
 *
 * @param atRestPerFruit one boolean per fruit in play (true = that body is at rest).
 * @param nowMs          current scene time (ms).
 * @param lastMotionMs   last time any fruit was observed moving (ms).
 * @param graceMs        calm time required after the last motion before "settled".
 * @returns true iff the world is at rest AND the grace period has elapsed.
 */
export declare function isWorldSettled(atRestPerFruit: readonly boolean[], nowMs: number, lastMotionMs: number, graceMs: number): boolean;
