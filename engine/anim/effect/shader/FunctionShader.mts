import { Anim } from "../../Anim.mts"
import { Shader } from "./Shader.mts"

export class FunctionShader extends Shader {
	constructor(
		protected override readonly child: Anim,
		protected override readonly shader: Shader["shader"],
	) {
		super(
			child.f,
			child.w,
			child.h,
		)
	}
}
