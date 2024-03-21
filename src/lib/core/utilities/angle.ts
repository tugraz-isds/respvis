export function normalizeAngle(degrees: number) {
  degrees = degrees % 360;
  return degrees < 0 ? degrees + 360 : degrees
}
