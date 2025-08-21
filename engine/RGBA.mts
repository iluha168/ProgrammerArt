export class RGBA {
	constructor(
		public color: number,
	) {}

	get r() {
		return (this.color & 0xFF000000) >>> 24
	}
	get g() {
		return (this.color & 0x00FF0000) >>> 16
	}
	get b() {
		return (this.color & 0x0000FF00) >>> 8
	}
	get a() {
		return (this.color & 0x000000FF)
	}

	mul(factor: number): RGBA {
		return RGBA.from(
			this.r * factor,
			this.g * factor,
			this.b * factor,
			this.a * factor,
		)
	}

	static from(r: number, g: number, b: number, a: number): RGBA {
		// deno-fmt-ignore
		return new RGBA(
            (Math.max(0x00, Math.min(Math.round(r), 0xFF)) << 24) +
            (Math.max(0x00, Math.min(Math.round(g), 0xFF)) << 16) +
            (Math.max(0x00, Math.min(Math.round(b), 0xFF)) << 8) +
            (Math.max(0x00, Math.min(Math.round(a), 0xFF)))
        )
	}
}
