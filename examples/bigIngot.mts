import { ScaleEffect } from "../engine/anim/effect/ScaleEffect.mts"
import { VerticalWaveShader } from "../engine/anim/effect/shader/VerticalWaveShader.mts"
import { LoadImageSource } from "../engine/anim/source/ImageSource.mts"
import { ExamplesRenderer } from "./ExamplesRenderer.mts"

const scene = (await LoadImageSource("examples/ingot.png")).pipe((
	ingot,
) => new VerticalWaveShader(
	new ScaleEffect(ingot, 2n, 4n),
	1,
	0.4,
	0,
	4n,
))

await ExamplesRenderer.render(scene)
