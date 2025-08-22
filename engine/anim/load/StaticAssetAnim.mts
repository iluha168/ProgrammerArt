import { Frame, Image } from "imagescript"
import { Anim } from "../Anim.mts"

export class StaticAssetAnim extends Anim {
	constructor(protected img: Image) {
		super(
			1n,
			BigInt(img.width),
			BigInt(img.height),
		)
	}

	public override render(_: bigint, onto = this.blankFrame()) {
		return onto.composite(Frame.from(
			this.img,
			Number(this.f),
			0,
			0,
			Frame.DISPOSAL_BACKGROUND,
		))
	}
}

export const LoadStaticAssetAnim = (path: string) =>
	Deno
		.readFile(path)
		.then(Image.decode)
		.then((img) => new StaticAssetAnim(img))
