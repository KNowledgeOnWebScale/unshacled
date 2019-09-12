import N3Serializer from "./n3Serializer";
import XMLSerializer from "./xmlSerializer";

/**
 *  SerializerManager retrieves the correct serializer for the format of RDF (Turtle, RDF/XML, ...)
 */
export default class SerializerManager {
  /**
   * Takes a JSON-LD document and a desired format type, returns the document in given format type.
   * @param {string} doc RDF document in JSON-LD
   * @param {string} type Format type e.g. "text/turtle"
   * @returns {Promise<Object>} Promise which resolves to RDF in given format type
   */
  static serialize(doc, type) {
    switch (type) {
      case "text/n3":
      case "text/turtle":
      case "application/nquads":
      case "application/n-quads":
      case "application/ld+json":
        return N3Serializer.serialize(doc, type);
      case "application/rdf+xml":
        return XMLSerializer.serialize(doc, type);
      default:
        console.log(`UNSUPPORTED FORMAT ${type}`);
    }
  }
}
