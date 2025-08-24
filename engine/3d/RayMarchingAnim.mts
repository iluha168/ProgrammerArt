import { Frame } from "imagescript"
import { Anim } from "../anim/Anim.mts"
import { Nums, RGBA, sigmoid, Vec } from "../mathn/mod.mts"

export class RayMarchingAnim extends Anim {
	static MAX_STEPS: number = 100
	static SURF_DIST: number = 1e-10
	static FAR_DIST: number = 100

	constructor(
		w: bigint,
		h: bigint,
		protected readonly distanceToScene: (point: Vec<3>) => number,
		protected readonly lightSource: Vec<3> = new Vec<3>([0, 0, 0]),
		protected readonly camera: Vec<3> = new Vec<3>([0, 0, 0]),
	) {
		super(
			1n,
			w,
			h,
		)
	}
	protected override writeFrame(_: bigint, onto = this.blankFrame()): Frame {
		const size = new Vec([Number(this.w), Number(this.h)])
		const sizeHalf = size.mul(0.5)
		const sizeInv = size.inv()

		for (let x = 0; x < this.w; x++) {
			for (let y = 0; y < this.h; y++) {
				// 2 * (xy - wh/2) / wh		-->	uv == [-1, 1)
				const uv = new Vec([x, y])
					.subVec(sizeHalf)
					.mul(2)
					.mulVec(sizeInv)
				const rayDir = new Vec([...uv.values, 2] as Nums<3>).normalize()
				const objectDistance = this.bumpIntoObject(this.camera, rayDir)
				if (objectDistance > RayMarchingAnim.FAR_DIST) {
					onto.setPixelAt(x + 1, y + 1, 0)
					continue
				}

				const objectPosition = this.camera.addVec(
					rayDir.mul(objectDistance),
				)
				const lum = 0xFF
					* sigmoid(
						this.luminosityAt(objectPosition, this.lightSource),
					)
				const { color } = RGBA.from(lum, lum, lum, 0xFF)
				onto.setPixelAt(x + 1, y + 1, color)
			}
		}
		return onto
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

	protected luminosityAt(point: Vec<3>, lightSourceAt: Vec<3>) {
		const lightSourceDirection = lightSourceAt.subVec(point)
		const rayTowardsLightSource = lightSourceDirection.normalize()
		const normal = this.normalAt(point)
		let luminosity = normal.dot(rayTowardsLightSource)
		const distanceToLightSource = this.bumpIntoObject(
			normal.mul(RayMarchingAnim.SURF_DIST * 2).addVec(point),
			rayTowardsLightSource,
		)
		if (distanceToLightSource < lightSourceDirection.length()) {
			// Obstructed
			luminosity *= 0.1
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
