export interface FruitInfo {
    tier: number;
    name: string;
    emoji: string;
    scoreGain: number;
    description: string;
}
export declare const FRUIT_ENCYCLOPEDIA: readonly FruitInfo[];
export interface AlbumProgress {
    unlockedCount: number;
    totalCount: number;
    percentage: number;
    title: string;
    isComplete: boolean;
}
/**
 * Check if the merged fruit is newly discovered.
 * Returns true if new and automatically adds to unlockedTiers.
 */
export declare function checkNewFruitUnlocked(tier: number, unlockedTiers: Set<number>): {
    isNewDiscovery: boolean;
    fruitInfo: FruitInfo;
};
/**
 * Calculate album completion progress and rank title.
 */
export declare function getAlbumProgress(unlockedTiers: Set<number> | readonly number[]): AlbumProgress;
