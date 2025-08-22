import { Frame } from "imagescript"

export abstract class Anim {
	constructor(
		/** Total frames count */
		public readonly f: bigint,
		/** Width */
		public readonly w: bigint,
		/** Height */
		public readonly h: bigint,
	) {
	}

	public blankFrame(): Frame {
		return new Frame(
			Number(this.w),
			Number(this.h),
			20,
			0,
			0,
			Frame.DISPOSAL_BACKGROUND,
		)
	}

	public abstract render(t: bigint, onto?: Frame): Frame
}
