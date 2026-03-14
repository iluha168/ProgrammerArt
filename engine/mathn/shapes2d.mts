export type Point = [number, number]

export function sign(
	[px, py]: Point,
	[ax, ay]: Point,
	[bx, by]: Point,
): number {
	return (bx - ax) * (py - ay) - (by - ay) * (px - ax)
}

export function isInPolygon(p: Point, ...points: Point[]): boolean {
	if (points.length < 3) return false
	const expectedSign = sign(p, points.at(-1)!, points[0]) >= 0

	for (let i = 0; i < points.length - 1; i++) {
		if ((sign(p, points[i], points[i + 1]) >= 0) !== expectedSign)
			return false
	}
	return true
}

export function isNearBezierCurve(
	[px, py]: Point,
	[p0x, p0y]: Point,
	[p1x, p1y]: Point,
	[p2x, p2y]: Point,
	threshold: number,
): boolean {
	let minDistance = Infinity

	for (let t = 0; t <= 1; t += 0.01) {
		const x = (1 - t) ** 2 * p0x + 2 * (1 - t) * t * p1x + t ** 2 * p2x
		const y = (1 - t) ** 2 * p0y + 2 * (1 - t) * t * p1y + t ** 2 * p2y
		const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2)
		minDistance = Math.min(minDistance, distance)
	}

	return minDistance <= threshold
}

export function isInEllipse(
	[px, py]: Point,
	[f0x, f0y]: Point,
	[f1x, f1y]: Point,
	r: number,
): boolean {
	return Math.hypot(px - f0x, py - f0y) + Math.hypot(px - f1x, py - f1y) <= r
}
