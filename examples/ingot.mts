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
		if (frameIndex > 64) return false
		const X = this.x
		let Y = this.y + (
			frameIndex < this.x ? 0 : frameIndex - this.x
		)
		if (Y > 32) {
			Y -= 32
			if (Y > this.y) Y = this.y
		}
		const C = new RGBA(this.c)
			.color

		// Antialising ahh
		frame.setPixelAt(Math.floor(X), Math.floor(Y), C)
		frame.setPixelAt(Math.floor(X), Math.ceil(Y), C)
		frame.setPixelAt(Math.ceil(X), Math.floor(Y), C)
		frame.setPixelAt(Math.ceil(X), Math.ceil(Y), C)
	}
}

const scene = new Scene(32, 32, 50, [
	...originalIngot.iterateWithColors().map(([x, y, c]) =>
		new Pixel(
			x + 8,
			y + 8,
			c,
		)
	),
])

const gif = scene.render()
gif.resize(128, 128, "RESIZE_NEAREST_NEIGHBOR")
await Deno.writeFile("out.gif", await gif.encode(100))
