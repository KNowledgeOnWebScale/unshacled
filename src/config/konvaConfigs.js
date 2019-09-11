/* CONSTANTS ======================================================================================================== */

export const WIDTH = 250; // Width of a rectangle.
export const HEIGHT = 40; // Width of a rectangle.
export const MARGIN = 5;
export const MARGIN_TOP = 40; // Margin to accomodate the navbar.
export const OFFSET = 10; // General offset.
export const TEXT_OFFSET = 15; // Offset for text.
export const MAX_LENGTH = 30; // Maximum length for labels.

export const TEXT_SIZE = 12; // Default text size.
const SMALL_TEXT_SIZE = TEXT_SIZE - 2; // Smaller text size.
const BUTTON_OFFSET = 240;

/* SHAPES =========================================================================================================== */

/**
 * Configuration for a shape rectangle.
 * @type {{strokeWidth: number, x: *, width: *, y: number, height: *}}
 */
export const SHAPE_CONFIG = {
  y: 0,
  height: HEIGHT,
  width: WIDTH,
  strokeWidth: 3
};

/**
 * Configuration for a node shape rectangle.
 * @type {{strokeWidth: number, x: *, width: *, y: number, fill: string, stroke: string, height: *}}
 */
export const NODE_SHAPE_CONFIG = {
  ...SHAPE_CONFIG,
  fill: "lightgreen",
  stroke: "green"
};

/**
 * Configuration for a property shape rectangle.
 * @type {{strokeWidth: number, x: *, width: *, y: number, fill: string, stroke: string, height: *}}
 */
export const PROPERTY_SHAPE_CONFIG = {
  ...SHAPE_CONFIG,
  fill: "lightblue",
  stroke: "blue"
};

/**
 * Configuration for a description rectangle.
 * @type {{strokeWidth: number, width: *, fill: string, stroke: string}}
 */
export const DESCRIPTION_RECT_CONFIG = {
  x: WIDTH + MARGIN,
  width: WIDTH + 4 * MARGIN,
  fill: "white",
  stroke: "lightgrey",
  strokeWidth: 1
};

/* CONSTRAINTS ====================================================================================================== */

/**
 * Configuration for the constraint seperation line.
 * @type {{dash: [*, *], stroke: string, points: [number, *, *, *], strokewidth: number}}
 */
export const CONSTRAINT_SEPARATION_LINE = {
  points: [0, HEIGHT, WIDTH, HEIGHT], // x y values
  stroke: "lightgrey",
  strokewidth: 1,
  dash: [OFFSET, OFFSET] // Segments with a length of 20px with a gap of 10px
};

/**
 * Configuration for the constraint rectangle.
 * @type {{strokeWidth: number, width: *, fill: string, stroke: string, height: number}}
 */
export const CONSTRAINT_CONFIG = {
  height: 2 * HEIGHT,
  width: WIDTH,
  fill: "white",
  stroke: "black",
  strokeWidth: 2
};

/* TEXT ============================================================================================================= */

/**
 * General text configuration.
 * @type {{width: *, fontSize: *, text: string, align: string}}
 */
const TEXT_CONFIG = {
  align: "center",
  text: "",
  width: WIDTH,
  fontSize: TEXT_SIZE
};

/**
 * Configuration for a shape's label text.
 * @type {{width: *, y: *, text: string, align: string, fontStyle: string}}
 */
export const LABEL_TEXT_CONFIG = {
  ...TEXT_CONFIG,
  y: OFFSET,
  fontStyle: "bold"
};

/**
 * Configuration for a shape's URI text.
 * @type {{width: *, y: number, fontSize: *, text: string, align: string, fontStyle: string}}
 */
export const URI_TEXT_CONFIG = {
  ...TEXT_CONFIG,
  y: OFFSET + TEXT_SIZE + 2,
  fontSize: SMALL_TEXT_SIZE,
  fontStyle: "italic"
};

/**
 * Configuration for a shape's constraint text.
 * @type {{width: *, fontSize: *, text: string, align: string}}
 */
export const CONSTRAINT_TEXT_CONFIG = {
  ...TEXT_CONFIG
};

/**
 * Configuration for a shape's description title.
 * @type {{width: *, x: *, y: number, fontSize: *, text: string, align: string, fontStyle: string}}
 */
export const DESCRIPTION_TITLE_CONFIG = {
  ...TEXT_CONFIG,
  x: DESCRIPTION_RECT_CONFIG.x + 2 * MARGIN,
  y: TEXT_OFFSET / 2,
  text: "Description",
  fontStyle: "bold",
  align: "left"
};

/**
 * Configuration for a shape's description text.
 * @type {{width: *, x: *, y: *, fontSize: *, text: string, align: string}}
 */
export const DESCRIPTION_TEXT_CONFIG = {
  ...TEXT_CONFIG,
  x: DESCRIPTION_TITLE_CONFIG.x,
  y: DESCRIPTION_TITLE_CONFIG.y + TEXT_OFFSET,
  align: "left"
};

/* BUTTONS ========================================================================================================== */

/**
 * Default button configuration.
 * @type {{x: *, radius: number}}
 */
const BUTTON_CONFIG = {
  x: BUTTON_OFFSET,
  radius: 6
};

/**
 * Configuration for delete buttons.
 * @type {{x: *, y: *, radius: number, fill: string}}
 */
export const DELETE_BUTTON_CONFIG = {
  ...BUTTON_CONFIG,
  y: OFFSET,
  fill: "red"
};

/**
 * Configuration for "add predicate"-buttons.
 * @type {{x: *, y: number, radius: number, fill: string}}
 */
export const ADD_PREDICATE_CONFIG = {
  ...BUTTON_CONFIG,
  y: OFFSET + HEIGHT / 2,
  fill: "green"
};

/* RELATIONSHIPS ==================================================================================================== */

/**
 * Configuration for relationship arrows.
 * @type {{strokeWidth: number, pointerWidth: number, pointerLength: number, fill: string, stroke: string}}
 */
export const RELATIONSHIP_ARROW_CONFIG = {
  stroke: "black",
  fill: "black",
  strokeWidth: 4,
  pointerLength: 10,
  pointerWidth: 10
};

/**
 * Configuration for the label text on relationship arrows.
 * @type {{fontSize: *, align: string}}
 */
export const RELATIONSHIP_LABEL_TEXT_CONFIG = {
  fontSize: TEXT_SIZE,
  align: "center"
};

/**
 * Configuration for the label on relationship arrows.
 * @type {{fill: string, height: number}}
 */
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
