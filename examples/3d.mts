import { RayMarchingAnim } from "../engine/3d/RayMarchingAnim.mts"
import { box } from "../engine/3d/SDF.mts"
import { TemporalAnim } from "../engine/anim/core/TemporalAnim.mts"
import { Mat, Vec } from "../engine/mathn/mod.mts"
import { GifRenderer } from "../engine/renderers/GifRenderer.mts"

const scene = new TemporalAnim(
	40n,
	(t) => 2 * Math.PI * Number(t) / 40,
	(t) =>
		new RayMarchingAnim(
			32n,
			32n,
			(pos) =>
				box(
					Mat.rot3(0, t, -0.2).mulVec(
						pos.subVec(new Vec<3>([0, 0.1, 3])),
					),
					new Vec<3>([0.2, 0.2, 1]),
				),
			new Vec<3>([-1, 0, 1]),
		),
)

const gif = GifRenderer.render(scene)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
