import { Vec } from "../mathn/mod.mts"

export const sphere = (point: Vec<3>, radius: number) => point.length() - radius

export const box = (point: Vec<3>, size: Vec<3>) => {
	const distFromEdge = point.abs().subVec(size)
	return distFromEdge.max(0).length() + Math.min(distFromEdge.maxSide(), 0)
}
