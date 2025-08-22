export const GCD = (a: bigint, b: bigint) => {
	if (a < 1n || b < 1n)
		throw new RangeError()

	for (;;) {
		const r = a % b
		if (!r) return b
		a = b
		b = r
	}
}

export const LCM = (a: bigint, b: bigint) => a / GCD(a, b) * b

if (import.meta.main)
	console.log(GCD(1071n, 462n))
