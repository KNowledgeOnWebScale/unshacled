import { N3Serializer, XMLSerializer } from "./serializers";
/**
 *  SerializerManager retrieves the correct serializer for the format of RDF (Turtle, RDF/XML, ...)
 */
export class SerializerManager {
  /**
   * TODO
   * @param doc
   * @param type
   * @returns {*}
   */
  static serialize(doc, type) {
    switch (type) {
      // TODO: Add RDF/XML and other formats
      case "text/n3":
      case "text/turtle":
      case "application/nquads":
      case "application/n-quads":
        return N3Serializer.serialize(doc, type);
      case "application/ld+json":
        return doc;
      default:
        console.log("UNSUPPORTED FORMAT");
    }
  }
}
