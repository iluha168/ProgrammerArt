import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

export class PaddingEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		public readonly l: bigint,
		public readonly t: bigint,
		public readonly r = l,
		public readonly b = t,
	) {
		super(
			child.f,
			child.w + l + r,
			child.h + t + b,
		)
	}

	public override render(t: bigint, onto = this.blankFrame()): Frame {
		return onto.composite(
			this.child.render(t),
			Number(this.l),
			Number(this.t),
		)
	}
}
