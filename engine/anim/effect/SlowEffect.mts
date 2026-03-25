import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

export class SlowEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		public readonly factor: bigint,
	) {
		super(
			child.f * factor,
			child.w,
			child.h,
		)
	}

	public override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		return onto.composite(
			this.child.render(t / this.factor),
		)
	}
}
