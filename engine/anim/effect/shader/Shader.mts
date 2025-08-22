import { Frame } from "imagescript"
import { Anim } from "../../Anim.mts"

export abstract class Shader extends Anim {
	protected abstract readonly child: Anim
	protected abstract readonly shader: (
		t: bigint,
		x: number,
		y: number,
		color: number,
	) => readonly [
		x: number,
		y: number,
		color: number,
	]

	public override render(t: bigint, onto = this.blankFrame()): Frame {
		const childRender = this.child.render(t)
		for (let x = 0; x < this.w; x++) {
			for (let y = 0; y < this.h; y++) {
				try {
					onto.setPixelAt(
						...this.shader(t, x, y, childRender.getPixelAt(x, y)),
					)
				} catch (e) {
					if (!(e instanceof RangeError)) throw e
				}
			}
		}
		return onto
	}
}
