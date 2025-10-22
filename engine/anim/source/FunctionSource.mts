import { Anim } from "../Anim.mts"

export class FunctionSource extends Anim {
	constructor(
		protected readonly fn: (x: number, y: number) => bigint,
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
		const virtualW = Number(this.w * this.aa)
		const virtualH = Number(this.h * this.aa)

		for (let y = 1; y <= this.h; y++) {
			for (let x = 1; x <= this.w; x++) {
				let acc = 0n
				for (let subY = 0; subY < this.aa; subY++) {
					for (let subX = 0; subX < this.aa; subX++) {
						acc += this.fn(
							(x * Number(this.aa) + subX) / virtualW,
							(y * Number(this.aa) + subY) / virtualH,
						)
					}
				}
				onto.setPixelAt(
					x,
					y,
					Math.round(Number(acc) / (Number(this.aa ** 2n))),
				)
			}
		}
		return onto
	}
}
