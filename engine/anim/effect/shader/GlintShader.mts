import { RGBA } from "../../../mathn/mod.mts"
import { Anim } from "../../Anim.mts"
import { Shader } from "./Shader.mts"

export class GlintShader extends Shader {
	constructor(
		protected override readonly child: Anim,
		protected readonly strength: number = 1,
		protected readonly thin: bigint = 1n,
		protected readonly slow: number = 1,
	) {
		super(
			BigInt(
				Number(child.f * child.w + thin * 2n) * slow,
			),
			child.w,
			child.h,
		)
	}

	protected override shader = (
		t: bigint,
		x: number,
		y: number,
		color: number,
	) => [
		x,
		y,
		Math.abs(
				x - (Number(t - this.thin * 2n)) / this.slow,
			)
				< this.thin
			? new RGBA(color).mul(this.strength).color
			: color,
	] as const
}
