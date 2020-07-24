/**
 * Return the nearest point to the given reference on the perimeter of the rectangle
 * defined by the given top left and bottom right coordiantes.
 * @param {{x: number, y: number}} topLeft the top left coordinate of the rectangle.
 * @param {{x: number, y: number}} bottomRight the bottom right coordinate of the rectangle.
 * @param {{x: number, y: number}} reference the reference point.
 * @returns {{x: number, y: number}} the nearest point to the reference point on the perimeter of the given rectangle.
 */
export function nearestPointOnPerimeter(topLeft, bottomRight, reference) {
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

function slope(point1, point2) {
  return (point2.y - point1.y) / (point2.x - point1.x);
}

export function intersectionPoint(midPoint, destinationPoint, topLeft, bottomRight) {
  const a = slope(midPoint, destinationPoint);
  const b = -a * midPoint.x + midPoint.y;

  const topIntersection = {
    x: (topLeft.y - b) / a,
    y: topLeft.y
  }
  const bottomIntersection = {
    x: (bottomRight.y - b) / a,
    y: bottomRight.y
  }
  const leftIntersection = {
    x: topLeft.x,
    y: a * topLeft.x + b
  }
  const rightIntersection = {
    x: bottomRight.x,
    y: a * bottomRight.x + b
  }

  if (topIntersection.x >= topLeft.x && topIntersection.x <= bottomRight.x && destinationPoint.y < midPoint.y) {
    return topIntersection;
  } else if (bottomIntersection.x >= topLeft.x && bottomIntersection.x <= bottomRight.x && destinationPoint.y > midPoint.y) {
    return bottomIntersection;
  } else if (leftIntersection.y >= topLeft.y && leftIntersection.y <= bottomRight.y && destinationPoint.x < midPoint.x) {
    return leftIntersection;
  } else if (rightIntersection.y >= topLeft.y && rightIntersection.y <= bottomRight.y && destinationPoint.x > midPoint.x) {
    return rightIntersection;
  } else {
    return midPoint;
  }
}

/**
 * If the given number is outside of the given boundaries, then return the respecitve boundary.
 * @param {number} a the reference number.
 * @param {number} lower the lower boundary.
 * @param {number} upper the upper boundary.
 * @returns {number} a if a is between the given boundaries, otherwise one of the boundaries.
 */
function clamp(a, lower, upper) {
  return Math.max(lower, Math.min(a, upper));
}

/**
 * Calculate the distance between the two given points.
 * @param x1 {number} the x coordinate of the first point.
 * @param y1 {number} the y coordinate of the first point.
 * @param x2 {number} the x coordinate of the second point.
 * @param y2 {number} the y coordinate of the second point.
 * @returns {number} the distance between the given points.
 */
export function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
