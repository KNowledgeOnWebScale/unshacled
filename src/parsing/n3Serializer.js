import { DataFactory, Writer as N3Writer } from "n3";
import * as jsonld from "jsonld";
import resolveRDFJSTerm from "ResolveRDFJSTerm";

const { quad } = DataFactory;

/**
 *  N3Serializer class can serialize to Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3)
 */
export default class N3Serializer {
  /**
   *
   * @param {string} json JSON-LD representation
   * @param {string} type Format to serialize to (Turtle, Trig, N-Triples, N-Quads, and Notation3 (N3))
   * @returns {Promise<any>}
   */
  static serialize(json, type) {
    return new Promise(async (resolve, reject) => {
      const writer = new N3Writer({ format: type });
      const quads = await jsonld.toRDF(json);
      for (const i in quads) {
        writer.addQuad(
          quad(
            resolveRDFJSTerm(quads[i].subject),
            resolveRDFJSTerm(quads[i].predicate),
            resolveRDFJSTerm(quads[i].object),
            resolveRDFJSTerm(quads[i].graph)
          )
        );
      }
      writer.end((error, doc) => {
        error ? reject(error) : resolve(doc);
      });
    });
  }
}
