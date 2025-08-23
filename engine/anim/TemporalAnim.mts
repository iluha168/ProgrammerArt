import { Anim } from "./Anim.mts"
import { max } from "../mathn/mod.mts"

export class TemporalAnim<P> extends Anim {
	protected readonly children: Anim[]

	constructor(
		f: bigint,
		protected readonly getParameters: (t: bigint) => P,
		protected readonly getChild: (params: NoInfer<P>) => Anim,
	) {
		const children = Array.from(
			{ length: Number(f) },
			(_, i) => getChild(getParameters(BigInt(i))),
		)
		if (children.some((ch) => ch.f > 1n))
			throw new RangeError(`Passed a child with more than 1 frame`)
		super(
			f,
			children.map((ch) => ch.w).reduce(max),
			children.map((ch) => ch.h).reduce(max),
		)
		this.children = children
	}

	public override writeFrame(t: bigint, onto = this.blankFrame()) {
		return this.children[Number(t)].render(1n, onto)
	}
}
