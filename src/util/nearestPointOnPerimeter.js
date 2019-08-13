/**
 * Return the nearest point to the given reference on the perimeter of the rectangle
 * defined by the given top left and bottom right coordiantes.
 * @param topLeft
 * @param bottomRight
 * @param reference
 */
export default function nearestPointOnPerimeter(
  topLeft,
  bottomRight,
  reference
) {
  // Reference: https://stackoverflow.com/questions/20453545/how-to-find-the-nearest-point-in-the-perimeter-of-a-rectangle-to-a-given-point
  const [l, r, t, b] = [topLeft.x, bottomRight.x, topLeft.y, bottomRight.y];
  const [x, y] = [clamp(reference.x, l, r), clamp(reference.y, t, b)];
  const [dl, dr, dt, db] = [x - l, x - r, y - t, y - b].map(o => Math.abs(o));
  const m = Math.min(dl, dr, dt, db);
  return m === dl
    ? { x: l, y }
    : m === dr
    ? { x: r, y }
    : m === dt
    ? { x, y: t }
    : { x, y: b };
}

/**
 * If the given number is outside of the given boundaries, then return the respecitve boundary.
 * @param a the reference number
 * @param lower the lower boundary
 * @param upper the upper boundary
 * @returns {number}
 */
function clamp(a, lower, upper) {
  return Math.max(lower, Math.min(a, upper));
}
