// M3 Juicy Merge — Runtime config (source of truth).
// Mirrors `games/juicy-merge.yaml` §mechanics (DATA-MODEL §1.3 / SPEC §4).
// Pure data module — no side effects, fully testable.
// Tier convention is 0-based: 0 = cherry ... 11 = watermelon (max).
export const CONFIG = {
    chain: [
        "cherry",
        "strawberry",
        "grape",
        "dekopon",
        "pomegranate",
        "orange",
        "apple",
        "pear",
        "peach",
        "pineapple",
        "melon",
        "watermelon",
        "dragonfruit",
        "durian",
        "galaxy_watermelon",
    ],
    scorePerTier: [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 100, 150, 250, 500],
    chainLength: 15,
    maxTier: 14,
    bucketWidth: 640,
    bucketHeightRatio: 0.7,
    dangerLineRatio: 0.2,
    dropCooldownMs: 250,
    dropStartRatio: -0.12,
    comboWindowMs: 2000,
    physics: {
        gravityY: 1.2,
        restitution: 0.15,
        friction: 0.05,
        sleepThreshold: 60,
    },
    // Drop spawn pool (M3-04, DATA-MODEL §1.3/§5). Bands scale by fruits dropped
    // so low tiers dominate early (bậc 1–4 = tiers 0..3) and higher tiers unlock
    // as the run progresses. Weights favor smaller fruit. Never spawns above tier
    // 5 (orange) — Suika-style: the player builds big fruit only via merging.
    dropSpawnPool: [
        {
            minDrops: 0,
            weights: [
                { tier: 0, weight: 5 },
                { tier: 1, weight: 3 },
                { tier: 2, weight: 2 },
                { tier: 3, weight: 1 },
            ],
        },
        {
            minDrops: 10,
            weights: [
                { tier: 0, weight: 4 },
                { tier: 1, weight: 3 },
                { tier: 2, weight: 2 },
                { tier: 3, weight: 2 },
                { tier: 4, weight: 1 },
            ],
        },
        {
            minDrops: 25,
            weights: [
                { tier: 0, weight: 3 },
                { tier: 1, weight: 3 },
                { tier: 2, weight: 2 },
                { tier: 3, weight: 2 },
                { tier: 4, weight: 2 },
                { tier: 5, weight: 1 },
            ],
        },
    ],
};
//# sourceMappingURL=config.js.map