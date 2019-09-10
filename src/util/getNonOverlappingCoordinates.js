import { values } from "ramda";
import { WIDTH } from "../config/konvaConfigs";

/**
 * @param coordinates dictionary of object keys mapped to their top left coordinates.
 * @param bottomYs dictionary of object keys mapped to their absolute bottom y coordinate.
 * @param height dictionary of object keys mapped to height.
 *
 * @returns {x: number, y: number} the coordinates for a newly added shapeID */
export default ({ coordinates, bottomYs, heights }) => {
  const MARGIN = 16;
  const stageWidth = document.getElementById("editorContainer").offsetWidth;

  // Get the top y value of the bottom row.
  const yBottomRow = Math.max(
    ...[0, ...Object.keys(coordinates).map(key => coordinates[key].y)]
  );

  // Get the shapes on the bottom row.
  const bottomRow = Object.keys(coordinates).filter(
    key => coordinates[key].y === yBottomRow
  );

  // Get the deepest y value on the bottom row.
  const deepestY = Math.max(...[0, ...bottomRow.map(key => bottomYs[key])]);
  // Get the shape that has the deepest y value on the bottom row.
  const deepest = bottomRow.filter(key => bottomYs[key] >= deepestY);

  // Get the highest x value on the bottom row.
  const rightestX = Math.max(
    ...[0, ...bottomRow.map(key => coordinates[key].x)]
  );

  // If negative, add the shapeID to the right; if positive, a bit lower to the left.
  const newLine = rightestX + 2 * (MARGIN + WIDTH) > stageWidth;

  // Calculate x coordinate
  let x = MARGIN; // Default
  if (!newLine) x += rightestX + (values(coordinates).length ? WIDTH : 0);

  // Calculate y coordinate
  let y = MARGIN; // Default
  if (deepest.length > 0) ({ y } = coordinates[deepest[0]]); // On the same row as the deepest shape.
  // Check if this shape has to be on a new line.
  if (newLine) {
    y += MARGIN; // Add a margin between rows.
    if (deepest.length > 0) y += heights[deepest[0]]; // Add the height of the deepest shape.
  }

  return { x, y };
};
