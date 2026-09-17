// M3 Juicy Merge — collision->merge decision layer (PURE, testable).
// The Gameplay scene turns each Matter `collisionstart` event into a batch of
// colliding fruit pairs (the event's `pairs`, each carrying two fruit ids +
// tiers). This module decides WHICH pairs actually merge within one event.
/**
 * Resolve a batch of collision pairs into ordered merge plans. Pure over the
 * input array (it is not mutated); the only side effect is delegated score/combo
 * bookkeeping via {@link engine.merge}.
 */
export function resolveMergeBatch(pairs, nowMs, engine) {
    const plans = [];
    const claimed = new Set();
    for (const [a, b] of pairs) {
        if (claimed.has(a.id) || claimed.has(b.id))
            continue;
        if (a.tier !== b.tier)
            continue;
        const result = engine.merge(a.tier, b.tier, nowMs);
        if (!result)
            continue;
        claimed.add(a.id);
        claimed.add(b.id);
        plans.push({
            aId: a.id,
            bId: b.id,
            newTier: result.tier,
            scoreGain: result.scoreGain,
        });
    }
    return plans;
}
//# sourceMappingURL=merge-handler.js.map