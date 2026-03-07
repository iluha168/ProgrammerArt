import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

export class TranslateEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		public readonly dx: number,
		public readonly dy: number,
	) {
		super(
			child.f,
			BigInt(Math.floor(Number(child.w) + dx)),
			BigInt(Math.floor(Number(child.h) + dy)),
		)
	}

	public override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		return onto.composite(
			this.child.render(t),
			this.dx,
			this.dy,
		)
	}
}
