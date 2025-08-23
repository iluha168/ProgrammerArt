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
		const output = Frame.from(childRender.clone())
		for (let x = 1; x <= this.w; x++) {
			for (let y = 1; y <= this.h; y++) {
				try {
					output.setPixelAt(
						...this.shader(
							t,
							x,
							y,
							childRender.getPixelAt(x, y),
							childRender,
						),
					)
				} catch (e) {
					if (!(e instanceof RangeError)) throw e
				}
			}
		}
		return onto.composite(output)
	}
}
