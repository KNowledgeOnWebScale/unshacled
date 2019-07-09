import * as Parsers from "./parsers.js";

export class ParserManager {
  constructor() {
    this.N3Parser = new Parsers.N3Parser();
    this.XMLParser = new Parsers.XMLParser();
  }

  parse(doc, type) {
    switch (type) {
      // TODO: Add RDF/XML and other formats
      case "text/n3":
      case "text/turtle":
      case "application/ld+json":
      case "application/nquads":
      case "application/n-quads":
        return this.N3Parser.parse(doc, type);
      default:
        console.log("UNSUPPORTED FORMAT");
    }
  }
}
