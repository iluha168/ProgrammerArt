import { FishEyeEffect } from "../engine/anim/effect/FishEyeEffect.mts"
import { PaddingEffect } from "../engine/anim/effect/PaddingEffect.mts"
import { OuterOutlineShader } from "../engine/anim/effect/shader/OuterOutlineShader.mts"
import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { GifRenderer } from "../engine/renderers/GIF.mts"

const gif = GifRenderer.render(
	new FishEyeEffect(
		new OuterOutlineShader(
			new PaddingEffect(
				await LoadStaticAssetAnim("examples/ingot.png"),
				4n,
				4n,
			),
		),
		2,
	),
)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
