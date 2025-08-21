import { Frame, GIF } from "imagescript"
import { SceneObj } from "./SceneObj.mts"

export class Scene {
	constructor(
		public readonly width: number,
		public readonly height: number,
		private readonly mspf: number,
		private objects: SceneObj[] = [],
	) {
		if (mspf < 20) throw new Error("mspf cannot be less than 20")
	}

	render() {
		const gif = new GIF([])
		renderLoop: for (;;) {
			const frame = new Frame(
				this.width,
				this.height,
				this.mspf,
				0,
				0,
				"background",
			)
			for (const object of this.objects) {
				try {
					if (object.render(frame, gif.length) === false)
						break renderLoop
				} catch (e) {
					if (!(e instanceof RangeError)) throw e
				}
			}
			if (gif.push(frame) > 1024) // hard cap
				break renderLoop
		}
		return gif
	}
}
