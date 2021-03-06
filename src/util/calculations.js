import { MARGIN_VOWL } from "../config/konvaConfigs";
import { VOWL_SHAPE_KIND } from "./constants";

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
 * Find the intersection of the line that goes from startPoint to endPoint with the give rectangle.
 * This is done by defining the equation of the line going through the two points,
 * then defining the intersection of that line with all four lines (not line segments) of the rectangle.
 * Then, for each intersection, there's a check to see whether that intersection is part of the line segment of that side of the rectangle,
 * if that's the case, the intersection is returned.
 * If that's not the case for all four sides, this means the shapes overlap and this simply returns the midPoint.
 * @param {Object} startPoint The center point of the source shape, with an x and y component
 * @param {Object} endPoint The center point of the destination shape, with an x and y component
 * @param {Object} rectangle An object
 * @returns {Object} An intersection point, with an x and y component
 */
export function intersectionPointRectangle(startPoint, endPoint, rectangle) {
  if (startPoint.x !== endPoint.x) {
    const m = slope(startPoint, endPoint);
    const c = -m * startPoint.x + startPoint.y;

    const line = { m, c };

    const intersections = getRectangleIntersections(rectangle, line);

    if (
      between(
        intersections.top.x,
        rectangle.x,
        rectangle.x + rectangle.width
      ) &&
      endPoint.y < startPoint.y
    ) {
      return intersections.top;
    }
    if (
      between(
        intersections.bottom.x,
        rectangle.x,
        rectangle.x + rectangle.width
      ) &&
      endPoint.y > startPoint.y
    ) {
      return intersections.bottom;
    }
    if (
      between(
        intersections.left.y,
        rectangle.y,
        rectangle.y + rectangle.height
      ) &&
      endPoint.x < startPoint.x
    ) {
      return intersections.left;
    }
    if (
      between(
        intersections.right.y,
        rectangle.y,
        rectangle.y + rectangle.height
      ) &&
      endPoint.x > startPoint.x
    ) {
      return intersections.right;
    }
    return startPoint;
  } else if (startPoint.y < endPoint.y) {
    // Return bottom intersection
    return {
      x: startPoint.x,
      y: rectangle.y + rectangle.height,
      side: "B"
    };
  } else {
    // Return top intersection
    return {
      x: startPoint.x,
      y: rectangle.y,
      side: "T"
    };
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
export function getEllipseIntersections(ellipse, midPoint2, line) {
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
    y: topLeft.y,
    side: "T"
  };
  const bottomIntersection = {
    x: (bottomRight.y - c) / m,
    y: bottomRight.y,
    side: "B"
  };
  const leftIntersection = {
    x: topLeft.x,
    y: m * topLeft.x + c,
    side: "L"
  };
  const rightIntersection = {
    x: bottomRight.x,
    y: m * bottomRight.x + c,
    side: "R"
  };

  const intersections = {
    top: topIntersection,
    bottom: bottomIntersection,
    left: leftIntersection,
    right: rightIntersection
  };

  return intersections;
}

/**
 * This is used to add a "side" property to the returned intersection points when calculating relationship endpoints.
 * Since an ellipse has no definable sides, the angle between the two endpoints is used here.
 * @param {Number} midPointAngle The angle between the two midpoints of a relationship in radians
 * @returns {String} One of four possible sides: T, B, L or R
 */
export function getEllipseSection(midPointAngle) {
  const minAngle = -Math.PI; // -180 deg
  const maxAngle = Math.PI; // 180 deg

  const angle1 = (-160 * Math.PI) / 180; // -135 deg
  const angle2 = (-20 * Math.PI) / 180; // -45 deg
  const angle3 = (20 * Math.PI) / 180; // 45 deg
  const angle4 = (160 * Math.PI) / 180; // 135 deg

  const mpA = -midPointAngle; // Fix for wrong calculation of midPointAngle

  if (between(mpA, minAngle, angle1) || between(mpA, angle4, maxAngle)) {
    return "L";
  } else if (between(mpA, angle1, angle2)) {
    return "B";
  } else if (between(mpA, angle2, angle3)) {
    return "R";
  } else {
    return "T";
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
 * @param {Object} midPoint2 An object representing the second midPoint, from which the line is coming, should have the following keys: x, y
 * @returns {Object} A point on the outline of the nodeShape where it intersects with the given line
 */
export function getShapeIntersection(startShape, note, hasNote, midPoint2) {
  // Equation of line going between the 2 midpoints
  const m = slope(startShape, midPoint2);
  const c = -m * startShape.x + startShape.y;

  const line = { m, c };

  const startRDF = startShape.kind === VOWL_SHAPE_KIND.RDF_RESOURCE || startShape.kind === VOWL_SHAPE_KIND.RELATIONSHIP;

  const midPointAngle = startRDF
    ? Math.atan2(midPoint2.y - startShape.y, midPoint2.x - startShape.x)
    : Math.atan2(
        midPoint2.y - startShape.y + startShape.height / 2,
        midPoint2.x - startShape.x + startShape.width / 2
      );

  if (startShape.x === midPoint2.x) {
    // The calculation for the slope yields +-Infinity here, so we have to return a fixed position.
    const rectangleIncluded = hasNote
      ? startRDF
        ? between(startShape.x, note.x, note.x + note.width)
        : startShape.x === note.x
      : false;
    if (startShape.y > midPoint2.y) {
      if (rectangleIncluded && note.y < startShape.y) {
        // Return the intersection on top of the note
        return {
          x: note.x + note.width / 2,
          y: note.y,
          side: "T"
        };
      } else {
        // Return the intersection on top of the startShape
        return {
          x: startRDF ? startShape.x : startShape.x + startShape.width / 2,
          y: startRDF ? startShape.y - startShape.height / 2 : startShape.y,
          side: "T"
        };
      }
    } else if (rectangleIncluded && note.y > startShape.y) {
      // Return the intersection on bottom of the note
      return {
        x: note.x + note.width / 2,
        y: note.y + note.height,
        side: "B"
      };
    } else {
      // Return the intersection on bottom of the startShape
      return {
        x: startRDF ? startShape.x : startShape.x + startShape.width / 2,
        y: startRDF ? startShape.y + startShape.height / 2 : startShape.y + startShape.height,
        side: "B"
      };
    }
  } else {
    // No mathematical problems, so the intersection can be found by calculating the intersection with both shapes
    // and checking which one is closer to midPoint2

    const startPointLiteral = {
      x: startShape.x + startShape.width / 2,
      y: startShape.y + startShape.height / 2
    };

    let noteIntersection;
    if (hasNote) {
      noteIntersection = startRDF
      ? intersectionPointRectangle(
        startShape,
        midPoint2,
        note
      )
      : intersectionPointRectangle(
        startPointLiteral,
        midPoint2,
        note
      );
    } else { noteIntersection = null; }

    const startShapeIntersections = startRDF
    ? getEllipseIntersections(
      startShape,
      midPoint2,
      line
    )
    : intersectionPointRectangle(
      startPointLiteral,
      midPoint2,
      startShape
    );

    // if(!startRDF) console.log(startShapeIntersections);

    let startShapeIntersection;
    if (startRDF) {
      const startShapeIntersect =
        distance(startShapeIntersections[0], midPoint2) <
        distance(startShapeIntersections[1], midPoint2)
          ? startShapeIntersections[0]
          : startShapeIntersections[1];

      startShapeIntersection = {
        ...startShapeIntersect,
        side: getEllipseSection(midPointAngle)
      };
    } else {
      startShapeIntersection = startShapeIntersections;
    }

    const toReturn =
      hasNote && noteIntersection
        ? distance(startShapeIntersection, midPoint2) <
          distance(noteIntersection, midPoint2)
          ? startShapeIntersection
          : noteIntersection
        : startShapeIntersection;
    return toReturn;
  }
}

/**
 * Bounding function for a PropertyGroup component, this makes it so the PropertyGroup is draggable, but only around the given shape.
 * @param {Object} rectangle A rectangle, representing the PropertyGroup, contains (at least) these properties: x, y, width, height
 * @param {Object} ellipse An ellipse, representing the base shape, contains (at least) these properties: x, y, width, height (x and y here are the center point, not the topleft point)
 * @returns {Object} A new point for the PropertyGroup component to be set to
 */
export function getPropertyGroupBounds(shapeKind, propertyGroup, shape) {
  if (shapeKind === VOWL_SHAPE_KIND.RDF_RESOURCE || shapeKind === VOWL_SHAPE_KIND.RELATIONSHIP) {
    const TL = { x: propertyGroup.x, y: propertyGroup.y };
    const TR = { x: propertyGroup.x + propertyGroup.width, y: propertyGroup.y };
    const BL = { x: propertyGroup.x, y: propertyGroup.y + propertyGroup.height };
    const BR = { x: propertyGroup.x + propertyGroup.width, y: propertyGroup.y + propertyGroup.height };

    const TLangle = -Math.atan2(TL.y - shape.y, TL.x - shape.x);
    const TRangle = -Math.atan2(TR.y - shape.y, TR.x - shape.x);
    const BLangle = -Math.atan2(BL.y - shape.y, BL.x - shape.x);
    const BRangle = -Math.atan2(BR.y - shape.y, BR.x - shape.x);

    if (between(BLangle, 0, Math.PI / 2)) {
      const points = ellipseProjections(shape, BL);
      const newPoint = points[0].y < points[1].y ? points[0] : points[1];
      return {
        x: newPoint.x,
        y: newPoint.y - propertyGroup.height
      };
    } else if (between(BRangle, Math.PI / 2, Math.PI)) {
      const points = ellipseProjections(shape, BR);
      const newPoint = points[0].y < points[1].y ? points[0] : points[1];
      return {
        x: newPoint.x - propertyGroup.width,
        y: newPoint.y - propertyGroup.height
      };
    } else if (between(TRangle, -Math.PI, -Math.PI / 2)) {
      const points = ellipseProjections(shape, TR);
      const newPoint = points[0].y > points[1].y ? points[0] : points[1];
      return {
        x: newPoint.x - propertyGroup.width,
        y: newPoint.y
      };
    } else if (between(TLangle, -Math.PI / 2, 0)) {
      const points = ellipseProjections(shape, TL);
      const newPoint = points[0].y > points[1].y ? points[0] : points[1];
      return newPoint;
    } else if (
      between(BLangle, Math.PI / 2, Math.PI) &&
      between(BRangle, 0, Math.PI / 2)
    ) {
      return {
        x: propertyGroup.x,
        y: shape.y - shape.height / 2 - propertyGroup.height
      };
    } else if (
      between(TLangle, -Math.PI, -Math.PI / 2) &&
      between(BRangle, -Math.PI / 2, 0)
    ) {
      return {
        x: propertyGroup.x,
        y: shape.y + shape.height / 2
      };
    } else if (
      between(TLangle, 0, Math.PI / 2) &&
      between(BLangle, -Math.PI / 2, 0)
    ) {
      return {
        x: shape.x + shape.width / 2,
        y: propertyGroup.y
      };
    } else if (
      between(TRangle, Math.PI / 2, Math.PI) &&
      between(BRangle, -Math.PI, -Math.PI / 2)
    ) {
      return {
        x: shape.x - shape.width / 2 - propertyGroup.width,
        y: propertyGroup.y
      };
    } else {
      return getDefaultEllipsePosition(shape);
    }
  } else {
    const pgMid = {
      x: (propertyGroup.x + propertyGroup.width) / 2,
      y: (propertyGroup.y + propertyGroup.height) / 2
    };
    const shapeMid = {
      x: (shape.x + shape.width) / 2,
      y: (shape.y + shape.height) / 2
    };

    const angle = -Math.atan2(pgMid.y - shapeMid.y, pgMid.x - shapeMid.x);

    if (between(angle, Math.PI / 4, (3 * Math.PI) / 4)) {
      // TOP
      return {
        x: 0,
        y: -propertyGroup.height - MARGIN_VOWL
      };
    } else if (between(angle, (-3 * Math.PI) / 4, -Math.PI / 4)) {
      // BOTTOM
      return {
        x: 0,
        y: shape.height + MARGIN_VOWL
      };
    } else if (between(angle, -Math.PI / 4, Math.PI / 4)) {
      // RIGHT
      return {
        x: shape.width + MARGIN_VOWL,
        y: 0
      };
    } else if (
      between(angle, (3 * Math.PI) / 4, Math.PI) ||
      between(angle, -Math.PI, (-3 * Math.PI) / 4)
    ) {
      // LEFT
      return {
        x: -propertyGroup.width - MARGIN_VOWL,
        y: 0
      };
    } else {
      // RETURN DEFAULT BOTTOM POSITION
      return {
        x: 0,
        y: shape.height + MARGIN_VOWL
      };
    }
  }
}

/**
 * Defines a line starting at the centerpoint of a given ellipse, going 45 degrees down to the right,
 * then returns the intersection point of that line and the ellipse. This is used as a default position to put the ShapeVOWL notes.
 * @param {Object} ellipse The ellipse, an object containing (at least) these properties: x, y, width, height
 * @returns {Object} A default position for the PropertyGroup component, an object containing (at least) these properties: x, y
 */
export function getDefaultEllipsePosition(ellipse) {
  const points = ellipseProjections(ellipse, {
    x: ellipse.x + 1,
    y: ellipse.y + 1
  }); // Put propertyGroup at default position of -45 degrees
  const newPoint = points[0].y > points[1].y ? points[0] : points[1];
  return newPoint;
}

/**
 * Defines the line between a given point and the centerpoint of an ellipse,
 * then return both intersection points of this line and the ellipse
 * @param {Object} ellipse The ellipse, an object containing (at least) these properties: x, y, width, height
 * @param {Object} point The point, an object containing (at least) these properties: x, y
 * @returns {Object} A list with 2 points, objects containing (at least) these properties: x, y
 */
function ellipseProjections(ellipse, point) {
  const m = slope(ellipse, point);
  const c = -m * ellipse.x + ellipse.y;
  const line = { m, c };
  return getEllipseIntersections(ellipse, point, line);
}
