import { LoadImageSource } from "../engine/anim/source/ImageSource.mts"
import { SplitChannelEffect } from "../engine/anim/effect/SplitChannelEffect.mts"
import { CombineChannelEffect } from "../engine/anim/effect/CombineChannelEffect.mts"
import { VerticalWaveShader } from "../engine/anim/effect/shader/VerticalWaveShader.mts"
import { ExamplesRenderer } from "./ExamplesRenderer.mts"

const scene = (await LoadImageSource("examples/ingot.png")).pipe((
	ingot,
) => new CombineChannelEffect([
	[0, 0, 1, 1] as const,
	[0, 1, 0, 1],
	[1, 0, 0, 1],
].map(([r, g, b, a], i) =>
	new VerticalWaveShader(
		new SplitChannelEffect(ingot, r, g, b, a),
		1,
		0.2,
		i * 2,
		4n,
	)
)))

await ExamplesRenderer.render(scene)
