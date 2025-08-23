import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { GifRenderer } from "../engine/renderers/GifRenderer.mts"
import { ColumnRenderer } from "../engine/renderers/ColumnRenderer.mts"
import { SplitChannelEffect } from "../engine/anim/effect/SplitChannelEffect.mts"
import { CombineChannelEffect } from "../engine/anim/effect/CombineChannelEffect.mts"
import { VerticalWaveShader } from "../engine/anim/effect/shader/VerticalWaveShader.mts"

const scene = (await LoadStaticAssetAnim("examples/ingot.png")).pipe((ingot) =>
	new CombineChannelEffect([
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
	))
)

const gif = GifRenderer.render(scene)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))

const column = ColumnRenderer.render(scene)
await Deno.writeFile("out.png", await column.encode(9))
