import { DataFactory, Parser as N3Parser, Writer as N3Writer } from "n3";
import * as jsonld from "jsonld";

const { namedNode, literal, blankNode, defaultGraph, quad } = DataFactory;

/**
 *  Serializer class contains utility functions for serializers
 */
class Serializer {
  static resolveRDFJSTerm(term) {
    switch (term.termType) {
      case "NamedNode":
        return namedNode(term.value);
      case "BlankNode":
        return blankNode(term.value.substring(2));
      case "Literal":
        return literal(term.value, namedNode(term.datatype.value));
      case "DefaultGraph":
        return defaultGraph();
      default:
        throw new Error(`Unknown term type: ${term.termType}`);
    }
  }
}

/**
 *  N3Serializer class can serialize to Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3)
 */
export class N3Serializer extends Serializer {
  /**
   *
   * @param json JSON-LD representation
   * @param type Format to serialize to (Turtle, Trig, N-Triples, N-Quads, and Notation3 (N3))
   * @returns {Promise<any>}
   */
  static serialize(json, type) {
    return new Promise(async (resolve, reject) => {
      const writer = new N3Writer({ format: type });
      const quads = await jsonld.toRDF(json);
      for (const i in quads) {
        writer.addQuad(
          quad(
            Serializer.resolveRDFJSTerm(quads[i].subject),
            Serializer.resolveRDFJSTerm(quads[i].predicate),
            Serializer.resolveRDFJSTerm(quads[i].object),
            Serializer.resolveRDFJSTerm(quads[i].graph)
          )
        );
      }
      writer.end((error, doc) => {
        error ? reject(error) : resolve(doc);
      });
    });
  }
}

/**
 *  TODO: XMLSerializer class can serialize to RDF/XML
 */
export class XMLSerializer {
  /**
   *
   * @param json JSON-LD representation
   * @param type Format to serialize to RDF/XML
   * @returns {Promise<any>}
   */
  static serialize(json, type) {
    return new Promise(resolve => {
      resolve({ json, type }); // TODO: implement #parse(rdf, type)
    });
  }
}
