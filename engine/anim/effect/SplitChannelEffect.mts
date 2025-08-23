import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"
import { RGBA } from "../../mathn/mod.mts"

export class SplitChannelEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		public readonly r: number,
		public readonly g: number,
		public readonly b: number,
		public readonly a: number,
	) {
		super(
			child.f,
			child.w,
			child.h,
		)
	}

	public override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		onto = this.child.render(t, onto)
		for (const [x, y, c] of onto.iterateWithColors()) {
			const rgba = new RGBA(c)
			onto.setPixelAt(
				x,
				y,
				RGBA.from(
					rgba.r * this.r,
					rgba.g * this.g,
					rgba.b * this.b,
					rgba.a * this.a,
				).color,
			)
		}
		return onto
	}
}
