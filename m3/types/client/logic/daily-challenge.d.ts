export declare const DAILY_FRUIT_LIMIT = 50;
export declare const DAILY_TARGET_SCORE = 350;
export interface DailyDifficulty {
    dayLevel: number;
    fruitLimit: number;
    targetScore: number;
    unlockedLegendaryTier?: number;
    rewardName?: string;
}
export interface MilestoneReward {
    tier: number;
    name: string;
    emoji: string;
    milestoneDay: number;
}
export declare const DAILY_MILESTONES: readonly MilestoneReward[];
/**
 * Calculate difficulty for the Daily Challenge run based on completed days count (Streak).
 */
export declare function getDailyDifficulty(completedDaysCount?: number): DailyDifficulty;
export interface DailyChallengeState {
    isDailyMode: boolean;
    dateString: string;
    dayLevel: number;
    fruitsRemaining: number;
    targetScore: number;
    isVictory: boolean;
}
/**
 * Trả về chuỗi ngày hôm nay theo định dạng YYYY-MM-DD theo giờ địa phương.
 */
export declare function getTodayDateString(date?: Date): string;
/**
 * Tạo seed số nguyên 32-bit từ chuỗi ngày YYYY-MM-DD.
 * Đảm bảo cùng một ngày luôn sinh ra seed hoàn toàn giống nhau.
 */
export declare function getDailySeed(dateStr: string): number;
/**
 * Kiểm tra xem người chơi đã hoàn thành Daily Challenge trong ngày hôm nay chưa.
 */
export declare function isDailyCompletedToday(lastCompletedDate: string | null | undefined, todayStr?: string): boolean;
/**
 * Khởi tạo trạng thái cho lượt chơi Daily Challenge với độ khó tương ứng số ngày đã thắng.
 */
export declare function createDailyChallengeState(dateStr?: string, completedDaysCount?: number): DailyChallengeState;
/**
 * Kiểm tra điều kiện hoàn thành mục tiêu chiến thắng Daily Challenge.
 */
export declare function evaluateDailyVictory(currentScore: number, targetScore?: number): boolean;
/**
 * Kiểm tra các quả Thần Thoại cần được mở khóa dựa trên tổng số ngày thắng thử thách.
 */
export declare function getUnlockedMilestoneTiers(completedDaysCount: number): number[];
/**
 * Kiểm tra xem khi hoàn thành mốc số ngày newCount có mở khóa quả mới không.
 */
export declare function checkMilestoneJustUnlocked(newCompletedDays: number): MilestoneReward | null;
