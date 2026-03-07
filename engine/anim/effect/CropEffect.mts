import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

export class CropEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		protected readonly x: bigint,
		protected readonly y: bigint,
		protected readonly newW: bigint,
		protected readonly newH: bigint,
	) {
		super(
			child.f,
			newW,
			newH,
		)
	}

	protected override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		onto = this.child.render(t)
		onto.crop(
			Number(this.x),
			Number(this.y),
			Number(this.newW),
			Number(this.newH),
		)
		return onto
	}
}
