export const WIDTH = 250;
export const HEIGHT = 40;
export const MARGIN = 5;
export const DELTA_Y_TEXT = 15;
export const DELTA_Y_DELETE = 20;

const X = 0;
const TEXT_SIZE = HEIGHT / 2;
const DELETE_BUTTON_OFFSET = 240;

export const SHAPE_CONFIG = {
  x: X,
  y: 0,
  height: HEIGHT,
  width: WIDTH,
  strokeWidth: 3
};

export const NODE_SHAPE_CONFIG = {
  ...SHAPE_CONFIG,
  fill: "lightgreen",
  stroke: "green"
};

export const PROPERTY_SHAPE_CONFIG = {
  ...SHAPE_CONFIG,
  fill: "lightblue",
  stroke: "blue"
};

export const CONSTRAINT_SEPARATION_LINE = {
  points: [0, HEIGHT, WIDTH, HEIGHT], // x y values
  stroke: "lightgrey",
  strokewidth: 1,
  dash: [10, 10] // Segments with a length of 20px with a gap of 10px
};

export const DELETE_BUTTON_CONFIG = {
  x: DELETE_BUTTON_OFFSET,
  y: 10,
  radius: 6,
  fill: "red"
};

export const ADD_PREDICATE_CONFIG = {
  x: DELETE_BUTTON_OFFSET,
  y: 10 + HEIGHT / 2,
  radius: 6,
  fill: "green"
};

export const ID_TEXT_CONFIG = {
  x: X,
  y: 15,
  size: TEXT_SIZE,
  text: "",
  width: WIDTH,
  align: "center",
  fontStyle: "bold"
};

export const CONSTRAINT_CONFIG = {
  x: X,
  height: 2 * HEIGHT,
  width: WIDTH,
  fill: "white",
  stroke: "black",
  strokeWidth: 2
};

export const CONSTRAINT_TEXT_CONFIG = {
  x: X,
  size: TEXT_SIZE,
  text: "",
  width: WIDTH,
  align: "center"
};

export const RELATIONSHIP_ARROW_CONFIG = {
  stroke: "black",
  fill: "black",
  strokeWidth: 4,
  pointerLength: 10,
  pointerWidth: 10
};

export const RELATIONSHIP_LABEL_TEXT_CONFIG = {
  size: TEXT_SIZE,
  align: "center"
};

export const RELATIONSHIP_LABEL_RECT_CONFIG = {
  fill: "white",
  height: TEXT_SIZE + MARGIN
};
