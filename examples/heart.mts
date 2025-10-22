import { FunctionSource } from "../engine/anim/source/FunctionSource.mts"
import { ExamplesRenderer } from "./ExamplesRenderer.mts"

const scene = new FunctionSource(
	(x, y) => {
		x = (x - 0.5605) * 0.9
		y = (0.7 - y) * 0.9
		return (x * x + y * y - .1) ** 3 < x * x * y ** 3 ? 0x00FF00FFn : 0n
	},
	16n,
	16n,
	16n,
)

await ExamplesRenderer.render(scene)
