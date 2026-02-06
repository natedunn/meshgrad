const noise = `url("data:image/svg+xml,%3Csvg opacity='0.1' viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='7.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"), \n`;

export type AutoColors = {
	baseColor: string;
	options?: {
		saturation?: number;
		lightness?: number;
	};
} | null;

export type GenerateMeshGradientParams = {
	stops: number;
	colors?: string[];
	autoColors?: AutoColors;
	hash?: { e: number; s: number }[];
};

// Generate a random hue from 0 - 360
const getColor = (): number => {
	return Math.round(Math.random() * 360);
};

const getPercent = (value: number): number => {
	return Math.round((Math.random() * (value * 100)) % 100);
};

const getHashPercent = (
	value: number,
	hash: number,
	length: number
): number => {
	return Math.round(((hash / length) * (value * 100)) % 100);
};

const hexToHSL = (hex: string): [number, number, number] | null => {
	// Remove the hash symbol if present
	if (hex.startsWith("#")) {
		hex = hex.slice(1);
	}

	// Check for valid HEX color code
	const validHexRegex = /^[0-9A-Fa-f]{6}$/;
	if (!validHexRegex.test(hex)) {
		return null;
	}

	// Convert HEX to RGB
	const r = parseInt(hex.substr(0, 2), 16) / 255;
	const g = parseInt(hex.substr(2, 2), 16) / 255;
	const b = parseInt(hex.substr(4, 2), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const diff = max - min;

	// Calculate hue
	let h = 0;
	if (diff === 0) {
		h = 0;
	} else if (max === r) {
		h = ((g - b) / diff) % 6;
	} else if (max === g) {
		h = (b - r) / diff + 2;
	} else {
		h = (r - g) / diff + 4;
	}

	h = Math.round(h * 60);
	if (h < 0) {
		h += 360;
	}

	// Calculate lightness
	let l = (max + min) / 2;

	// Calculate saturation
	let s = 0;
	if (diff !== 0) {
		s = diff / (1 - Math.abs(2 * l - 1));
	}

	s = Math.round(s * 100);
	l = Math.round(l * 100);

	return [h, s, l];
};

const genColors = (
	length: number,
	initialHue: number,
	autoColors: AutoColors
): string[] => {
	// Set default saturation and lightness
	const { saturation = 100, lightness = 74 } = autoColors?.options ?? {
		saturation: 100,
		lightness: 74,
	};

	return Array.from({ length }, (_, i) => {
		// base color
		if (i === 0) {
			return `hsl(${initialHue}, ${saturation}%, ${lightness}%)`;
		}
		// analogous colors
		if (i < length / 1.4) {
			return `hsl(${
				initialHue - 30 * (1 - 2 * (i % 2)) * (i > 2 ? i / 2 : i)
			}, ${saturation}%, ${64 - i * (1 - 2 * (i % 2)) * 1.75}%)`;
		}

		// complementary colors
		return `hsl(${initialHue - 150 * (1 - 2 * (i % 2))}, ${saturation}%, ${
			66 - i * (1 - 2 * (i % 2)) * 1.25
		}%)`;
	});
};

const hslValuesToString = (colors: number[][]): string[] => {
	return colors.map(([h, s, l]) => `hsl(${h}, ${s}%, ${l}%)`);
};

const genGrad = (
	stops: number,
	colors: string[],
	hash?: { s: number; e: number }[]
) => {
	return Array.from({ length: stops }, (_, i) => {
		const startHash = () => {
			if (colors.length <= i && !hash) {
				return getPercent(Math.floor(Math.random() * stops));
			}
			return hash[i].e ?? getPercent(i);
		};
		const endHash = () => {
			if (colors.length <= i && !hash) {
				return getPercent(Math.floor(Math.random() * stops) * 10);
			}
			return hash[i].s ?? getPercent(i * 10);
		};

		// console.log(
		//   "We should be accessing: ",
		//   Math.floor(Math.random() * colors.length),
		//   "- inside of: ",
		//   colors,
		//   "- as ",
		//   colors[Math.floor(Math.random() * colors.length)]
		// );

		const color =
			colors.length <= i
				? colors[Math.floor(Math.random() * colors.length)]
				: colors[i];

		// console.log("color: ", color);

		const css = `radial-gradient(at ${startHash()}% ${endHash()}%, ${color} 0px, transparent 55%)\n`;

		return {
			hashes: {
				s: startHash(),
				e: endHash(),
				c: color,
			},
			css,
		};
	});
};

const genStops = (
	length: number,
	colors?: number[][],
	hash?: { s: number; e: number }[]
	// autoColors?: AutoColors
) => {
	const getColors = () => {
		// If autoColors is enabled, generate the colors
		// if (autoColors && autoColors.baseColor) {
		//   return genColors(
		//     length,
		//     hexToHSL(autoColors.baseColor)[0] ?? getColor(),
		//     autoColors
		//   );
		// }
		// Else use provided colors
		return hslValuesToString(colors);
	};

	// generate the radial gradient
	const proprieties = genGrad(length, getColors(), hash);

	return {
		bgColor: getColors()[0],
		bgImage: proprieties.map((prop) => prop.css).join(","),
		hashes: proprieties.map((prop) => prop.hashes),
	};
};

/**
 * Generate mesh gradient
 *
 */
const generateMeshGradient = ({
	// autoColors,
	stops,
	colors,
	hash,
}: GenerateMeshGradientParams) => {
	const { bgColor, bgImage, hashes } = genStops(
		stops,
		colors?.map((color) => hexToHSL(color)),
		hash
		// autoColors
	);

	return {
		jsx: {
			backgroundColor: bgColor,
			backgroundImage: noise + bgImage,
		},
		css: `background-color: ${bgColor}; background-image:${noise + bgImage}`,
		hashes,
	};
};

export { generateMeshGradient as generateMeshGradient };
