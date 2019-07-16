const X = 0;
export const WIDTH = 250;
export const HEIGHT = 40;
const TEXT_SIZE = HEIGHT / 2;
const BUTTON_OFFSET = 240;

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

export const DELETE_NODE_CONFIG = {
  x: BUTTON_OFFSET,
  y: 10,
  radius: 6,
  fill: "red"
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

export const DELETE_PROP_CONFIG = {
  x: BUTTON_OFFSET,
  radius: 6,
  fill: "red"
};
