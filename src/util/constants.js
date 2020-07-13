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
]

/* All properties that get visualised in the second 'info' box of a ShapeUML shape */
export const INFO_PROPERTIES = [
  "@id",
  TERM.path,
  ...APPLIES_ON,
  TERM.severity
];

/* Properties that are ignored when visualizing. */
export const IGNORED_PROPERTIES = [
  ...INFO_PROPERTIES,
  "@type",
  LABEL,
  TERM.name,
  TERM.description
];

/* These properties have to be included in the properties of a shape, but can't be shown as text, only as a relationship */
export const RELATIONSHIP_PROPERTIES = [
  TERM.and,
  TERM.or,
  TERM.xone,
  TERM.property
]
