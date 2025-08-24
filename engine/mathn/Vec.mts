export type VecLen = 2 | 3
export type Nums<Len extends VecLen> = number[] & { length: Len }

export class Vec<Len extends VecLen> {
	constructor(
		public values: Nums<Len>,
	) {
		if (values.some(Number.isNaN)) {
			throw new Error(
				"Attempted to create Vec with NaN values: " + values,
			)
		}
	}

	protected map(cb: (v: number, i: number) => number): Vec<Len> {
		return new Vec(this.values.map(cb) as Nums<Len>)
	}

	protected mapVec(
		{ values: other }: Vec<Len>,
		cb: (a: number, b: number) => number,
	) {
		return this.map((v, i) => cb(v, other[i]))
	}

	mul(by: number) {
		return this.map((v) => v * by)
	}

	mulVec(other: Vec<Len>) {
		return this.mapVec(other, (a, b) => a * b)
	}

	max(n: number) {
		return this.map((v) => Math.max(v, n))
	}

	maxSide(): number {
		return Math.max.apply(null, this.values)
	}

	add(n: number) {
		return this.map((v) => v + n)
	}

	addVec(other: Vec<Len>) {
		return this.mapVec(other, (a, b) => a + b)
	}

	subVec(other: Vec<Len>) {
		return this.mapVec(other, (a, b) => a - b)
	}

	dot(other: Vec<Len>): number {
		return this.mulVec(other).values.reduce((s, n) => s + n)
	}

	inv() {
		return this.map((v) => 1 / v)
	}

	neg() {
		return this.map((v) => -v)
	}

	abs() {
		return this.map(Math.abs)
	}

	length(): number {
		return Math.sqrt(this.values.reduce((s, v) => s + v * v, 0))
	}

	normalize() {
		return this.mul(1 / this.length())
	}
}
