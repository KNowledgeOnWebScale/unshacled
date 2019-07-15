const X = 0;
const WIDTH = 250;

export const SHAPE_CONFIG = {
  x: X,
  y: 0,
  height: 40,
  width: WIDTH,
  fill: "lightgreen",
  stroke: "green",
  strokeWidth: 3
};

export const DELETE_NODE_CONFIG = {
  x: 240,
  y: 10,
  radius: 6,
  fill: "red"
};

export const ID_TEXT_CONFIG = {
  x: X,
  y: 15,
  size: 20,
  text: "",
  // text: this.$props.id,
  width: WIDTH,
  align: "center",
  fontStyle: "bold"
};

export const PROPERTY_CONFIG = {
  x: X,
  height: 40,
  width: WIDTH,
  fill: "white",
  stroke: "black",
  strokeWidth: 2
};

export const PROP_TEXT_CONFIG = {
  x: X,
  size: 20,
  text: "",
  // text: this.$props.propKey,
  width: WIDTH,
  align: "center"
};

export const DELETE_PROP_CONFIG = {
  x: 240,
  radius: 6,
  fill: "red"
};
