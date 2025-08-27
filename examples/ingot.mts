import { FishEyeEffect } from "../engine/anim/effect/FishEyeEffect.mts"
import { PaddingEffect } from "../engine/anim/effect/PaddingEffect.mts"
import { OuterOutlineShader } from "../engine/anim/effect/shader/OuterOutlineShader.mts"
import { GroupAnim } from "../engine/anim/core/GroupAnim.mts"
import { LoadStaticAssetSource } from "../engine/anim/source/StaticAssetSource.mts"
import { TemporalAnim } from "../engine/anim/core/TemporalAnim.mts"
import { ExamplesRenderer } from "./ExamplesRenderer.mts"

const scene = new PaddingEffect(
	await LoadStaticAssetSource("examples/ingot.png"),
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

await ExamplesRenderer.render(scene)
