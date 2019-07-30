import { values } from "ramda";
import { HEIGHT, WIDTH } from "./konvaConfigs";

/** @returns {x: number, y: number} the coordinates for a newly added shape */
export default ({ coordinates }) => {
  const MARGIN = 16;
  const { innerWidth } = window;

  // { [unique id]: {x: number, y: number }, ...} => [{x: number, y: number}, ...]
  const coords = values(coordinates);

  // Maximum vertical position of the existing shapes.
  const yMax = Math.max(...[0, ...coords.map(({ y }) => y)]);

  // Corresponding hozitontal position.
  const xMax = Math.max(
    ...[0, ...coords.filter(({ y }) => y >= yMax).map(({ x }) => x)]
  );

  // If negative, add the shape to the right; if positive, a bit lower to the left.
  const criterion = xMax + 2 * (MARGIN + WIDTH) > innerWidth;
  const x = MARGIN + (criterion ? 0 : xMax + (coords.length ? WIDTH : 0));
  const y = yMax + (criterion ? MARGIN + HEIGHT : 0) || MARGIN;

  return { x, y };
};
