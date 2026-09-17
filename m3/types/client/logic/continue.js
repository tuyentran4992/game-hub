// M3 Juicy Merge — Continue helper (logic THUẦN, M3-05)
//
// Rewarded "Continue" earned: every fruit whose center is above the danger line
// is removed; the remaining fruits are pushed down by the scene's physics.
// Screen y grows downward, so "above the line" === y < dangerY (same convention
// as checkGameOver in game-over.ts).
//
// Pure + generic over the fruit shape so it works both with the minimal FruitPos
// used in tests and the scene's richer runtime fruit type (added in a later step).
/** Fruits whose center sits above the danger line (y < dangerY). Pure: returns a
 *  new array and does not mutate the input. The Gameplay scene despawns these
 *  bodies after a rewarded continue is earned (M3-05); the complement (y >=
 *  dangerY) is kept and pushed down. */
export function fruitsAboveLine(fruits, dangerY) {
    return fruits.filter((f) => f.y < dangerY);
}
//# sourceMappingURL=continue.js.map