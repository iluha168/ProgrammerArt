import { Frame } from "imagescript"
import { Anim } from "../../Anim.mts"
import { Shader } from "./Shader.mts"

export class InnerOutlineShader extends Shader {
	constructor(
		protected override readonly child: Anim,
	) {
		super(
			child.f,
			child.w,
			child.h,
		)
	}

	protected override shader = (
		_: bigint,
		x: number,
		y: number,
		color: number,
		childRender: Frame,
	) => [
		x,
		y,
		// deno-fmt-ignore
		(
			x > 1      && childRender.getPixelAt(x - 1, y) &&
			x < this.w && childRender.getPixelAt(x + 1, y) &&
			y > 1      && childRender.getPixelAt(x, y - 1) &&
			y < this.h && childRender.getPixelAt(x, y + 1)
		) ? 0 : color,
	] as const
}
