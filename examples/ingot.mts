import { CombineChannelEffect } from "../engine/anim/effect/CombineChannelEffect.mts"
import { SplitChannelEffect } from "../engine/anim/effect/SplitChannelEffect.mts"
import { TranslateEffect } from "../engine/anim/effect/TranslateEffect.mts"
import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { GifRenderer } from "../engine/renderers/GIF.mts"

const gif = GifRenderer.render(
	new CombineChannelEffect(
		(await LoadStaticAssetAnim("examples/ingot.png")).pipe(
			(asset) => [
				new SplitChannelEffect(asset, 0, 0, 1),
				new TranslateEffect(
					new SplitChannelEffect(asset, 0, 1, 0),
					1n,
					1n,
				),
				new TranslateEffect(
					new SplitChannelEffect(asset, 1, 0, 0),
					2n,
					2n,
				),
			],
		),
	),
)
// gif.resize(128, 128, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
