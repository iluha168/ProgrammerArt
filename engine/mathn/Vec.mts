export type Nums<Len> = Array<number> & { length: Len }
export type Vec2 = Vec<Nums<2>>
export type Vec3 = Vec<Nums<3>>

export class Vec<Val extends Nums<2 | 3>> {
	constructor(
		public values: Val,
	) {}

	mul(by: number): Vec<Val> {
		return new Vec(this.values.map((v) => v * by) as Val)
	}

	addVec({ values: o }: Vec<Val>): Vec<Val> {
		return new Vec(this.values.map((v, i) => v + o[i]) as Val)
	}

	subVec({ values: o }: Vec<Val>): Vec<Val> {
		return new Vec(this.values.map((v, i) => v - o[i]) as Val)
	}

	mulVec({ values: o }: Vec<Val>): Vec<Val> {
		return new Vec(this.values.map((v, i) => v * o[i]) as Val)
	}

	dot({ values: o }: Vec<Val>): number {
		return this.values.reduce((s, v, i) => s + v * o[i], 0)
	}

	inv(): Vec<Val> {
		return new Vec(this.values.map((v) => 1 / v) as Val)
	}

	length(): number {
		return Math.sqrt(this.values.reduce((s, v) => s + v * v, 0))
	}

	normalize(): Vec<Val> {
		return this.mul(1 / this.length())
	}
}
