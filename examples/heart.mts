import { TemporalAnim } from "../engine/anim/core/TemporalAnim.mts"
import { MaskEffect } from "../engine/anim/effect/MaskEffect.mts"
import { FunctionSource } from "../engine/anim/source/FunctionSource.mts"
import { HSVA, RGBA } from "../engine/mathn/mod.mts"
import { ExamplesRenderer } from "./ExamplesRenderer.mts"

const scene = new TemporalAnim(
	64n,
	(f) => Math.PI * Number(f) / 32,
	(t) =>
		new MaskEffect(
			new FunctionSource(
				(x, y) => {
					const s = t < Math.PI
						? (Math.abs(Math.sin(2 * t)) / 8) + 1
						: 1
					x = (x - 0.5) * s
					y = (0.6 - y) * s
					return (x * x + y * y - .1) ** 3 < x * x * y ** 3
						? new RGBA(0xFFFFFFFF)
						: new RGBA(0)
				},
				16n,
				16n,
				16n,
			),
			new FunctionSource(
				(x, y) => {
					const s = t < Math.PI
						? (Math.abs(Math.sin(2 * t)) * 0.3) + 1
						: 1
					const d = (x - 0.5 + 1 / 32) ** 2 + (y - 0.5 + 1 / 32) ** 2
					return new HSVA(
						(Math.sin(Math.sqrt(d + 0.1) * 6 - t * s) + 1)
							/ 2,
						0.9,
						0.9,
						1,
					).toRGBA()
				},
				16n,
				16n,
			),
		),
)

await ExamplesRenderer.render(scene)
