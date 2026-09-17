// M3 Juicy Merge — Power-ups & Strategic Mechanics (logic THUẦN, testable)
// SPEC: Quản lý lượt Swap, Shake, phần thưởng Combo/Milestone, và kiểm tra phá kỷ lục.
export const INITIAL_SWAPS = 2;
export const INITIAL_SHAKES = 1;
export const MAX_SWAPS = 5;
export const MAX_SHAKES = 3;
export const SCORE_MILESTONE_STEP = 1000;
export function createInitialPowerupState() {
    return {
        swapCount: INITIAL_SWAPS,
        shakeCount: INITIAL_SHAKES,
        maxSwaps: MAX_SWAPS,
        maxShakes: MAX_SHAKES,
        lastScoreMilestone: 0,
        hasBrokenRecordThisGame: false,
    };
}
export function canSwapFruit(state) {
    return state.swapCount > 0;
}
export function consumeSwap(state) {
    if (!canSwapFruit(state))
        return false;
    state.swapCount--;
    return true;
}
export function canShakeBucket(state) {
    return state.shakeCount > 0;
}
export function consumeShake(state) {
    if (!canShakeBucket(state))
        return false;
    state.shakeCount--;
    return true;
}
export function grantSwap(state, count = 1) {
    state.swapCount = Math.min(state.maxSwaps, state.swapCount + count);
    return state.swapCount;
}
export function grantShake(state, count = 1) {
    state.shakeCount = Math.min(state.maxShakes, state.shakeCount + count);
    return state.shakeCount;
}
/**
 * Kiểm tra xem chuỗi combo có kích hoạt phần thưởng bổ trợ hay không:
 * - Combo x3: Thưởng +1 lượt Đổi quả (Swap)
 * - Combo x5: Thưởng +1 lượt Lắc thùng (Shake)
 */
export function evaluateComboReward(comboCount) {
    if (comboCount === 3)
        return "swap";
    if (comboCount === 5)
        return "shake";
    return null;
}
/**
 * Kiểm tra xem người chơi có vượt qua mốc điểm tích lũy mới hay không (mỗi 1000 điểm):
 * - Vượt mỗi 1000 điểm: Thưởng +1 lượt Lắc thùng (Shake)
 */
export function evaluateScoreMilestoneReward(currentScore, lastMilestone, step = SCORE_MILESTONE_STEP) {
    if (currentScore < step) {
        return { newMilestone: lastMilestone, reward: null };
    }
    const currentLevel = Math.floor(currentScore / step) * step;
    if (currentLevel > lastMilestone) {
        return { newMilestone: currentLevel, reward: "shake" };
    }
    return { newMilestone: lastMilestone, reward: null };
}
/**
 * Kiểm tra khoảnh khắc phá kỷ lục trong ván chơi.
 * Chỉ kích hoạt duy nhất một lần khi điểm số vừa vượt Best Score cũ (> 0).
 */
export function evaluateRecordBroken(currentScore, bestScore, alreadyTriggered) {
    if (alreadyTriggered)
        return false;
    if (bestScore <= 0)
        return false;
    return currentScore > bestScore;
}
/**
 * Tính toán vector lực dao động vật lý cho cơ chế Lắc Thùng (Bucket Shake).
 * Trả về lực an toàn theo chu kỳ dao động sin/cos để quả rung lắc mềm mại mà không văng ra ngoài.
 */
export function computeShakeImpulse(mass, elapsedSec, fruitIndex) {
    const safeMass = Math.max(1, mass);
    // Dao động điều hòa ngang nhẹ nhàng tần số 6Hz để các quả trượt vào khe hở mà không nảy lên cao
    const phase = fruitIndex * 0.8;
    const lateralFactor = Math.sin(elapsedSec * 12 * Math.PI + phase);
    const fx = lateralFactor * 0.002 * safeMass;
    return { fx, fy: 0 };
}
//# sourceMappingURL=powerups.js.map