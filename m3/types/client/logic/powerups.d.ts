export interface PowerupState {
    swapCount: number;
    shakeCount: number;
    maxSwaps: number;
    maxShakes: number;
    lastScoreMilestone: number;
    hasBrokenRecordThisGame: boolean;
}
export declare const INITIAL_SWAPS = 2;
export declare const INITIAL_SHAKES = 1;
export declare const MAX_SWAPS = 5;
export declare const MAX_SHAKES = 3;
export declare const SCORE_MILESTONE_STEP = 1000;
export declare function createInitialPowerupState(): PowerupState;
export declare function canSwapFruit(state: PowerupState): boolean;
export declare function consumeSwap(state: PowerupState): boolean;
export declare function canShakeBucket(state: PowerupState): boolean;
export declare function consumeShake(state: PowerupState): boolean;
export declare function grantSwap(state: PowerupState, count?: number): number;
export declare function grantShake(state: PowerupState, count?: number): number;
/**
 * Kiểm tra xem chuỗi combo có kích hoạt phần thưởng bổ trợ hay không:
 * - Combo x3: Thưởng +1 lượt Đổi quả (Swap)
 * - Combo x5: Thưởng +1 lượt Lắc thùng (Shake)
 */
export declare function evaluateComboReward(comboCount: number): "swap" | "shake" | null;
/**
 * Kiểm tra xem người chơi có vượt qua mốc điểm tích lũy mới hay không (mỗi 1000 điểm):
 * - Vượt mỗi 1000 điểm: Thưởng +1 lượt Lắc thùng (Shake)
 */
export declare function evaluateScoreMilestoneReward(currentScore: number, lastMilestone: number, step?: number): {
    newMilestone: number;
    reward: "shake" | null;
};
/**
 * Kiểm tra khoảnh khắc phá kỷ lục trong ván chơi.
 * Chỉ kích hoạt duy nhất một lần khi điểm số vừa vượt Best Score cũ (> 0).
 */
export declare function evaluateRecordBroken(currentScore: number, bestScore: number, alreadyTriggered: boolean): boolean;
/**
 * Tính toán vector lực dao động vật lý cho cơ chế Lắc Thùng (Bucket Shake).
 * Trả về lực an toàn theo chu kỳ dao động sin/cos để quả rung lắc mềm mại mà không văng ra ngoài.
 */
export declare function computeShakeImpulse(mass: number, elapsedSec: number, fruitIndex: number): {
    fx: number;
    fy: number;
};
