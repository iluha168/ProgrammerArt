export type VecLen = 2 | 3 | 4
export type Tuple<T, N extends number> = N extends N ?
	number extends N ? T[] : _TupleOf<T, N, []> :
	never
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends
	N ? R :
	_TupleOf<T, N, [T, ...R]>

export class Vec<Len extends VecLen> {
	constructor(
		public values: Tuple<number, Len>,
	) {
		if (values.some(Number.isNaN)) {
			throw new Error(
				"Attempted to create Vec with NaN values: " + values,
			)
		}
	}

	protected map(cb: (v: number, i: number) => number): Vec<Len> {
		return new Vec(this.values.map(cb) as Tuple<number, Len>)
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

	sub(n: number) {
		return this.map((v) => v - n)
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
