/* CONSTANTS ======================================================================================================== */

export const WIDTH = 250; // Width of a rectangle.
export const HEIGHT = 40; // Height of a rectangle.
export const HEADER_MARGIN = 10;
export const HEIGHT_HEADER = HEIGHT + HEADER_MARGIN; // Height of the top part of a shape, containing title, kind of shape...
export const MARGIN = 5;
export const MARGIN_TOP = 40; // Margin to accomodate the navbar.
export const OFFSET = 10; // General offset.
export const TEXT_OFFSET = 15; // Offset for text.
export const MAX_LENGTH = 30; // Maximum length for labels.

export const RELATIONSHIP_LABEL_OFFSET = 10; // How far a label should be offset from the relationship arrow
const RELATIONSHIP_DASH = 10;
export const RELATIONSHIP_DASH_ARRAY = [RELATIONSHIP_DASH, RELATIONSHIP_DASH]; // The dash array for a relationship, to be used for e.g. compliesWith
export const LOGICAL_RELATIONSHIP_APPENDAGE = 50;

export const LABEL_TOP_LEFT = 1; // For placement of relationship cardinality labels
export const LABEL_TOP_RIGHT = 2; // For placement of relationship cardinality labels
export const LABEL_BOTTOM_RIGHT = 3; // For placement of relationship cardinality labels
export const LABEL_BOTTOM_LEFT = 4; // For placement of relationship cardinality labels

export const LABEL_NO_SHIFT = 0; // For placement of relationship labels
export const LABEL_SHIFT_UP = 1; // For placement of relationship labels
export const LABEL_SHIFT_DOWN = 2; // For placement of relationship labels

export const UML_ARROWHEAD_WIDTH = 12; // The default width of a UML arrowhead, without scaling
export const UML_ARROWHEAD_HEIGHT = 20; // The default height of a UML arrowhead, without scaling
export const UML_ARROWHEAD_CENTER_X = UML_ARROWHEAD_WIDTH / 2; // The default centerpoint of a UML arrowhead, without scaling
export const UML_ARROWHEAD_CENTER_Y = UML_ARROWHEAD_HEIGHT / 2; // The default centerpoint of a UML arrowhead, without scaling
export const UML_ARROWHEAD_SHIFT = 8; // The amount of pixels the UML arrowhead has to be shifted among the line to not be covered by the "to" shape.
export const UML_ARROWHEAD_ROTATE = 90; // The amount the UML arrowhead has to be rotated for it to point towards the "to" shape.
export const HALF_CIRCLE = 180; // This is just so prettifier doesnt't complain at the conversion of radians to degrees.

export const TEXT_SIZE = 12; // Default text size.
const CONSTRAINT_TEXT_SIZE = TEXT_SIZE; // Smaller text size.
const BUTTON_OFFSET = 240;

/* SHAPES =========================================================================================================== */

/**
 * Configuration for a shape rectangle.
 * @type {{strokeWidth: number, width: number, y: number, height: number}}
 */
export const SHAPE_CONFIG = {
  y: 0,
  height: HEIGHT,
  width: WIDTH,
  strokeWidth: 2
};

/**
 * Configuration for a node shape rectangle.
 * @type {{strokeWidth: number, width: number, y: number, fill: string, stroke: string, height: number}}
 */
export const NODE_SHAPE_CONFIG = {
  ...SHAPE_CONFIG,
  height: HEIGHT_HEADER,
  fill: "white",
  stroke: "black"
};

/**
 * Configuration for a property shape rectangle.
 * @type {{strokeWidth: number, x: number, width: number, y: number, fill: string, stroke: string, height: number}}
 */
export const PROPERTY_SHAPE_CONFIG = {
  ...SHAPE_CONFIG,
  height: HEIGHT_HEADER,
  fill: "white",
  stroke: "black"
};

/**
 * Configuration for a description rectangle.
 * @type {{strokeWidth: number, width: number, fill: string, stroke: string}}
 */
export const DESCRIPTION_RECT_CONFIG = {
  x: WIDTH + MARGIN,
  width: WIDTH + 4 * MARGIN,
  fill: "white",
  stroke: "lightgrey",
  strokeWidth: 1
};

/**
 * Configuration for the rectangles around the information properties
 * as well as the constraints.
 * @type {{fill: string, stroke: string}}
 */
export const PROPERTY_RECT_CONFIG = {
  ...SHAPE_CONFIG,
  fill: "white",
  stroke: "black"
};

/* CONSTRAINTS ====================================================================================================== */

/**
 * Configuration for the constraint seperation line.
 * @type {{dash: [number, number], stroke: string, points: [number, number, number, number], strokewidth: number}}
 */
export const CONSTRAINT_SEPARATION_LINE = {
  points: [0, HEIGHT, WIDTH, HEIGHT], // x y values
  stroke: "lightgrey",
  strokewidth: 1,
  dash: [OFFSET, OFFSET] // Segments with a length of 20px with a gap of 10px
};

/**
 * Configuration for the constraint rectangle.
 * @type {{width: number, fill: string, height: number}}
 */
export const CONSTRAINT_CONFIG = {
  height: HEIGHT,
  width: WIDTH,
  fill: "white"
};

/* TEXT ============================================================================================================= */

/**
 * General text configuration.
 * @type {{width: number, fontSize: number, text: string, align: string}}
 */
const TEXT_CONFIG = {
  align: "center",
  text: "",
  width: WIDTH,
  fontSize: TEXT_SIZE
};

/**
 * Configuration for a shape's label text.
 * @type {{width: number, y: number, text: string, align: string, fontStyle: string}}
 */
export const LABEL_TEXT_CONFIG = {
  ...TEXT_CONFIG,
  y: OFFSET
};

/**
 * Configuration for a shape's URI text.
 * @type {{width: number, y: number, fontSize: number, text: string, align: string, fontStyle: string}}
 */
export const URI_TEXT_CONFIG = {
  ...TEXT_CONFIG,
  y: OFFSET + TEXT_SIZE + MARGIN,
  fontSize: TEXT_SIZE,
  fontStyle: "bold"
};

/**
 * Configuration for a shape's constraint text.
 * @type {{width: number, fontSize: number, text: string, align: string}}
 */
export const CONSTRAINT_TEXT_CONFIG = {
  ...TEXT_CONFIG,
  align: "left",
  width: WIDTH / 2,
  fontSize: CONSTRAINT_TEXT_SIZE
};

/**
 * Configuration for a shape's description title.
 * @type {{width: number, x: number, y: number, fontSize: number, text: string, align: string, fontStyle: string}}
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
 * @type {{width: number, x: number, y: number, fontSize: number, text: string, align: string}}
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
 * @type {{x: number, radius: number}}
 */
const BUTTON_CONFIG = {
  x: BUTTON_OFFSET,
  radius: 6
};

/**
 * Configuration for delete buttons.
 * @type {{x: number, y: number, radius: number, fill: string}}
 */
export const DELETE_BUTTON_CONFIG = {
  ...BUTTON_CONFIG,
  y: OFFSET,
  fill: "red"
};

/**
 * Configuration for "add predicate"-buttons.
 * @type {{x: number, y: number, radius: number, fill: string}}
 */
export const ADD_PREDICATE_CONFIG = {
  ...BUTTON_CONFIG,
  y: OFFSET + HEIGHT / 2,
  fill: "green"
};

/* RELATIONSHIPS ==================================================================================================== */

/**
 * Configuration for relationship lines.
 * @type {{strokeWidth: number, fill: string, stroke: string}}
 */
export const RELATIONSHIP_LINE_CONFIG = {
  stroke: "black",
  fill: "black",
  strokeWidth: 4
};

/**
 * Configuration for relationship arrows.
 * @type {{pointerWidth: number, pointerLength: number}}
 */
export const RELATIONSHIP_ARROW_CONFIG = {
  ...RELATIONSHIP_LINE_CONFIG,
  pointerLength: 10,
  pointerWidth: 10
};

/**
 * Configuration for the label text on relationship arrows.
 * @type {{fontSize: number, align: string}}
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
