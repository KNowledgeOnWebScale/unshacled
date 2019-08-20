export const CUSTOM_URI = "https://2019.summerofcode.be/unshacled#";
export const EXAMPLE_URI = "http://example.org/ns#";
export const SHACL_URI = "http://www.w3.org/ns/shacl#";
export const SCHEMA_URI = "http://schema.org/";
export const XML_CHEMA_URI = "http://www.w3.org/2001/XMLSchema#";
export const RDFS_URI = "http://www.w3.org/2000/01/rdf-schema#";
export const LABEL = `${RDFS_URI}label`;
export const RDF_URI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

// List of possible XML datatypes.
export const XML_DATATYPES = {
  string: "http://www.w3.org/2001/XMLSchema#string",
  boolean: "http://www.w3.org/2001/XMLSchema#boolean",
  decimal: "http://www.w3.org/2001/XMLSchema#decimal",
  float: "http://www.w3.org/2001/XMLSchema#float",
  double: "http://www.w3.org/2001/XMLSchema#double",
  duration: "http://www.w3.org/2001/XMLSchema#duration",
  dateTime: "http://www.w3.org/2001/XMLSchema#dateTime",
  time: "http://www.w3.org/2001/XMLSchema#time",
  date: "http://www.w3.org/2001/XMLSchema#date",
  gYearMonth: "http://www.w3.org/2001/XMLSchema#gYearMonth",
  gYear: "http://www.w3.org/2001/XMLSchema#gYear",
  gMonthDay: "http://www.w3.org/2001/XMLSchema#gMonthDay",
  gDay: "http://www.w3.org/2001/XMLSchema#gDay",
  gMonth: "http://www.w3.org/2001/XMLSchema#gMonth",
  hexBinary: "http://www.w3.org/2001/XMLSchema#hexBinary",
  base64Binary: "http://www.w3.org/2001/XMLSchema#base64Binary",
  anyURI: "http://www.w3.org/2001/XMLSchema#anyURI",
  QName: "http://www.w3.org/2001/XMLSchema#QName"
};

// Indicates which constraints should be visualized in a single entry.
export const SINGLE_ENTRY = ["property"];

// Regular expression to test URI's.
export const IRI_REGEX = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
);
export const BLANK_REGEX = new RegExp(/^_:.+/);
