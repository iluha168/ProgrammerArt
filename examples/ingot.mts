import { TranslateEffect } from "../engine/anim/effect/TranslateEffect.mts"
import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { GifRenderer } from "../engine/renderers/GIF.mts"

const gif = GifRenderer.render(
	new TranslateEffect(
		await LoadStaticAssetAnim("examples/ingot.png"),
		15n,
		-5n,
	),
)
// gif.resize(128, 128, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
