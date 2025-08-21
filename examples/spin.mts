import { Frame } from "imagescript"
import { Scene } from "../engine/Scene.mts"
import { SceneObj } from "../engine/SceneObj.mts"

class Spinner extends SceneObj {
	public override render(frame: Frame, frameIndex: number) {
		const phi = frameIndex / 5
		if (phi > Math.PI * 2) return false
		const dx = Math.sin(phi)
		const dy = Math.cos(phi)
		frame.drawCircle(
			Math.ceil(frame.width / 2 + dx * scene.width / 2.4),
			Math.ceil(frame.height / 2 + dy * scene.height / 2.4),
			2,
			0x00FF00FF,
		)
	}
}

const scene = new Scene(16, 16, 20, [
	new Spinner(),
])

await scene.render("out.gif")
