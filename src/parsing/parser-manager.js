import { N3Parser, XMLParser } from "./parsers";

/**
 *  ParserManager retrieves the correct parser for the format of RDF (Turtle, RDF/XML, ...)
 */
export class ParserManager {
  /**
   * @param doc
   * @param type
   * @returns {Promise<any>}
   */
  static parse(doc, type) {
    switch (type) {
      // TODO: Add RDF/XML and other formats
      case "text/n3":
      case "text/turtle":
      case "application/ld+json":
      case "application/nquads":
      case "application/n-quads":
        return N3Parser.parse(doc, type);
      default:
        console.log("UNSUPPORTED FORMAT");
    }
  }
}
