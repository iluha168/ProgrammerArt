import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

export class ExtractFrameAnim extends Anim {
	constructor(
		protected readonly child: Anim,
		protected readonly frameIndex: bigint = 0n,
	) {
		super(
			1n,
			child.w,
			child.h,
		)
	}

	protected override writeFrame(_: bigint, onto = this.blankFrame()): Frame {
		return this.child.render(this.frameIndex, onto)
	}
}
