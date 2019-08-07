import { values } from "ramda";
import { WIDTH } from "./konvaConfigs";

/** @returns {x: number, y: number} the coordinates for a newly added shapeID */
export default ({ coordinates, bottomYs, bottoms }) => {
  // TODO use bottoms for this
  const MARGIN = 16;
  const { innerWidth } = window;

  // Get the y value of the bottom row.
  const yBottomRow = Math.max(
    ...[0, ...Object.keys(coordinates).map(key => coordinates[key].y)]
  );

  // Get the shapes on the bottom row.
  const bottomRow = Object.keys(coordinates).filter(
    key => coordinates[key].y === yBottomRow
  );

  // Get the deepest y value on the bottom row.
  const deepestY = Math.max(...bottomRow.map(key => bottomYs[key]));
  // Get the shape that has the deepest y value on the bottom row.
  const deepest = bottomRow.filter(key => bottomYs[key] >= deepestY);

  // Get the highest x value on the bottom row.
  const rightestX = Math.max(
    ...[0, ...bottomRow.map(key => coordinates[key].x)]
  );

  // If negative, add the shapeID to the right; if positive, a bit lower to the left.
  const newLine = rightestX + 2 * (MARGIN + WIDTH) > innerWidth;

  // Calculate x coordinate
  let x = MARGIN;
  if (!newLine) x += rightestX + (values(coordinates).length ? WIDTH : 0);

  // Calculate y coordinate
  let y = 0;
  if (deepest.length > 0) y += coordinates[deepest[0]].y; // On the same row as the deepest shape.
  if (newLine) {
    y += MARGIN;
    if (deepest.length > 0) y += deepestY;
  }
  if (y === 0) y = MARGIN;

  return { x, y };
};
