const X = 0;
const WIDTH = 250;

const shapeConfig = {
  x: X,
  y: 0,
  height: 40,
  width: WIDTH,
  fill: "lightgreen",
  stroke: "green",
  strokeWidth: 3
};

const deleteNodeConfig = {
  x: 240,
  y: 10,
  radius: 6,
  fill: "red"
};

const idTextConfig = {
  x: X,
  y: 15,
  size: 20,
  text: "",
  // text: this.$props.id,
  width: WIDTH,
  align: "center",
  fontStyle: "bold"
};

const propertyConfig = {
  x: X,
  height: 40,
  width: WIDTH,
  fill: "white",
  stroke: "black",
  strokeWidth: 2
};

const propTextConfig = {
  x: X,
  size: 20,
  text: "",
  // text: this.$props.propKey,
  width: WIDTH,
  align: "center"
};

const deletePropConfig = {
  x: 240,
  radius: 6,
  fill: "red"
};