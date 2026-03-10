import { capsule } from "../engine/3d/SDF.mts"
import { CacheAnim } from "../engine/anim/core/CacheAnim.mts"
import { ScaleEffect } from "../engine/anim/effect/ScaleEffect.mts"
import { SplitChannelEffect } from "../engine/anim/effect/SplitChannelEffect.mts"
import { StackAnim } from "../engine/anim/group/StackAnim.mts"
import { FunctionSource } from "../engine/anim/source/FunctionSource.mts"
import { RayMarchingSource } from "../engine/anim/source/RayMarchingSource.mts"
import { Mat, RGBA, Vec } from "../engine/mathn/mod.mts"
import { H, scene as pfpBase, W } from "./pfp.mts"

const moustache = new FunctionSource(
	(x, y) => {
		// Space warping
		x -= 0.52
		y -= -0.05 * Math.abs(10.1 * x) * Math.cos(x * Math.PI * 7) + 0.85 +
			x * -.04
		x = Math.abs(x) + 0.04

		// Infinity shape
		const arg = Math.atan2(y, x)
		const r = Math.hypot(x, y)
		if (Math.sin(arg * 2 + 0.5 * Math.PI) >= 4 * r)
			return RGBA.from(0, 0, 0, 230)
		return RGBA.from(0, 0, 0, 0)
	},
	W,
	H,
	4n,
)

const pipe = await new RayMarchingSource(
	W,
	H,
	(pos) =>
		Math.min(
			capsule(
				Mat.rot3(0, 0, 0).mulVec(
					pos.subVec(new Vec<3>([0.15, 0.35, 1])),
				),
				0.04,
				0.05,
			),
			capsule(
				Mat.rot3(.2, 0, 1.8).mulVec(
					pos.subVec(new Vec<3>([0.06, 0.65, 1.8])),
				),
				0.6,
				0.03,
			),
		),
	{
		antialising: 4,
	},
)
	.pipe((pipe) =>
		CacheAnim
			.create(`cache/pfpBusiness/pipe_${W}x${H}.gif`, pipe)
			.then((cache) => new SplitChannelEffect(cache, .7, .3, .1, 1))
	)

const smoke = new FunctionSource(
	(x, y) => {
		const pipeX = 0.655
		const pipeY = 0.84

		const dx = Math.abs(pipeX - x)

		return RGBA.from(
			255,
			255,
			255,
			110 /
				(20 * dx + 2) *
				((pipeY - y + 0.2) * 3),
		)
	},
	W,
	H,
	4n,
)

const scene = new StackAnim([
	await CacheAnim.create(`cache/pfp/${W}x${H}.gif`, pfpBase),
	moustache,
	pipe,
	smoke,
])

const render = new ScaleEffect(scene, 16n, 16n).render(0n)

await Deno.writeFile(
	"out.png",
	await render.encode(9, {
		author: "iluha168",
		copyright: "iluha168 All rights reserved",
		creationTime: new Date(),
		software: "https://github.com/iluha168/ProgrammerArt",
		source:
			"https://github.com/iluha168/ProgrammerArt/blob/pfp/examples/pfpBusiness.mts",
		title: "Profile Picture - Business",
	}),
)
