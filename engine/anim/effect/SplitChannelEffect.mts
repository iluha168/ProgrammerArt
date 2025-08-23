import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

export class SplitChannelEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		public readonly r: number,
		public readonly g: number,
		public readonly b: number,
	) {
		super(
			child.f,
			child.w,
			child.h,
		)
	}

	public override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		return this.child
			.render(t, onto)
			.red(this.r)
			.green(this.g)
			.blue(this.b)
	}
}
