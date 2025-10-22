import { RayMarchingSource } from "../engine/anim/source/RayMarchingSource.mts"
import { wireframe } from "../engine/3d/SDF.mts"
import { Mat, Vec } from "../engine/mathn/mod.mts"
import { ExamplesRenderer } from "./ExamplesRenderer.mts"

const scene = new RayMarchingSource(
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

await ExamplesRenderer.render(scene)
