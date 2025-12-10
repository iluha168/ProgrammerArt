import { Frame, GIF } from "imagescript"
import { Anim } from "../Anim.mts"
import { dirname } from "node:path"

export class GIFSource extends Anim {
	constructor(protected gif: GIF) {
		super(
			BigInt(gif.length),
			BigInt(gif.width),
			BigInt(gif.height),
		)
	}

	protected override writeFrame(t: bigint): Frame {
		return this.gif[Number(t)]
	}
}

export const SaveGIF = (path: string, gif: GIF) =>
	Deno.mkdir(dirname(path), { recursive: true })
		.then(() => gif.encode(100))
		.then((data) => Deno.writeFile(path, data))

export const LoadGIFSource = (path: string) =>
	Deno
		.readFile(path)
		.then(GIF.decode)
		.then((gif) => new GIFSource(gif))
