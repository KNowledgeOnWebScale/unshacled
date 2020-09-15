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

/**
 * Returns the slope of the line between point1 and point2.
 * @param {object} point1 The definition of a point, with an x and y component
 * @param {object} point2 The definition of a point, with an x and y component
 */
function slope(point1, point2) {
  return (point2.y - point1.y) / (point2.x - point1.x);
}

/**
 * Find the intersection of the line that goes from midPoint to destinationPoint
 * with the rectangle defined by the topLeft and bottomRight parameters.
 * This is done by defining the equation of the line going through the two points,
 * then defining the intersection of that line with all four lines (not line segments) of the rectangle.
 * Then, for each intersection, there's a check to see whether that intersection is part of the line segment of that side of the rectangle,
 * if that's the case, the intersection is returned.
 * If that's not the case for all four sides, this means the shapes overlap and this simply returns the midPoint.
 * @param {object} midPoint The center point of the source shape, with an x and y component
 * @param {object} destinationPoint The center point of the destination shape, with an x and y component
 * @param {object} topLeft The top left point of the source shape, with an x and y component
 * @param {object} bottomRight The bottom right point of the source shape, with an x and y component
 */
export function intersectionPoint(
  midPoint,
  destinationPoint,
  topLeft,
  bottomRight
) {
  const a = slope(midPoint, destinationPoint);
  const b = -a * midPoint.x + midPoint.y;

  const topIntersection = {
    x: (topLeft.y - b) / a,
    y: topLeft.y,
    side: "T"
  };
  const bottomIntersection = {
    x: (bottomRight.y - b) / a,
    y: bottomRight.y,
    side: "B"
  };
  const leftIntersection = {
    x: topLeft.x,
    y: a * topLeft.x + b,
    side: "L"
  };
  const rightIntersection = {
    x: bottomRight.x,
    y: a * bottomRight.x + b,
    side: "R"
  };

  if (
    topIntersection.x >= topLeft.x &&
    topIntersection.x <= bottomRight.x &&
    destinationPoint.y < midPoint.y
  ) {
    return topIntersection;
  } else if (
    bottomIntersection.x >= topLeft.x &&
    bottomIntersection.x <= bottomRight.x &&
    destinationPoint.y > midPoint.y
  ) {
    return bottomIntersection;
  } else if (
    leftIntersection.y >= topLeft.y &&
    leftIntersection.y <= bottomRight.y &&
    destinationPoint.x < midPoint.x
  ) {
    return leftIntersection;
  } else if (
    rightIntersection.y >= topLeft.y &&
    rightIntersection.y <= bottomRight.y &&
    destinationPoint.x > midPoint.x
  ) {
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

/**
 * Used to find the x coordinate corresponding to a certain y coordinate on an ellipse (used for the button placement)
 * @param {number} y
 * @param {number} height The height of the ellipse
 * @param {number} width The width of the ellipse
 * @param {number} centerX The center point of the ellipse
 * @param {number} centerY The center point of the ellipse
 */
export function projectYOnEllipse(y, height, width, centerX, centerY) {
  return (
    Math.sqrt(
      (1 - Math.pow(y - centerY, 2) / Math.pow(height / 2, 2)) *
        Math.pow(width / 2, 2)
    ) + centerX
  );
}
