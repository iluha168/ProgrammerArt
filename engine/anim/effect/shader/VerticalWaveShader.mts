import { Frame } from "imagescript"
import { Anim } from "../../Anim.mts"
import { Shader } from "./Shader.mts"

export class VerticalWaveShader extends Shader {
	constructor(
		protected override readonly child: Anim,
		protected readonly amplitude: number,
		protected readonly frequency: number = 0,
		protected readonly phase: number = 0,
		protected readonly slow: bigint = 1n,
	) {
		super(
			BigInt(Math.round(Number(child.f * 2n * slow) * Math.PI)),
			child.w,
			child.h,
		)
	}

	protected override shader = (
		t: bigint,
		x: number,
		y: number,
		_: number,
		childRender: Frame,
	) => [
		x,
		y,
		childRender.getPixelAt(
			x,
			y + Math.round(
				Math.sin(
					(
						x * this.frequency + Number(t) / Number(this.slow)
					) + this.phase,
				) * this.amplitude,
			),
		),
	] as const
}
