import { RayMarchingAnim } from "../engine/3d/RayMarchingAnim.mts"
import { sphere } from "../engine/3d/SDF.mts"
import { TemporalAnim } from "../engine/anim/core/TemporalAnim.mts"
import { Vec } from "../engine/mathn/mod.mts"
import { ColumnRenderer } from "../engine/renderers/ColumnRenderer.mts"
import { GifRenderer } from "../engine/renderers/GifRenderer.mts"

const scene = new TemporalAnim(
	80n,
	(t) => 2 * Math.PI * Number(t) / 80,
	(t) =>
		new RayMarchingAnim(
			32n,
			32n,
			(pos) =>
				sphere(
					pos.subVec(new Vec([0, 0, 2])),
					0.5,
				),
			new Vec([Math.sin(t), Math.cos(t * 4), 1]),
		),
)

const gif = GifRenderer.render(scene)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))

const column = ColumnRenderer.render(scene)
await Deno.writeFile("out.png", await column.encode(9))
