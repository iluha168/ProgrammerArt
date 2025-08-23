import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

export class FishEyeEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		protected readonly radius?: number,
	) {
		super(
			child.f,
			child.w,
			child.h,
		)
	}

	public override render(t: bigint, onto = this.blankFrame()): Frame {
		return this.child.render(t, onto).fisheye(this.radius)
	}
}
