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
    switch (type.toLowerCase()) {
      // TODO: Add RDF/XML and other formats
      case "n3":
      case "ttl":
      case "json":
      case "rdf":
      case "nt":
      case "nquads":
        return N3Parser.parse(doc, type);
      default:
        console.log(`UNSUPPORTED FORMAT${type}`);
    }
  }
}
