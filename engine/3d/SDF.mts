import { Vec3 } from "../mathn/mod.mts"

export const sphere = (point: Vec3, radius: number) => point.length() - radius
