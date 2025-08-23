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

	protected abstract writeFrame(t: bigint, onto?: Frame): Frame

	public render(t: bigint, onto: Frame = this.blankFrame()): Frame {
		if (onto.width < this.w || onto.height < this.h) {
			throw new RangeError(
				`Provided frame ${onto.width}x${onto.height} is too small to render ${this.w}x${this.h}`,
			)
		}
		const out = this.writeFrame(t, onto)
		if (out.width !== onto.width || out.height !== onto.height) {
			throw new RangeError(
				`Size ${onto.width}x${onto.height} was not preserved during rendering (actual ${out.width}x${out.height})`,
			)
		}
		return out
	}

	public pipe<T>(consumer: (anim: this) => T): NoInfer<T> {
		return consumer(this)
	}
}
