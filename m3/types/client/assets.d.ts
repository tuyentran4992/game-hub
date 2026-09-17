/** Stable sprite key for a 0-based tier, e.g. tier 0 -> `fruit_01_cherry`. */
export declare function fruitKey(tier: number): string;
/** All 12 fruit sprite keys in tier order (cherry -> watermelon). */
export declare const FRUIT_KEYS: readonly string[];
/** Static (non-fruit) image keys from yaml §assets. Only `bucket` and
 *  `bg_gradient` are actually generated (loaded by the Boot scene); `logo`,
 *  `ui_icons`, and `danger_line` were NOT generated (image API refused in step
 *  14) and are drawn by code fallback (text/graphics), so they are not loaded. */
export declare const IMAGE_KEYS: readonly ["bucket", "bg_gradient", "logo", "ui_icons", "danger_line"];
/** Audio keys from yaml §assets (sfx_* + bgm). */
export declare const AUDIO_KEYS: readonly ["sfx_drop", "sfx_merge", "sfx_merge_big", "sfx_danger", "sfx_gameover", "bgm_main"];
