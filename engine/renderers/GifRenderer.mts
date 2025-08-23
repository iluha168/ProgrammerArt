import { GIF } from "imagescript"
import type { Anim } from "../anim/Anim.mts"

export class GifRenderer {
	public static render(anim: Anim) {
		const gif = new GIF([])
		for (let i = 0n; i < anim.f; i++)
			gif.push(anim.render(i))
		return gif
	}
}
