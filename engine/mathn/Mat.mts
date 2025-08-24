import { Nums, Vec, VecLen } from "./Vec.mts"

export type Vecs<Len extends VecLen> = Vec<VecLen>[] & { length: Len }

export class Mat<Len extends VecLen> {
	constructor(
		public vecs: Vecs<Len>,
	) {
		if (vecs.some(Number.isNaN)) {
			throw new Error(
				"Attempted to create Vec with NaN values: " + vecs,
			)
		}
	}

	static rot3(yaw: number, pitch: number, roll: number): Mat<3> {
		const cy = Math.cos(yaw)
		const sy = Math.sin(yaw)
		const cp = Math.cos(pitch)
		const sp = Math.sin(pitch)
		const cg = Math.cos(roll)
		const sr = Math.sin(roll)
		return new Mat<3>(
			[
				new Vec<3>([
					cy * cp,
					cy * sp * sr - sy * cg,
					cy * sp * cg + sy * sr,
				]),
				new Vec<3>([
					sy * cp,
					sy * sp * sr + cy * cg,
					sy * sp * cg - cy * sr,
				]),
				new Vec<3>([
					-sp,
					cp * sr,
					cp * cg,
				]),
			] as const,
		)
	}

	mulVec(b: Vec<Len>): Vec<Len> {
		return new Vec(this.vecs.map((a) => a.dot(b)) as Nums<Len>)
	}
}
