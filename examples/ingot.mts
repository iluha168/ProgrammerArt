import { CombineChannelEffect } from "../engine/anim/effect/CombineChannelEffect.mts"
import { SplitChannelEffect } from "../engine/anim/effect/SplitChannelEffect.mts"
import { VerticalWaveShader } from "../engine/anim/effect/shader/VerticalWaveShader.mts"
import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { GifRenderer } from "../engine/renderers/GIF.mts"

const gif = GifRenderer.render(
	new CombineChannelEffect(
		(await LoadStaticAssetAnim("examples/ingot.png")).pipe(
			(asset) =>
				[
					new SplitChannelEffect(asset, 0, 0, 1),
					new SplitChannelEffect(asset, 0, 1, 0),
					new SplitChannelEffect(asset, 1, 0, 0),
				].map((anim, i) =>
					new VerticalWaveShader(
						anim,
						1,
						-0.4,
						i * 2 * Math.PI / 3,
						3n,
					)
				),
		),
	),
)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
