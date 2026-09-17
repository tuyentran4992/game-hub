import type Phaser from 'phaser';
export type ColorKey = 'bgTop' | 'bgMid' | 'bgBottom' | 'primary' | 'primaryDark' | 'primaryGrad' | 'accent' | 'success' | 'danger' | 'warning' | 'surface' | 'surfaceAlt' | 'overlay' | 'textPrimary' | 'textSecondary' | 'textOnPrimary' | 'textStroke' | 'shadow' | 'lane' | 'grass' | 'surfaceDim' | 'woodLight' | 'woodDark' | 'gold' | 'goldDark' | 'goldLight' | 'goldShadow' | 'candyPink' | 'candyPinkDark' | 'candyCyan' | 'candyCyanDark' | 'candyPurple' | 'candyPurpleDark' | 'candyAmber' | 'candyAmberDark' | 'candyGreen' | 'candyGreenDark';
export declare const color: Record<ColorKey, string>;
export type TypeKey = 'display' | 'h1' | 'h2' | 'body' | 'small' | 'score';
export declare const type: Record<TypeKey, {
    size: number;
    weight: number;
}>;
export declare const sp: Record<number, number>;
export declare const radius: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
};
export declare const z: {
    bg: number;
    bgSpotlight: number;
    bgParticles: number;
    actor: number;
    bucketGlass: number;
    bucketFrame: number;
    hud: number;
    tutorial: number;
    overlay: number;
    panel: number;
};
export declare const dur: {
    fast: number;
    base: number;
    slow: number;
    pop: number;
    hover: number;
    tn: number;
    scene: number;
};
export declare function toColor(v: string): number;
export declare function fontStyle(t: {
    size: number;
    weight: number;
}, col: string): Phaser.Types.GameObjects.Text.TextStyle;
