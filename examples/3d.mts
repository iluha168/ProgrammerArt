import { RayMarchingAnim } from "../engine/3d/RayMarchingAnim.mts"
import { wireframe } from "../engine/3d/SDF.mts"
import { Mat, Vec } from "../engine/mathn/mod.mts"
import { GifRenderer } from "../engine/renderers/GifRenderer.mts"

const scene = new RayMarchingAnim(
	16n,
	16n,
	(pos) =>
		wireframe(
			Mat.rot3(0, -1, -0.6).mulVec(
				pos.subVec(new Vec<3>([0, -0.1, 3])),
			),
			new Vec<3>([0.4, 0.25, 0.8]),
			0.03,
		),
	{
		lightSource: new Vec<3>([-0.8, -0.6, 0]),
		ambientLuminosity: 0,
		isometric: true,
		antialising: 16,
	},
)

const gif = GifRenderer.render(scene)
gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
