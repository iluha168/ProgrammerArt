import { GIF } from "imagescript"
import { Anim } from "../Anim.mts"
import { LoadGIFSource, SaveGIF } from "../source/GIFSource.mts"
import { BakeAnim } from "./BakeAnim.mts"

export class CacheAnim extends BakeAnim {
	static async create(path: string, child: Anim) {
		const cached = await LoadGIFSource(path).catch(() => null)
		if (cached) return cached
		const fresh = new CacheAnim(child)
		await SaveGIF(path, new GIF(fresh.cache))
		return fresh
	}
}
