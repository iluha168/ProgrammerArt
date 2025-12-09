import { GroupAnim } from "./GroupAnim.mts"

/**
 * Overlays children on top of each other, preserving transparency
 */
export class StackAnim extends GroupAnim {
	constructor(
		children: GroupAnim["children"],
	) {
		super(children)
	}

	public override writeFrame(t: bigint, onto = this.blankFrame()) {
		for (const ch of this.children)
			onto.composite(ch.render(t))
		return onto
	}
}
