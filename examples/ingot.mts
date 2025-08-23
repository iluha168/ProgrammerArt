import { FishEyeEffect } from "../engine/anim/effect/FishEyeEffect.mts"
import { PaddingEffect } from "../engine/anim/effect/PaddingEffect.mts"
import { OuterOutlineShader } from "../engine/anim/effect/shader/OuterOutlineShader.mts"
import { GroupAnim } from "../engine/anim/GroupAnim.mts"
import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { TemporalAnim } from "../engine/anim/TemporalAnim.mts"
import { GifRenderer } from "../engine/renderers/GIF.mts"

const outline = new OuterOutlineShader(
	new PaddingEffect(
		await LoadStaticAssetAnim("examples/ingot.png"),
		4n,
		4n,
	),
)

const gif = GifRenderer.render(
	new GroupAnim([
		outline,
		new TemporalAnim(
			60n,
			(t) => Number(t) / 10,
			(r) => new FishEyeEffect(outline, r),
		),
	]),
)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
