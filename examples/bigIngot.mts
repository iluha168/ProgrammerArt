import { ScaleEffect } from "../engine/anim/effect/ScaleEffect.mts"
import { VerticalWaveShader } from "../engine/anim/effect/shader/VerticalWaveShader.mts"
import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { ColumnRenderer } from "../engine/renderers/ColumnRenderer.mts"
import { GifRenderer } from "../engine/renderers/GifRenderer.mts"

const scene = (await LoadStaticAssetAnim("examples/ingot.png")).pipe((ingot) =>
	new VerticalWaveShader(
		new ScaleEffect(ingot, 2n, 4n),
		1,
		0.4,
		0,
		4n,
	)
)

const gif = GifRenderer.render(scene)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))

const column = ColumnRenderer.render(scene)
await Deno.writeFile("out.png", await column.encode(9))
