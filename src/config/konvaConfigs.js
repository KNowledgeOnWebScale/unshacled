/* CONSTANTS ======================================================================================================== */

export const WIDTH = 250;
export const HEIGHT = 40;
export const MARGIN = 5;
export const MARGIN_TOP = 40;
export const DELTA_Y_TEXT = 15;
export const DELTA_Y_DELETE = 20;
export const OFFSET = 10;
export const TEXT_OFFSET = 15;
export const MAX_LENGTH = 30;

const X = 0;
export const TEXT_SIZE = 12;
const SMALL_TEXT_SIZE = TEXT_SIZE - 2;
const BUTTON_OFFSET = 240;

/* SHAPES =========================================================================================================== */

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

export const DESCRIPTION_RECT_CONFIG = {
  x: X,
  width: WIDTH,
  fill: "white",
  stroke: "lightgrey",
  strokeWidth: 1
};

/* CONSTRAINTS ====================================================================================================== */

export const CONSTRAINT_SEPARATION_LINE = {
  points: [0, HEIGHT, WIDTH, HEIGHT], // x y values
  stroke: "lightgrey",
  strokewidth: 1,
  dash: [OFFSET, OFFSET] // Segments with a length of 20px with a gap of 10px
};

export const CONSTRAINT_CONFIG = {
  x: X,
  height: 2 * HEIGHT,
  width: WIDTH,
  fill: "white",
  stroke: "black",
  strokeWidth: 2
};

/* TEXT ============================================================================================================= */

export const LABEL_TEXT_CONFIG = {
  x: X,
  y: OFFSET,
  fontSize: TEXT_SIZE,
  fontStyle: "bold",
  align: "center",
  text: "",
  width: WIDTH
};

export const URI_TEXT_CONFIG = {
  x: X,
  y: OFFSET + TEXT_SIZE + 2,
  fontSize: SMALL_TEXT_SIZE,
  fontStyle: "italic",
  align: "center",
  text: "",
  width: WIDTH
};

export const CONSTRAINT_TEXT_CONFIG = {
  x: X,
  fontSize: TEXT_SIZE,
  align: "center",
  text: "",
  width: WIDTH
};

export const DESCRIPTION_TEXT_CONFIG = {
  x: X,
  fontSize: TEXT_SIZE,
  align: "left",
  text: "",
  width: WIDTH
};

/* BUTTONS ========================================================================================================== */

const BUTTON_CONFIG = {
  x: BUTTON_OFFSET,
  radius: 6
};

export const DELETE_BUTTON_CONFIG = {
  ...BUTTON_CONFIG,
  y: OFFSET,
  fill: "red"
};

export const ADD_PREDICATE_CONFIG = {
  ...BUTTON_CONFIG,
  y: OFFSET + HEIGHT / 2,
  fill: "green"
};

/* RELATIONSHIPS ==================================================================================================== */

export const RELATIONSHIP_ARROW_CONFIG = {
  stroke: "black",
  fill: "black",
  strokeWidth: 4,
  pointerLength: 10,
  pointerWidth: 10
};

export const RELATIONSHIP_LABEL_TEXT_CONFIG = {
  fontSize: TEXT_SIZE,
  align: "center"
};

export const RELATIONSHIP_LABEL_RECT_CONFIG = {
  fill: "white",
  height: TEXT_SIZE + MARGIN
};

/* CURSOR SETTINGS ================================================================================================== */

/**
 * Set the cursor style to pointer.
 * @constructor
 */
export function pointerCursor() {
  document.getElementById("app").style.cursor = "pointer";
}

/**
 * Set the cursor style to pointer.
 * @constructor
 */
export function moveCursor() {
  document.getElementById("app").style.cursor = "move";
}

/**
 * Set the cursor style to pointer.
 * @constructor
 */
export function textCursor() {
  document.getElementById("app").style.cursor = "text";
}

/**
 * Set the cursor style to default.
 * @constructor
 */
export function resetCursor() {
  document.getElementById("app").style.cursor = "default";
}
