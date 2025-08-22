import { InnerOutlineShader } from "../engine/anim/effect/shader/InnerOutlineShader.mts"
import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { GifRenderer } from "../engine/renderers/GIF.mts"

const gif = GifRenderer.render(
	new InnerOutlineShader(
		await LoadStaticAssetAnim("examples/ingot.png"),
	),
)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
