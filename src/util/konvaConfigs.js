export const WIDTH = 250;
export const HEIGHT = 40;
const X = 0;
const TEXT_SIZE = HEIGHT / 2;
const DEL_BUTTON_OFFSET = 240;
const ADD_BUTTON_OFFSET = 130;

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

export const DELETE_BUTTON_CONFIG = {
  x: DEL_BUTTON_OFFSET,
  y: 10,
  radius: 6,
  fill: "red"
};

export const ADD_PRED_CONFIG = {
  x: DEL_BUTTON_OFFSET,
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

export const PROPERTY_CONFIG = {
  x: X,
  height: HEIGHT,
  width: WIDTH,
  fill: "white",
  stroke: "black",
  strokeWidth: 2
};

export const PROP_TEXT_CONFIG = {
  x: X,
  size: TEXT_SIZE,
  text: "",
  width: WIDTH,
  align: "center"
};

export const ADD_PROP_CONFIG = {
  x: ADD_BUTTON_OFFSET,
  radius: 6,
  fill: "green"
};

export const CONSTRAINT_CONFIG = {
  ...PROPERTY_CONFIG,
  height: 2 * HEIGHT
};
