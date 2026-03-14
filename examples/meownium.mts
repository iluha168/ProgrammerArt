import { BakeAnim } from "../engine/anim/core/BakeAnim.mts"
import { MaskEffect } from "../engine/anim/effect/MaskEffect.mts"
import { PaddingEffect } from "../engine/anim/effect/PaddingEffect.mts"
import { ScaleEffect } from "../engine/anim/effect/ScaleEffect.mts"
import { FunctionShader } from "../engine/anim/effect/shader/FunctionShader.mts"
import { InnerOutlineShader } from "../engine/anim/effect/shader/InnerOutlineShader.mts"
import { TranslateEffect } from "../engine/anim/effect/TranslateEffect.mts"
import { StackAnim } from "../engine/anim/group/StackAnim.mts"
import { FunctionSource } from "../engine/anim/source/FunctionSource.mts"
import { LoadImageSource } from "../engine/anim/source/ImageSource.mts"
import {
	isInPolygon,
	isNearBezierCurve,
	Point,
	RGBA,
} from "../engine/mathn/mod.mts"
import { isInEllipse } from "../engine/mathn/shapes2d.mts"

const colors = {
	transparent: new RGBA(0),
	fur: RGBA.from(0x10, 0x10, 0x1d, 0xff),
	/** Nose, eyebrows, lips, whiskers, teeth, also cell-shading */
	facialFeatures: RGBA.from(0x91, 0x91, 0x9c, 0xff),
	eye: RGBA.from(0x62, 0x70, 0xff, 0xff),
	glassesFrame: RGBA.from(0xb4, 0xb4, 0xbd, 0xff),
	pupil: RGBA.from(0x04, 0x0b, 0x40, 0xff),
	pupilGlare: RGBA.from(0x0d, 0x18, 0x64, 0xff),
	irisDark: RGBA.from(0x48, 0x55, 0xef, 0xff),
	irisLight: RGBA.from(0x74, 0x8c, 0xff, 0xff),
	cheekInside: RGBA.from(0x1a, 0x22, 0x7e, 0xff),
	tongue: RGBA.from(0x38, 0x43, 0xbd, 0xff),
} as const

const ingotNotScaled = await LoadImageSource("examples/ingot.png")
const ingot = new ScaleEffect(ingotNotScaled, 4n, 4n)

const eye = new FunctionSource(
	(x, y) => {
		const r = Math.hypot((x - 0.5) * 1, (y - 0.5) * 0.9)
		if (r <= 0.05) return colors.pupilGlare
		if (r <= 0.16) return colors.pupil
		if (r <= 0.3)
			return colors.irisLight.lerp(colors.irisDark, r / 0.3)
		return colors.transparent
	},
	16n,
	16n,
).pipe((anim) => new BakeAnim(anim))

const nose = new FunctionSource(
	(x, y) =>
		isInPolygon(
				[x, y],
				[0.0, 0.5],
				[0.7, 1.0],
				[1.0, 0.0],
			) ?
			colors.facialFeatures :
			colors.transparent,
	16n,
	9n,
).pipe((anim) => new BakeAnim(anim))

const mouth = new FunctionSource(
	(x, y) => {
		if (
			isInPolygon(
				[x, y],
				[0.7, 0.4],
				[0.9, 0.7],
				[0.2, 1.0],
			)
		) { return colors.tongue }
		if (
			// Tooth
			isInPolygon(
				[x, y],
				[0.6, 0.2],
				[0.7, 0.45],
				[0.9, 0.0],
			)
		) { return colors.facialFeatures }
		if (
			isInPolygon(
				[x, y],
				[0.0, 0.2],
				[1.0, 0.0],
				[0.9, 0.7],
				[0.2, 1.0],
			)
		) { return colors.cheekInside }
		return colors.transparent
	},
	14n,
	10n,
).pipe((anim) => new BakeAnim(anim))

const face = new MaskEffect(
	ingot,
	new StackAnim([
		// Background
		new FunctionSource(() => colors.fur, ingot.w, ingot.h),
		// Cell shade the whole render
		new MaskEffect(
			new FunctionSource(() => colors.facialFeatures, ingot.w, ingot.h),
			new ScaleEffect(
				new InnerOutlineShader(ingotNotScaled),
				ingot.w / ingotNotScaled.w,
				ingot.h / ingotNotScaled.h,
			),
		),

		new TranslateEffect(
			eye,
			Number(ingot.w) * 0.05,
			Number(ingot.h) * 0.43,
		),
		new TranslateEffect(
			eye,
			Number(ingot.w) * 0.56,
			Number(ingot.h) * 0.27,
		),
		new TranslateEffect(
			nose,
			Number(ingot.w) * 0.31,
			Number(ingot.h) * 0.45,
		),

		// Mouth
		new TranslateEffect(
			new StackAnim([
				mouth,
				// Mouth cell-shading
				new FunctionShader(
					new InnerOutlineShader(mouth),
					(_, x, y, color) => [
						x,
						y,
						color ?
							colors.facialFeatures.color :
							colors.transparent.color,
					],
				),
			]),
			Number(ingot.w) * 0.56,
			Number(ingot.h) * 0.52,
		),
	]),
)
	.pipe((anim) => new PaddingEffect(anim, 16n, 16n, 16n, 0n))
	.pipe((anim) => new BakeAnim(anim))

const whiskers = new FunctionSource(
	(x, y) =>
		([
				// Left whiskers
				[
					[0.02, 0.58],
					[0.08, 0.53],
					[0.18, 0.60],
				],
				[
					[0.03, 0.78],
					[0.08, 0.71],
					[0.18, 0.72],
				],
				[
					[0.12, 0.95],
					[0.18, 0.84],
					[0.27, 0.83],
				],
				// Right whiskers
				[
					[0.67, 0.40],
					[0.71, 0.26],
					[0.83, 0.30],
				],
				[
					[0.76, 0.49],
					[0.86, 0.38],
					[0.94, 0.44],
				],
				[
					[0.77, 0.65],
					[0.90, 0.52],
					[0.99, 0.60],
				],
			] satisfies [Point, Point, Point][]).some((p) =>
				isNearBezierCurve([x, y], ...p, 0.017)
			) ?
			colors.facialFeatures :
			colors.transparent,
	face.w,
	face.h,
	2n,
).pipe((anim) => new BakeAnim(anim))

const ears = new FunctionSource(
	(x, y) =>
		isInPolygon(
				[x, y],
				[0.2, 0.6],
				[0.05, 0.47],
				[0.4, 0.45],
			) || isInPolygon(
				[x, y],
				[0.5, 0.5],
				[0.2, 0.35],
				[0.7, 0.38],
			) ?
			colors.fur :
			colors.transparent,
	face.w,
	face.h,
).pipe((anim) => new BakeAnim(anim))

const eyebrows = new FunctionSource(
	(x, y) =>
		isInEllipse(
				[x, y],
				[0.22, 0.35],
				[0.32, 0.3],
				0.15,
			) || isInEllipse(
				[x, y],
				[0.55, 0.25],
				[0.65, 0.3],
				0.15,
			) ?
			colors.facialFeatures :
			colors.transparent,
	face.w,
	face.h,
)

const glassesFrame = new FunctionSource(
	(x, y) => {
		const r = Math.hypot(x - 0.62, y - 0.52)
		if (r <= 0.08) return colors.transparent
		if (r <= 0.10) return colors.glassesFrame

		if (
			isNearBezierCurve(
				[x, y],
				[0.62, 0.55],
				[0.64, 0.58],
				[0.72, 0.44],
				0.015,
			) || isNearBezierCurve(
				[x, y],
				[0.43, 0.54],
				[0.54, 0.51],
				[0.58, 0.60],
				0.01,
			)
		) { return colors.glassesFrame }

		return colors.transparent
	},
	face.w,
	face.h,
	4n,
)

const scene = new StackAnim([
	ears,
	new FunctionShader(
		new InnerOutlineShader(ears),
		(_, x, y, color) => [
			x,
			y,
			color ? colors.facialFeatures.color : colors.transparent.color,
		],
	),
	whiskers,
	face,
	eyebrows,
	glassesFrame,
])

const render = new ScaleEffect(scene, 8n, 8n).render(0n)

await Deno.writeFile(
	"out.png",
	await render.encode(9, {
		author: "iluha168",
		copyright: "iluha168 All rights reserved",
		creationTime: new Date(),
		software: "https://github.com/iluha168/ProgrammerArt",
		source:
			"https://github.com/iluha168/ProgrammerArt/blob/meownium/examples/meownium.mts",
		title: "Meownium",
	}),
)
