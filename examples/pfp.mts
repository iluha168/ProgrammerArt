import { FunctionSource } from "../engine/anim/source/FunctionSource.mts"
import { RayMarchingSource } from "../engine/anim/source/RayMarchingSource.mts"
import { capsule } from "../engine/3d/SDF.mts"
import { Mat, RGBA, Vec } from "../engine/mathn/mod.mts"
import { StackAnim } from "../engine/anim/group/StackAnim.mts"
import { MaskEffect } from "../engine/anim/effect/MaskEffect.mts"
import { ScaleEffect } from "../engine/anim/effect/ScaleEffect.mts"
import { BakeAnim } from "../engine/anim/core/BakeAnim.mts"
import { TranslateEffect } from "../engine/anim/effect/TranslateEffect.mts"
import { CropEffect } from "../engine/anim/effect/CropEffect.mts"
import { CacheAnim } from "../engine/anim/core/CacheAnim.mts"

export const W = 64n
export const H = W

const background = new FunctionSource(
	(x, y) => {
		const step = y * Math.sin(x * .6 + y)
		const g = Math.round(128 + (255 - 128) * step)
		const b = Math.round(200 + (255 - 200) * step)
		return RGBA.from(0, g, b, 255)
	},
	W,
	H,
)

const stripes = new FunctionSource(
	(x, y) => {
		x = (2.1 - Math.sin(x * Math.PI) * 1.2) * (x - 0.5)

		const often = 14 * Math.PI
		const squash = 1.7 + (Math.sin(x * Math.PI) * 0.1)

		const L = (Math.sin((x - y * squash) * often) + 1) * 0.5
		const R = (Math.sin((x + y * squash) * often) + 1) * 0.5
		if (L >= 0.95 || R >= 0.95)
			return RGBA.from(0, (1 - y) * 20 + x * 90 + 40, 0, 200)

		const intensity = Math.sqrt((1 - L) * (1 - R)) * 105 + 150
		return RGBA.from(intensity, intensity * 0.83, 0, 255)
	},
	W,
	H,
	4n,
)

RayMarchingSource.FAR_DIST = 3
RayMarchingSource.SURF_DIST = 1e-2
RayMarchingSource.MAX_STEPS = 60
const body = await new RayMarchingSource(
	W,
	H,
	(pos) =>
		capsule(
			Mat.rot3(0.05, 0, 0.3).mulVec(
				pos.subVec(new Vec<3>([0, 0.4, 2])),
			),
			0.8,
			0.6,
		),
	{
		antialising: 2,
	},
)
	.pipe((anim) => CacheAnim.create(`cache/pfp/body_${W}_${H}.gif`, anim))

const createRays = (
	{ r, g, b, a }: RGBA,
	baseRadius: number,
	radiusFrequency: number,
	radiusAmplitude: number,
) => new FunctionSource(
	(x, y) => {
		const cx = 1.1
		const cy = -0.1

		const dx = x - cx
		const dy = y - cy
		const distance = dx * dx + dy * dy
		const angle = Math.atan2(dy, dx)
		const radius = baseRadius *
			(Math.cos(radiusFrequency * Math.PI * angle) * radiusAmplitude + 1)

		const intensity = 1 - distance / radius

		return RGBA.from(
			r,
			g,
			b,
			intensity * a,
		)
	},
	W,
	H,
)

const sun = new StackAnim([
	createRays(RGBA.from(255, 255, 250, 200), 0.2, 1, 0.4),
	createRays(RGBA.from(255, 100, 20, 100), 0.3, 0, 0),
	createRays(RGBA.from(255, 255, 0, 70), 0.5, 6, 1),
])

const createLeaf = (
	leafTip: { x: number; y: number },
	baseRadius: number,
	leafBase: { x: number; y: number },
	brightness: number,
) => new FunctionSource(
	(x, y) => {
		const leafMidpoint = {
			x: leafTip.x * 0.4 + leafBase.x * 0.6,
			y: leafTip.y - 0.1,
		}

		const dist = bezierDistance(
			x,
			y,
			leafBase,
			leafMidpoint,
			leafTip,
		)
		// The closer to the tip the smaller, 0 at the tip
		const radius = Math.sqrt((x - leafTip.x) ** 2 + (y - leafTip.y) ** 2) *
			baseRadius

		const intensity = 1 - dist / radius
		if (intensity >= 0.6)
			return RGBA.from(10, brightness, 10, intensity * 255)
		if (intensity >= 0.3) return RGBA.from(0, 0, 0, 100)
		return new RGBA(0)
	},
	W,
	H,
	8n,
)

const bezierDistance = (
	x: number,
	y: number,
	p0: { x: number; y: number },
	p1: { x: number; y: number },
	p2: { x: number; y: number },
	samples = 32,
) => {
	let minDist = Infinity
	for (let i = 0; i <= samples; i++) {
		const t = i / samples
		// Quadratic Bezier formula
		const bx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x +
			t * t * p2.x
		const by = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y +
			t * t * p2.y
		const dist = Math.hypot(x - bx, y - by)
		if (dist < minDist) minDist = dist
	}
	return minDist
}

const leavesParameters: Parameters<typeof createLeaf>[] = [
	[{ x: 0.05, y: 0.45 }, 0.20, { x: 0.35, y: 0.44 }, 180],
	[{ x: 0.04, y: 0.30 }, 0.25, { x: 0.38, y: 0.42 }, 180],
	[{ x: 0.10, y: 0.15 }, 0.30, { x: 0.40, y: 0.40 }, 180],
	[{ x: 0.25, y: 0.05 }, 0.40, { x: 0.44, y: 0.40 }, 180],
	[{ x: 0.40, y: 0.00 }, 0.40, { x: 0.48, y: 0.40 }, 180],
]
leavesParameters.push(
	...leavesParameters.map<Parameters<typeof createLeaf>>((
		[tip, baseRadius, base, ...params],
	) => [
		{ x: 1 - tip.x, y: tip.y },
		baseRadius,
		{ x: 1 - base.x, y: base.y },
		...params,
	]).reverse(),
)

const leaves = new StackAnim(
	leavesParameters.map((params) => createLeaf(...params)),
)

const sunglassesLens = new FunctionSource(
	(x, y) => {
		x /= 0.4
		y /= 0.45

		const isInTrapezoid = (x: number, y: number) => {
			// Check if point is below the top edge
			if (y < 0.3 || y > 0.72) return false

			// Check if point is between the left and right edges
			const leftX = (y - 0.3) * 0.3 + 0.0 * (1 - (y - 0.3)) + 0.05
			const rightX = (y - 0.3) * 0.7 + 1.0 * (1 - (y - 0.3)) - 0.05

			// Distance from edges with rounded corners
			const cornerRadius = 0.1
			const distToLeft = x - leftX
			const distToRight = rightX - x
			const distToTop = y - 0.3
			const distToBottom = 0.72 - y

			// Check corners
			if (distToTop < cornerRadius && distToLeft < cornerRadius) {
				return Math.hypot(
					distToLeft - cornerRadius,
					distToTop - cornerRadius,
				) <= cornerRadius
			}
			if (distToTop < cornerRadius && distToRight < cornerRadius) {
				return Math.hypot(
					distToRight - cornerRadius,
					distToTop - cornerRadius,
				) <= cornerRadius
			}
			if (distToBottom < cornerRadius && distToLeft < cornerRadius) {
				return Math.hypot(
					distToLeft - cornerRadius,
					distToBottom - cornerRadius,
				) <= cornerRadius
			}
			if (distToBottom < cornerRadius && distToRight < cornerRadius) {
				return Math.hypot(
					distToRight - cornerRadius,
					distToBottom - cornerRadius,
				) <= cornerRadius
			}

			return distToLeft >= 0 && distToRight >= 0
		}

		if (isInTrapezoid(x, y)) {
			const whiteReflectionFlash = Math.max(
				180 - Math.hypot(x - 0.66, y - 0.2) * 400,
				0,
			)
			return RGBA.from(
				whiteReflectionFlash,
				whiteReflectionFlash,
				whiteReflectionFlash,
				240,
			)
		}

		return RGBA.from(0, 0, 0, 0)
	},
	W,
	H,
	4n,
).pipe((anim) => new BakeAnim(anim))

const sunglasses = new StackAnim([
	sunglassesLens
		.pipe((anim) =>
			new TranslateEffect(anim, Number(W) * 0.5, Number(H) * 0.45)
		)
		.pipe((anim) => new CropEffect(anim, 0n, 0n, W, H)),
	sunglassesLens
		.pipe((anim) =>
			new TranslateEffect(anim, Number(W) * 0.15, Number(H) * 0.45)
		)
		.pipe((anim) => new CropEffect(anim, 0n, 0n, W, H)),
])

export const scene = new StackAnim([
	background,
	new MaskEffect(
		body,
		stripes,
	),
	leaves,
	sunglasses,
	sun,
])

if (import.meta.main) {
	const render = new ScaleEffect(scene, 16n, 16n).render(0n)
	await Deno.writeFile(
		"out.png",
		await render.encode(9, {
			author: "iluha168",
			copyright: "iluha168 All rights reserved",
			creationTime: new Date(),
			software: "https://github.com/iluha168/ProgrammerArt",
			source:
				"https://github.com/iluha168/ProgrammerArt/blob/pfp/examples/pfp.mts",
			title: "Profile Picture",
		}),
	)
}
