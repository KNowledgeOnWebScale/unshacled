/**
 * List of possible XML datatypes.
 */
const XML_DATATYPES = {
  string: "https://www.w3.org/2001/XMLSchema#string",
  boolean: "https://www.w3.org/2001/XMLSchema#boolean",
  decimal: "https://www.w3.org/2001/XMLSchema#decimal",
  float: "https://www.w3.org/2001/XMLSchema#float",
  double: "https://www.w3.org/2001/XMLSchema#double",
  integer: "https://www.w3.org/2001/XMLSchema#integer",
  duration: "https://www.w3.org/2001/XMLSchema#duration",
  dateTime: "https://www.w3.org/2001/XMLSchema#dateTime",
  time: "https://www.w3.org/2001/XMLSchema#time",
  date: "https://www.w3.org/2001/XMLSchema#date",
  gYearMonth: "https://www.w3.org/2001/XMLSchema#gYearMonth",
  gYear: "https://www.w3.org/2001/XMLSchema#gYear",
  gMonthDay: "https://www.w3.org/2001/XMLSchema#gMonthDay",
  gDay: "https://www.w3.org/2001/XMLSchema#gDay",
  gMonth: "https://www.w3.org/2001/XMLSchema#gMonth",
  hexBinary: "https://www.w3.org/2001/XMLSchema#hexBinary",
  base64Binary: "https://www.w3.org/2001/XMLSchema#base64Binary",
  anyURI: "https://www.w3.org/2001/XMLSchema#anyURI",
  QName: "https://www.w3.org/2001/XMLSchema#QName"
};

export { XML_DATATYPES as default };
