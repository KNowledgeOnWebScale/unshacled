import { CENTER_SHAPE_VOWL_X, CENTER_SHAPE_VOWL_Y, HEIGHT_VOWL, WIDTH_VOWL } from "../config/konvaConfigs";
import { NOTE_CORNER_VOWL } from "./constants";

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
  const m = slope(midPoint, destinationPoint);
  const c = -m * midPoint.x + midPoint.y;

  const rect = {
    ...topLeft,
    width: Math.abs(bottomRight.x - topLeft.x),
    height: Math.abs(bottomRight.y - topLeft.y)
  };

  const line = { m, c };

  const intersections = getRectangleIntersections(rect, line);

  if (
    intersections.top.x >= topLeft.x &&
    intersections.top.x <= bottomRight.x &&
    destinationPoint.y < midPoint.y
  ) {
    return {
      ...intersections.top,
      side: "T"
    };
  }
  if (
    intersections.bottom.x >= topLeft.x &&
    intersections.bottom.x <= bottomRight.x &&
    destinationPoint.y > midPoint.y
  ) {
    return {
      ...intersections.bottom,
      side: "B"
    };
  }
  if (
    intersections.left.y >= topLeft.y &&
    intersections.left.y <= bottomRight.y &&
    destinationPoint.x < midPoint.x
  ) {
    return {
      ...intersections.left,
      side: "L"
    };
  }
  if (
    intersections.right.y >= topLeft.y &&
    intersections.right.y <= bottomRight.y &&
    destinationPoint.x > midPoint.x
  ) {
    return {
      ...intersections.right,
      side: "R"
    };
  }
  return midPoint;
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
export function distance(point1, point2) {
  const x1 = point1.x;
  const y1 = point1.y;
  const x2 = point2.x;
  const y2 = point2.y;
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

/**
 * Returns all intersections of an ellipse and a given line.
 * This always returns a list of 2 intersections
 * @param {Object} ellipse An object representing an ellipse, should have the following keys: x, y, height, width
 * @param {Object} line An object representing a line, should have the following keys: m (the slope), c (the translation term of a linear equation)
 * @returns {Object} A list containing a point object for each of the 2 intersections
 */
export function getEllipseIntersections(ellipse, line) {
  const h = ellipse.x;
  const k = ellipse.y;
  const a = ellipse.width / 2;
  const b = ellipse.height / 2;
  const { m, c } = line;
  const phi = c - k;

  // The next three declarations are parts of the formula for getting the intersection between an ellipse and a line
  const xUpperLeft = Math.pow(b, 2) * h - Math.pow(a, 2) * m * phi;
  const xUpperRight =
    a *
    b *
    Math.sqrt(
      Math.pow(b, 2) +
        Math.pow(a, 2) * Math.pow(m, 2) -
        2 * m * phi * h -
        Math.pow(phi, 2) -
        Math.pow(m, 2) * Math.pow(h, 2)
    );
  const xLower = Math.pow(b, 2) + Math.pow(a, 2) * Math.pow(m, 2);

  const x1 = (xUpperLeft + xUpperRight) / xLower;
  const x2 = (xUpperLeft - xUpperRight) / xLower;

  const y1 = m * x1 + c;
  const y2 = m * x2 + c;

  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 }
  ];
}

/**
 * Returns all intersections of the lines defined by a rectangle and another given line.
 * (This always returns 4 intersections, of which only 2 will actually lie inside the rectangle)
 * @param {Object} rectangle An object representing a rectangle, should have the following keys: x, y, height, width
 * @param {Object} line An object representing a line, should have the following keys: m (the slope), c (the translation term of a linear equation)
 * @returns {Object} An object containing a point object for each of the 4 intersections
 */
export function getRectangleIntersections(rectangle, line) {
  const { m, c } = line;
  const { x, y, width, height } = rectangle;
  const topLeft = { x, y };
  const bottomRight = {
    x: x + width,
    y: y + height
  };

  const topIntersection = {
    x: (topLeft.y - c) / m,
    y: topLeft.y
  };
  const bottomIntersection = {
    x: (bottomRight.y - c) / m,
    y: bottomRight.y
  };
  const leftIntersection = {
    x: topLeft.x,
    y: m * topLeft.x + c
  };
  const rightIntersection = {
    x: bottomRight.x,
    y: m * bottomRight.x + c
  };

  const intersections = {
    top: topIntersection,
    bottom: bottomIntersection,
    left: leftIntersection,
    right: rightIntersection
  };

  return intersections;
}

export function getEllipseSection(midPointAngle){
  const minAngle = -Math.PI; // -180 deg
  const maxAngle = Math.PI; // 180 deg

  const angle1 = Math.atan2(-1, -1); // -135 deg
  const angle2 = Math.atan2(-1, 1); // -45 deg
  const angle3 = Math.atan2(1, 1); // 45 deg
  const angle4 = Math.atan2(1, -1); // 135 deg

  if(between(midPointAngle, minAngle, angle1) || between(midPointAngle, angle4, maxAngle)){
    return "L";
  } else if (between(midPointAngle, angle1, angle2)){
    return "B"
  } else if (between(midPointAngle, angle2, angle3)){
    return "R"
  } else {
    return "T"
  }
}

/**
 * A function to check whether a given value x is between a certain upper and lower boundary
 * @param {Number} x
 * @param {Number} lower
 * @param {Number} upper
 * @returns {Boolean}
 */
export function between(x, lower, upper) {
  return x >= lower && x <= upper;
}

/**
 * This function provides the intersection of a line and a nodeShape in the VOWL visual notation
 * This is used to determine the endpoints for a relationship arrow between two shapes.
 * @param {Object} ellipse An object representing the ellipse of a nodeShape, should have the following keys: x, y, height, width
 * @param {Object} note An object representing the (optional) note of a nodeShape, should have the following keys: x, y, height, width
 * @param {Booelan} hasNote A boolean indicating whether or not a note is present on the nodeShape
 * @param {Number} corner A value indicating on which corner of a shape the note is placed (the use of NOTE_CORNER_VOWL values is recommended here)
 * @param {Object} midPoint2 An object representing the second midPoint, from which the line is coming, should have the following keys: x, y
 * @returns {Object} A point on the outline of the nodeShape where it intersects with the given line
 */
export function getNodeShapeIntersection(
  ellipse,
  note,
  hasNote,
  corner,
  midPoint2
) {
  // Equation of line going between the 2 midpoints
  const m = slope(ellipse, midPoint2);
  const c = -m * ellipse.x + ellipse.y;

  if (m === undefined || (m && (m === Infinity || m === -Infinity))){
    if (midPoint2.y < ellipse.y){
      return {
        x: ellipse.x,
        y: ellipse.y - CENTER_SHAPE_VOWL_Y
      };
    } else {
      return {
        x: ellipse.x,
        y: ellipse.y + CENTER_SHAPE_VOWL_Y
      };
    }
  }

  const line = { m, c };

  const midPointAngle = Math.atan2(
    midPoint2.y - ellipse.y,
    midPoint2.x - ellipse.x
  );

  let noteIntersect;

  const noteIntersections = getRectangleIntersections(note, line);
  switch (corner) {
    case NOTE_CORNER_VOWL.TOP_RIGHT: {
      // Check top intersection and right intersection
      if (between(noteIntersections.top.x, note.x, note.x + note.width)) {
        noteIntersect = noteIntersections.top;
      } else if (between(noteIntersections.right.y, note.y, note.y + note.height)) {
        noteIntersect = noteIntersections.right;
      }
      break;
    }
    case NOTE_CORNER_VOWL.BOTTOM_RIGHT: {
      // Check top intersection and right intersection
      if (between(noteIntersections.bottom.x, note.x, note.x + note.width)) {
        noteIntersect = noteIntersections.bottom;
      } else if (between(noteIntersections.right.y, note.y, note.y + note.height)) {
        noteIntersect = noteIntersections.right;
      }
      break;
    }
    case NOTE_CORNER_VOWL.BOTTOM_LEFT: {
      // Check top intersection and right intersection
      if (between(noteIntersections.bottom.x, note.x, note.x + note.width)) {
        noteIntersect = noteIntersections.bottom;
      } else if (between(noteIntersections.left.y, note.y, note.y + note.height)) {
        noteIntersect = noteIntersections.left;
      }
      break;
    }
    case NOTE_CORNER_VOWL.TOP_LEFT: {
      // Check top intersection and right intersection
      if (between(noteIntersections.top.x, note.x, note.x + note.width)) {
        noteIntersect = noteIntersections.top;
      } else if (between(noteIntersections.left.y, note.y, note.y + note.height)) {
        noteIntersect = noteIntersections.left;
      }
      break;
    }
  }

  const ellipseIntersections = getEllipseIntersections(ellipse, line);

  // (x1, y1) and (y1, y2) are now the 2 intersections of the line and the ellipse
  // however, we are dealing with a line segment, not a line, so we now have to decide which of these to return

  // this checks whether the first intersection's y value (when normalised)
  // has the same sign as the angle between the midpoints
  // if that's the case, the first intersection is returned, otherwise, the second is returned

  const ellipseIntersect =
    distance(ellipseIntersections[0], midPoint2) < distance(ellipseIntersections[1], midPoint2)
    ? ellipseIntersections[0]
    : ellipseIntersections[1];

  const ellipseIntersection = {
    ...ellipseIntersect,
    side: getEllipseSection(midPointAngle)
  };

  const toReturn =
    hasNote && noteIntersect
      ? distance(ellipseIntersection, midPoint2) <
        distance(noteIntersect, midPoint2)
        ? ellipseIntersection
        : noteIntersect
      : ellipseIntersection;
  return toReturn;
}

export function getPropertyGroupBounds(rectangle, ellipse) {
  const TL = { x: rectangle.x, y: rectangle.y };
  const TR = { x: rectangle.x + rectangle.width, y: rectangle.y };
  const BL = { x: rectangle.x, y: rectangle.y + rectangle.height };
  const BR = { x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height };

  const TLangle = -Math.atan2(
    TL.y - ellipse.y,
    TL.x - ellipse.x
  );
  const TRangle = -Math.atan2(
    TR.y - ellipse.y,
    TR.x - ellipse.x
  );
  const BLangle = -Math.atan2(
    BL.y - ellipse.y,
    BL.x - ellipse.x
  );
  const BRangle = -Math.atan2(
    BR.y - ellipse.y,
    BR.x - ellipse.x
  );

  if (between(BLangle, 0, Math.PI/2)) {
    const points = ellipseProjections(ellipse, BL);
    const newPoint = points[0].y < points[1].y ? points[0] : points[1];
    return {
      x: newPoint.x,
      y: newPoint.y - rectangle.height
    }
  } else if (between(BRangle, Math.PI/2, Math.PI)) {
    const points = ellipseProjections(ellipse, BR);
    const newPoint = points[0].y < points[1].y ? points[0] : points[1];
    return {
      x: newPoint.x - rectangle.width,
      y: newPoint.y - rectangle.height
    }
  } else if (between(TRangle, -Math.PI, -Math.PI/2)) {
    const points = ellipseProjections(ellipse, TR);
    const newPoint = points[0].y > points[1].y ? points[0] : points[1];
    return {
      x: newPoint.x - rectangle.width,
      y: newPoint.y
    }
  } else if (between(TLangle, -Math.PI/2, 0)) {
    const points = ellipseProjections(ellipse, TL);
    const newPoint = points[0].y > points[1].y ? points[0] : points[1];
    return newPoint
  } else if (between(BLangle, Math.PI/2, Math.PI) && between(BRangle, 0, Math.PI/2)) {
    return {
      x: rectangle.x,
      y: ellipse.y - ellipse.height/2 - rectangle.height
    }
  } else if (between(TLangle, -Math.PI, -Math.PI/2) && between(BRangle, -Math.PI/2, 0)) {
    return {
      x: rectangle.x,
      y: ellipse.y + ellipse.height/2
    }
  } else if (between(TLangle, 0, Math.PI/2) && between(BLangle, -Math.PI/2, 0)) {
    return {
      x: ellipse.x + ellipse.width/2,
      y: rectangle.y
    }
  } else if (between(TRangle, Math.PI/2, Math.PI) && between(BRangle, -Math.PI, -Math.PI/2)) {
    return {
      x: ellipse.x - ellipse.width/2 - rectangle.width,
      y: rectangle.y
    }
  } else {
    return getDefaultEllipsePosition(ellipse);
  }
}

export function getDefaultEllipsePosition(ellipse) {
  const points = ellipseProjections(ellipse, {
    x: ellipse.x + 1,
    y: ellipse.y + 1
  });
  const newPoint = points[0].y > points[1].y ? points[0] : points[1];
  return newPoint
}

function ellipseProjections(ellipse, point) {
  const m = slope(ellipse, point);
  const c = -m * ellipse.x + ellipse.y;
  const line = { m, c };
  return getEllipseIntersections(ellipse, line);
}