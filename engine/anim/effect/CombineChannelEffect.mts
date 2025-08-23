import { Frame } from "imagescript"
import { GroupAnim } from "../core/GroupAnim.mts"
import { RGBA } from "../../mathn/mod.mts"

export class CombineChannelEffect extends GroupAnim {
	public override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		const source = this.blankFrame()
		for (const ch of this.children) {
			const merge = ch.render(t, this.blankFrame())
			for (const [x, y, c] of source.iterateWithColors()) {
				source.setPixelAt(
					x,
					y,
					new RGBA(c).add(new RGBA(merge.getPixelAt(x, y))).color,
				)
			}
		}
		return onto.composite(source)
	}
}
