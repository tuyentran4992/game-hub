/** Minimum shape a fruit needs to be filtered against the danger line. */
export interface AboveLineFruit {
    y: number;
}
/** Fruits whose center sits above the danger line (y < dangerY). Pure: returns a
 *  new array and does not mutate the input. The Gameplay scene despawns these
 *  bodies after a rewarded continue is earned (M3-05); the complement (y >=
 *  dangerY) is kept and pushed down. */
export declare function fruitsAboveLine<T extends AboveLineFruit>(fruits: readonly T[], dangerY: number): T[];
