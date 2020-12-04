import { TERM } from "../translation/terminology";

export const ENTER = 13; // Enter key code.
export const MAX_NUM_OPERATIONS = 100; // Maximum number of operations a user can undo.

export const DEFAULT_BASE_URI = "http://example.org/ns/unshacled/";
export const IDENTIFIER = "shapes";
/* Used for the `path` predicate. */
export const SCHEMA_URI = "http://schema.org/";
export const LABEL = "http://www.w3.org/2000/01/rdf-schema#label";
/** Used to change SHACL specific predicates to the internal model. */
export const SHACL_URI = "http://www.w3.org/ns/shacl#";

/* Indicates which constraints should be visualized in a single entry. */
export const SINGLE_ENTRY = ["property"];

export const NOTE_CORNER_VOWL = {
  TOP_RIGHT: 1,
  BOTTOM_RIGHT: 2,
  BOTTOM_LEFT: 3,
  TOP_LEFT: 4
};

/* Regular expression to test URI's. */
// FIXME check the validity
export const IRI_REGEX = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /(^(([A-Za-z]{2,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?$)/
);
export const BLANK_REGEX = new RegExp(/^_:.+/);

/* All properties that get visualised in ShapeUML as a variation of appliesOn() */
export const APPLIES_ON = [
  TERM.targetNode,
  TERM.targetClass,
  TERM.targetSubjectsOf,
  TERM.targetObjectsOf
];

/* All properties that get visualised in the second 'info' box of a ShapeUML shape */
export const INFO_PROPERTIES = [
  "@id",
  TERM.path,
  ...APPLIES_ON,
  TERM.severity,
  TERM.message
];

/* Properties that are ignored when visualizing. */
export const IGNORED_PROPERTIES = [
  ...INFO_PROPERTIES,
  "@type",
  LABEL,
  TERM.name,
  TERM.description
];

/* If a shape has any of these properties, it should have an icon in ShapeVOWL representation */
export const VOWL_SHAPE_ICONS = [TERM.datatype, TERM.class];

/* All these properties should be on the same note in the vowl representation. */
export const VOWL_SAME_NOTE = [
  TERM.nodeKind,
  TERM.pattern,
  TERM.languageIn,
  TERM.uniqueLang,
  TERM.closed,
  TERM.ignoredProperties,
  TERM.hasValue,
  TERM.in,
  TERM.deactivated
];

/* All these constraints together should be visualised as the singular "range()" constraint in ShapeVOWL */
export const VOWL_RANGE_CONSTRAINTS = [
  TERM.minInclusive,
  TERM.minExclusive,
  TERM.maxInclusive,
  TERM.maxExclusive
];

/* All these constraints together should be visualised as the singular "length()" constraint in ShapeVOWL */
export const VOWL_LENGTH_CONSTRAINTS = [TERM.minLength, TERM.maxLength];

/* These properties get their own separate note, but more than one of these properties might be needed to create the note. */
export const VOWL_CONCATTED_NOTE = [
  ...VOWL_RANGE_CONSTRAINTS,
  ...VOWL_LENGTH_CONSTRAINTS
];

/* These properties get their own separate note, often with a symbol to accompany them */
export const VOWL_SEPARATE_NOTE = [
  TERM.equals,
  TERM.disjoint,
  TERM.lessThan,
  TERM.lessThanOrEquals
];

/* The realtionships that have to be visualised as "compliesWith" according to the ShapeUML spec */
export const COMPLIES_WITH = [TERM.node, TERM.qualifiedValueShape];

/* All on-to-many logical relationships, these have to have a different visualisation  */
export const LOGICAL_RELATIONSHIPS = [TERM.and, TERM.or, TERM.xone];

/* These properties have to be included in the properties of a shape, but can't be shown as text, only as a relationship */
export const RELATIONSHIP_PROPERTIES = [
  ...COMPLIES_WITH,
  ...LOGICAL_RELATIONSHIPS,
  TERM.property
];

/* These properties have to be visualised in a different way. They change up the path for a PropertyShape */
export const PATH_PROPERTIES = [
  TERM.path,
  TERM.alternativePath,
  TERM.inversePath,
  TERM.zeroOrMorePath,
  TERM.zeroOrOnePath,
  TERM.oneOrMorePath
];

export const VOWL_BORDER_COLOR = {
  [TERM.Violation]: "#e06666",
  [TERM.Warning]: "#ffd966",
  [TERM.Info]: "#93c47d"
};

export const VOWL_SHAPE_KIND = {
  RDF_RESOURCE: 1,
  LITERAL: 2
};

export const VOWL_LITERAL_CONSTRAINTS = [
  TERM.datatype,
  TERM.minExclusive,
  TERM.maxExclusive,
  TERM.minInclusive,
  TERM.maxInclusive,
  TERM.languageIn,
  TERM.uniqueLang,
  TERM.lessThan,
  TERM.lessThanOrEquals
];
