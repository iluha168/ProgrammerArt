import { Frame, Image } from "imagescript"
import { Scene } from "../engine/Scene.mts"
import { SceneObj } from "../engine/SceneObj.mts"
import { RGBA } from "../engine/RGBA.mts"

const originalIngot = await Image.decode(
	await Deno.readFile("examples/ingot.png"),
)

class Pixel extends SceneObj {
	constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly c: number,
	) {
		super()
	}

	public override render(frame: Frame, frameIndex: number) {
		if (frameIndex > Math.PI * 20) return false
		const X = this.x + 8
		const Y = this.y + 8
		const C = RGBA.from(
			new RGBA(
				originalIngot.getPixelAt(
					this.x,
					this.y
						+ Math.round(Math.sin(this.x + frameIndex + 0)),
				),
			).r,
			new RGBA(
				originalIngot.getPixelAt(
					this.x,
					this.y
						+ Math.round(Math.sin(this.x + frameIndex + 2)),
				),
			).g,
			new RGBA(
				originalIngot.getPixelAt(
					this.x,
					this.y
						+ Math.round(Math.sin(this.x + frameIndex + 4)),
				),
			).b,
			new RGBA(
				originalIngot.getPixelAt(
					this.x,
					this.y
						+ Math.round(Math.sin(this.x + frameIndex + 6)),
				),
			).a,
		).color

		// Antialising ahh
		frame.setPixelAt(Math.floor(X), Math.floor(Y), C)
		frame.setPixelAt(Math.floor(X), Math.ceil(Y), C)
		frame.setPixelAt(Math.ceil(X), Math.floor(Y), C)
		frame.setPixelAt(Math.ceil(X), Math.ceil(Y), C)
	}
}

const scene = new Scene(32, 32, 50, [
	...originalIngot.iterateWithColors().map(([x, y, c]) => new Pixel(x, y, c)),
])

const gif = scene.render()
gif.resize(128, 128, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
