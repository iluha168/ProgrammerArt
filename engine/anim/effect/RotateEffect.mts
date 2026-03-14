import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

const RAD_TO_DEG = 180 / Math.PI

export class RotateEffect extends Anim {
	constructor(
		protected readonly child: Anim,
		public readonly angleRadians: number,
	) {
		super(
			child.f,
			child.w,
			child.h,
		)
	}

	public override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		return onto.composite(
			this.child.render(
				t,
				new Frame(
					onto.width,
					onto.height,
					onto.duration,
					onto.xOffset,
					onto.yOffset,
					onto.disposalMode,
				),
			).rotate(
				this.angleRadians * RAD_TO_DEG,
			),
		)
	}
}
