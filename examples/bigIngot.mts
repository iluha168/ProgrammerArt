import { ScaleEffect } from "../engine/anim/effect/ScaleEffect.mts"
import { VerticalWaveShader } from "../engine/anim/effect/shader/VerticalWaveShader.mts"
import { LoadStaticAssetSource } from "../engine/anim/source/StaticAssetSource.mts"
import { ExamplesRenderer } from "./ExamplesRenderer.mts"

const scene = (await LoadStaticAssetSource("examples/ingot.png")).pipe((
	ingot,
) => new VerticalWaveShader(
	new ScaleEffect(ingot, 2n, 4n),
	1,
	0.4,
	0,
	4n,
))

await ExamplesRenderer.render(scene)
