import { RGBA } from "./RGBA.mts"

export class HSVA {
	constructor(
		public readonly h: number,
		public readonly s: number,
		public readonly v: number,
		public readonly a: number,
	) {
		if (
			h > 1 || h < 0
			|| s > 1 || s < 0
			|| v > 1 || v < 0
			|| a > 1 || a < 0
		) {
			throw new Error("All HSVA values must be in the [0; 1] range")
		}
	}

	toRGBA(): RGBA {
		const { h, s, v, a } = this
		const i = Math.floor(h * 6)
		const f = h * 6 - i
		const p = v * (1 - s)
		const q = v * (1 - f * s)
		const t = v * (1 - (1 - f) * s)

		let r: number, g: number, b: number
		switch (i % 6) {
			case 0:
				r = v, g = t, b = p
				break
			case 1:
				r = q, g = v, b = p
				break
			case 2:
				r = p, g = v, b = t
				break
			case 3:
				r = p, g = q, b = v
				break
			case 4:
				r = t, g = p, b = v
				break
			case 5:
				r = v, g = p, b = q
				break
			default:
				throw new Error(`i is ${i}`)
		}

		return RGBA.from(
			r * 0xFF,
			g * 0xFF,
			b * 0xFF,
			a * 0xFF,
		)
	}
}
