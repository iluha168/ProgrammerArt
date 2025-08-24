import { Vec } from "../mathn/mod.mts"

export const sphere = (point: Vec<3>, radius: number) => point.length() - radius

export const box = (point: Vec<3>, size: Vec<3>) => {
	const distFromEdge = point.abs().subVec(size)
	return distFromEdge.max(0).length() + Math.min(distFromEdge.maxSide(), 0)
}

export const wireframe = (point: Vec<3>, size: Vec<3>, thickness: number) => {
	const p = point.abs().subVec(size)
	const q = p.add(thickness).abs().sub(thickness)
	const a1 = new Vec<3>([p.values[0], q.values[1], q.values[2]])
	const a2 = new Vec<3>([q.values[0], p.values[1], q.values[2]])
	const a3 = new Vec<3>([q.values[0], q.values[1], p.values[2]])

	return Math.min(
		a1.max(0).length() + Math.min(a1.maxSide(), 0.0),
		a2.max(0).length() + Math.min(a2.maxSide(), 0.0),
		a3.max(0).length() + Math.min(a3.maxSide(), 0.0),
	)
}
