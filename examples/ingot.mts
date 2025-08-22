import { GlintShader } from "../engine/anim/effect/shader/GlintShader.mts"
import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { GifRenderer } from "../engine/renderers/GIF.mts"

const gif = GifRenderer.render(
	new GlintShader(
		await LoadStaticAssetAnim("examples/ingot.png"),
		1.2,
		2n,
		4,
	),
)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
