import N3Parser from "./n3Parser";
import XMLParser from "./xmlParser";
/**
 *  ParserManager retrieves the correct parser for the format of RDF (Turtle, RDF/XML, ...)
 */
export default class ParserManager {
  /**
   * Takes a RDF document and its format type, returns the document as JSON-LD.
   * @param doc RDF document
   * @param type Format type e.g. text/turtle
   * @returns {Promise<Object>} Promise which resolves to JSON-LD Object
   */
  static parse(doc, type) {
    switch (type.toLowerCase()) {
      case "text/n3":
      case "text/turtle":
      case "application/ld+json":
      case "application/nquads":
      case "application/n-quads":
        return N3Parser.parse(doc, type);
      case "application/rdf+xml":
        return XMLParser.parse(doc, type);
      default:
        console.log(`UNSUPPORTED FORMAT ${type}`);
    }
  }
}
