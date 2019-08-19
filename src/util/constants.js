export const CUSTOM_URI = "https://2019.summerofcode.be/unshacled#";
export const EXAMPLE_URI = "http://example.org/ns#";
export const SHACL_URI = "http://www.w3.org/ns/shacl#";
export const SCHEMA_URL = "http://schema.org/";

// List of possible XML datatypes.
export const XML_DATATYPES = [
  "http://www.w3.org/2001/XMLSchema#string",
  "http://www.w3.org/2001/XMLSchema#boolean",
  "http://www.w3.org/2001/XMLSchema#decimal",
  "http://www.w3.org/2001/XMLSchema#float",
  "http://www.w3.org/2001/XMLSchema#double",
  "http://www.w3.org/2001/XMLSchema#duration",
  "http://www.w3.org/2001/XMLSchema#dateTime",
  "http://www.w3.org/2001/XMLSchema#time",
  "http://www.w3.org/2001/XMLSchema#date",
  "http://www.w3.org/2001/XMLSchema#gYearMonth",
  "http://www.w3.org/2001/XMLSchema#gYear",
  "http://www.w3.org/2001/XMLSchema#gMonthDay",
  "http://www.w3.org/2001/XMLSchema#gDay",
  "http://www.w3.org/2001/XMLSchema#gMonth",
  "http://www.w3.org/2001/XMLSchema#hexBinary",
  "http://www.w3.org/2001/XMLSchema#base64Binary",
  "http://www.w3.org/2001/XMLSchema#anyURI",
  "http://www.w3.org/2001/XMLSchema#QName"
];

// Indicates which constraints should be visualized in a single entry.
export const SINGLE_ENTRY = ["property"];

// Regular expression to test URI's.
export const iriRegex = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
);
