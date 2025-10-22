import { RGBA } from "../../mathn/mod.mts"
import { Anim } from "../Anim.mts"

export class FunctionSource extends Anim {
	constructor(
		protected readonly fn: (x: number, y: number) => RGBA,
		w: bigint,
		h: bigint,
		protected readonly aa: bigint = 1n,
	) {
		super(
			1n,
			w,
			h,
		)
	}

	public override writeFrame(_: bigint, onto = this.blankFrame()) {
		const aaStep = 1 / Number(this.aa)
		const avgFactor = 1 / Number(this.aa * this.aa)

		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				let accR = 0
				let accG = 0
				let accB = 0
				let accA = 0
				for (let subY = 0; subY < 1; subY += aaStep) {
					for (let subX = 0; subX < 1; subX += aaStep) {
						const { r, g, b, a } = this.fn(
							(x + subX) / Number(this.w),
							(y + subY) / Number(this.h),
						)
						accR += r
						accG += g
						accB += b
						accA += a
					}
				}
				onto.setPixelAt(
					x + 1,
					y + 1,
					RGBA.from(
						accR * avgFactor,
						accG * avgFactor,
						accB * avgFactor,
						accA * avgFactor,
					).color,
				)
			}
		}
		return onto
	}
}
