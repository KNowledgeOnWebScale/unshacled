import { N3Serializer, XMLSerializer } from "./serializers";
import { ETF } from "../util/enums/extensionToFormat.js";
/**
 *  SerializerManager retrieves the correct serializer for the format of RDF (Turtle, RDF/XML, ...)
 */
export class SerializerManager {
  static serialize(doc, type) {
    switch (type) {
      // TODO: Add RDF/XML and other formats
      case "text/n3":
      case ETF.ttl:
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
