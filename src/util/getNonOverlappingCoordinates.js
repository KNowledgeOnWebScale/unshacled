import { values } from "ramda";
import { HEIGHT, WIDTH } from "./konvaConfigs";

/** @returns {x: number, y: number} the coordinates for a newly added shapeID */
export default ({ coordinates, bottomYs, bottoms }) => {
  // TODO use bottoms for this
  const MARGIN = 16;
  const { innerWidth } = window;

  // Maximum vertical position of the existing shapes.
  const yMax = Math.max(...[0, ...Object.values(bottomYs)]);

  // Get the lowest shapes.
  const lowest = Object.keys(bottomYs).filter(key => bottomYs[key] >= yMax);

  // Determine which shape is the most to the right.
  let xMax = 0;
  let refY = 0;
  let refKey;
  lowest.map(key => {
    if (coordinates[key].x >= xMax) {
      xMax = coordinates[key].x;
      refY = coordinates[key].y;
      refKey = key;
    }
  });

  // If negative, add the shapeID to the right; if positive, a bit lower to the left.
  const criterion = xMax + 2 * (MARGIN + WIDTH) > innerWidth;
  const x =
    MARGIN + (criterion ? 0 : xMax + (values(coordinates).length ? WIDTH : 0));
  const y =
    refY + (criterion ? MARGIN + (refKey ? bottoms[refKey] : 0) : 0) || MARGIN;

  return { x, y };
};
