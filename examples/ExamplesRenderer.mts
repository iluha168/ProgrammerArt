import { GIF } from "imagescript"
import { Anim } from "../engine/anim/Anim.mts"

export class ExamplesRenderer {
	public static async render(anim: Anim) {
		const gif = new GIF([])
		for (let i = 0n; i < anim.f; i++) {
			console.debug(`Progress: ${i}/${anim.f} (${100n * i / anim.f}%)`)
			gif.push(anim.render(i))
		}

		gif.resize(gif.width * 8, gif.height * 8, "RESIZE_NEAREST_NEIGHBOR")
		return Deno.writeFile("out.gif", await gif.encode(100))
	}
}
