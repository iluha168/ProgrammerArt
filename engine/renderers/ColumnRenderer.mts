import type { Anim } from "../anim/Anim.mts"
import { TranslateEffect } from "../anim/effect/TranslateEffect.mts"
import { GroupAnim } from "../anim/core/GroupAnim.mts"
import { ExtractFrameAnim } from "../anim/core/ExtractFrameAnim.mts"

export class ColumnRenderer {
	public static render(anim: Anim) {
		return new GroupAnim(
			Array.from(
				{ length: Number(anim.f) },
				(_, i) =>
					new TranslateEffect(
						new ExtractFrameAnim(anim, BigInt(i)),
						0n,
						BigInt(i) * anim.h,
					),
			),
		).render(0n)
	}
}
