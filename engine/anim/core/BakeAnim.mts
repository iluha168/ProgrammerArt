import { Frame } from "imagescript"
import { Anim } from "../Anim.mts"

export class BakeAnim extends Anim {
	protected readonly cache: Frame[]

	constructor(
		protected readonly child: Anim,
	) {
		super(child.f, child.w, child.h)

		const cache: typeof this.cache = []
		for (let i = 0n; i < child.f; i++)
			cache.push(child.render(i))
		this.cache = cache
	}

	protected override writeFrame(t: bigint): Frame {
		return this.cache[Number(t % this.child.f)]
	}
}
