import { FishEyeEffect } from "../engine/anim/effect/FishEyeEffect.mts"
import { PaddingEffect } from "../engine/anim/effect/PaddingEffect.mts"
import { OuterOutlineShader } from "../engine/anim/effect/shader/OuterOutlineShader.mts"
import { GroupAnim } from "../engine/anim/core/GroupAnim.mts"
import { LoadStaticAssetAnim } from "../engine/anim/load/StaticAssetAnim.mts"
import { TemporalAnim } from "../engine/anim/core/TemporalAnim.mts"
import { GifRenderer } from "../engine/renderers/GifRenderer.mts"
import { ColumnRenderer } from "../engine/renderers/ColumnRenderer.mts"

const scene = new PaddingEffect(
	await LoadStaticAssetAnim("examples/ingot.png"),
	4n,
	4n,
).pipe((ingot) =>
	new GroupAnim([
		new OuterOutlineShader(ingot),
		new TemporalAnim(
			45n,
			(t) => 1.2 + Number(t) / 10,
			(r) => new FishEyeEffect(new OuterOutlineShader(ingot), r),
		),
		ingot,
	])
)

const gif = GifRenderer.render(scene)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))

const column = ColumnRenderer.render(scene)
await Deno.writeFile("out.png", await column.encode(9))
