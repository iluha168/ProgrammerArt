import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

export class TranslateEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		public readonly dx: bigint,
		public readonly dy: bigint,
	) {
		super(
			child.f,
			child.w + dx,
			child.h + dy,
		)
	}

	public override render(t: bigint, onto = this.blankFrame()): Frame {
		return onto.composite(
			this.child.render(t),
			Number(this.dx),
			Number(this.dy),
		)
	}
}
