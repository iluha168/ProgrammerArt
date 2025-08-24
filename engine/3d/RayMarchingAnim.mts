import { Frame } from "imagescript"
import { Anim } from "../anim/Anim.mts"
import { RGBA, Vec } from "../mathn/mod.mts"

type Options = Readonly<{
	lightSource: Vec<3>
	ambientLuminosity: number

	camera: Vec<3>
	isometric: boolean

	antialising: 1 | 2 | 4 | 8 | 16 | 32
}>

const defaultOptions: Required<Options> = {
	lightSource: new Vec<3>([0, 0, 0]),
	ambientLuminosity: 0.1,

	camera: new Vec<3>([0, 0, 0]),
	isometric: false,

	antialising: 1,
}

export class RayMarchingAnim extends Anim {
	static MAX_STEPS: number = 100
	static SURF_DIST: number = 1e-10
	static FAR_DIST: number = 100

	protected readonly options: Options
	protected readonly size: Vec<2>
	protected readonly sizeHalf: Vec<2>
	protected readonly sizeInv: Vec<2>

	constructor(
		w: bigint,
		h: bigint,
		protected readonly distanceToScene: (point: Vec<3>) => number,
		options: Partial<Options> = {},
	) {
		super(1n, w, h)
		this.options = { ...defaultOptions, ...options }

		this.size = new Vec<2>([Number(this.w), Number(this.h)])
		this.sizeHalf = this.size.mul(0.5)
		this.sizeInv = this.size.inv()
	}
	protected override writeFrame(_: bigint, onto = this.blankFrame()): Frame {
		for (let x = 0; x < this.w; x++) {
			for (let y = 0; y < this.h; y++)
				onto.setPixelAt(x + 1, y + 1, this.getPixelNx(x, y).color)
		}
		return onto
	}

	protected getPixelNx(x: number, y: number): RGBA {
		let cumulative = new Vec<4>([0, 0, 0, 0])
		for (let dx = 0; dx < this.options.antialising; dx++) {
			for (let dy = 0; dy < this.options.antialising; dy++) {
				const { r, g, b, a } = this.getPixel1x(
					x + dx / this.options.antialising,
					y + dy / this.options.antialising,
				)
				cumulative = cumulative.addVec(new Vec<4>([r, g, b, a]))
			}
		}
		cumulative = cumulative.mul(this.options.antialising ** -2)
		return RGBA.from(...cumulative.values)
	}

	protected getPixel1x(x: number, y: number): RGBA {
		// 2 * (xy - wh/2) / wh		-->	uv == [-1, 1)
		const uv = new Vec<2>([x, y])
			.subVec(this.sizeHalf)
			.mul(2)
			.mulVec(this.sizeInv)
		const rayDir = this.options.isometric
			? new Vec<3>([0, 0, 1])
			: new Vec<3>([...uv.values, 2]).normalize()
		const rayOrigin = this.options.isometric
			? this.options.camera.addVec(
				new Vec<3>([...uv.values, 0]),
			)
			: this.options.camera
		const objectDistance = this.bumpIntoObject(
			rayOrigin,
			rayDir,
		)
		if (objectDistance > RayMarchingAnim.FAR_DIST)
			return new RGBA(0x00000000)

		const objectPosition = rayOrigin.addVec(
			rayDir.mul(objectDistance),
		)
		const lum = 0xFF
			* this.luminosityAt(
				objectPosition,
				this.options.lightSource,
			)
		return RGBA.from(lum, lum, lum, 0xFF)
	}

	protected bumpIntoObject(origin: Vec<3>, direction: Vec<3>) {
		let distance = 0
		for (let i = 0; i < RayMarchingAnim.MAX_STEPS; i++) {
			const pos = origin.addVec(direction.mul(distance))
			distance += this.distanceToScene(pos)
			if (Math.abs(distance) < RayMarchingAnim.SURF_DIST) break
		}
		return distance
	}

	/** @returns Value in range [0; 1] */
	protected luminosityAt(point: Vec<3>, lightSourceAt: Vec<3>) {
		const lightSourceDirection = lightSourceAt.subVec(point)
		const rayTowardsLightSource = lightSourceDirection.normalize()
		const normal = this.normalAt(point)
		let luminosity = (normal.dot(rayTowardsLightSource) + 1) / 2
		const distanceToLightSource = this.bumpIntoObject(
			normal.mul(RayMarchingAnim.SURF_DIST * 2).addVec(point),
			rayTowardsLightSource,
		)
		if (distanceToLightSource < lightSourceDirection.length()) {
			// Obstructed
			luminosity *= this.options.ambientLuminosity
		}
		return luminosity
	}

	protected normalAt(point: Vec<3>): Vec<3> {
		const dist = this.distanceToScene(point)
		const [x, y, z] = point.values
		return new Vec<3>([
			dist
			- this.distanceToScene(
				new Vec<3>([x - RayMarchingAnim.SURF_DIST, y, z]),
			),
			dist
			- this.distanceToScene(
				new Vec<3>([x, y - RayMarchingAnim.SURF_DIST, z]),
			),
			dist
			- this.distanceToScene(
				new Vec<3>([x, y, z - RayMarchingAnim.SURF_DIST]),
			),
		]).normalize()
	}
}
