declare type AutoColors = {
    baseColor: string;
    options?: {
        saturation?: number;
        lightness?: number;
    };
} | null;
declare type GenerateMeshGradientParams = {
    stops: number;
    colors?: string[];
    autoColors?: AutoColors;
    hash?: {
        e: number;
        s: number;
    }[];
};
/**
 * Generate mesh gradient
 *
 */
declare const generateMeshGradient: ({ stops, colors, hash, }: GenerateMeshGradientParams) => {
    jsx: {
        backgroundColor: string;
        backgroundImage: string;
    };
    css: string;
    hashes: {
        s: number;
        e: number;
        c: string;
    }[];
};

export { AutoColors, GenerateMeshGradientParams, generateMeshGradient };
