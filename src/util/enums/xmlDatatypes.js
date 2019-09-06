// List of possible XML datatypes.
const XML_DATATYPES = {
  string: "http://www.w3.org/2001/XMLSchema#string",
  boolean: "http://www.w3.org/2001/XMLSchema#boolean",
  decimal: "http://www.w3.org/2001/XMLSchema#decimal",
  float: "http://www.w3.org/2001/XMLSchema#float",
  double: "http://www.w3.org/2001/XMLSchema#double",
  integer: "http://www.w3.org/2001/XMLSchema#integer",
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

export { XML_DATATYPES as default };
