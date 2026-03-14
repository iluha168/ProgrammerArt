import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"
import { LCM, max, RGBA } from "../../mathn/mod.mts"

export class MaskEffect extends Anim {
	constructor(
		protected readonly mask: Anim,
		protected readonly child: Anim,
	) {
		super(
			LCM(mask.f, child.f),
			max(mask.w, child.w),
			max(mask.h, child.h),
		)
	}

	protected override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		const childRender = this.child.render(t, this.blankFrame())
		const mask = this.mask.render(t, this.blankFrame())
		for (let y = 1; y <= childRender.height; y++) {
			for (let x = 1; x <= childRender.width; x++) {
				const ontoPixel = new RGBA(childRender.getPixelAt(x, y))
				const maskPixel = new RGBA(mask.getPixelAt(x, y))
				childRender.setPixelAt(
					x,
					y,
					RGBA.from(
						Math.min(maskPixel.r, ontoPixel.r),
						Math.min(maskPixel.g, ontoPixel.g),
						Math.min(maskPixel.b, ontoPixel.b),
						Math.min(maskPixel.a, ontoPixel.a),
					).color,
				)
			}
		}
		return onto.composite(childRender)
	}
}
