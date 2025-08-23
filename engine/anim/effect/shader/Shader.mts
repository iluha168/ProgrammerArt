import { Frame } from "imagescript"
import { Anim } from "../../Anim.mts"

export abstract class Shader extends Anim {
	protected abstract readonly child: Anim
	protected abstract readonly shader: (
		t: bigint,
		x: number,
		y: number,
		color: number,
		childRender: Frame,
	) => readonly [
		x: number,
		y: number,
		color: number,
	]

	public override writeFrame(t: bigint, onto = this.blankFrame()): Frame {
		const childRender = this.child.render(t)
		for (const [x, y, c] of childRender.iterateWithColors()) {
			try {
				onto.setPixelAt(
					...this.shader(
						t,
						x,
						y,
						c,
						childRender,
					),
				)
			} catch (e) {
				if (!(e instanceof RangeError)) throw e
			}
		}
		return onto
	}
}
