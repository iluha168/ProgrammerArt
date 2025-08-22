import { Anim } from "./Anim.mts"
import { LCM, max } from "../mathn/mod.mts"

export class GroupAnim extends Anim {
	constructor(
		protected readonly children: Anim[],
	) {
		super(
			children.map((ch) => ch.f).reduce(LCM),
			children.map((ch) => ch.w).reduce(max),
			children.map((ch) => ch.h).reduce(max),
		)
	}

	public override render(t: bigint, onto = this.blankFrame()) {
		for (const ch of this.children)
			onto = ch.render(t, onto)
		return onto
	}
}
