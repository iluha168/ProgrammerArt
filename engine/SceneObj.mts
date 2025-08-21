import { Frame } from "imagescript"

export abstract class SceneObj {
	public abstract render(
		frame: Frame,
		frameIndex: number,
	): boolean | void
}
