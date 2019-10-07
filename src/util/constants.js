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
export const IRI_REGEX = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
);
export const BLANK_REGEX = new RegExp(/^_:.+/);

/* Properties that are ignored when visualizing. */
export const IGNORED_PROPERTIES = [
  "@id",
  "@type",
  LABEL,
  TERM.name,
  TERM.description
];
