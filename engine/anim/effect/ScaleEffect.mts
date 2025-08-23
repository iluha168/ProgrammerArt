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
		onto = this.child.render(t)
		onto.resize(
			Number(this.wfactor) * onto.width,
			Number(this.hfactor) * onto.height,
			Image.RESIZE_NEAREST_NEIGHBOR,
		)
		return onto
	}
}
