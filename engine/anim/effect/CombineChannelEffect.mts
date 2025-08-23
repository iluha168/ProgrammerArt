import { Frame } from "imagescript"
import { GroupAnim } from "../core/GroupAnim.mts"
import { RGBA } from "../../mathn/mod.mts"

export class CombineChannelEffect extends GroupAnim {
	public override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		const ontoC = new Uint32Array(onto.bitmap.buffer)
		for (const ch of this.children) {
			const merge = ch.render(t, this.blankFrame())
			const mergeC = new Uint32Array(merge.bitmap.buffer)
			for (const [i, c] of ontoC.entries())
				ontoC[i] = new RGBA(c).add(new RGBA(mergeC[i])).color
		}
		return onto
	}
}
