import { Frame, Image } from "imagescript"
import { Anim } from "../Anim.mts"

export class ScaleEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		protected readonly wfactor: bigint,
		protected readonly hfactor: bigint,
	) {
		super(
			child.f,
			child.w * wfactor,
			child.h * hfactor,
		)
	}

	protected override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		const childRender = this.child.render(t)
		childRender.resize(
			Number(this.w),
			Number(this.h),
			Image.RESIZE_NEAREST_NEIGHBOR,
		)
		return onto.composite(childRender)
	}
}
