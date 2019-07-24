import * as N3 from "n3";
import jsonld from "jsonld";

/**
 *  N3Parser can parse Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3) to JSON-LD
 */
export default class N3Parser {
  /**
   * Takes a RDF document and its format type, returns the document as JSON-LD.
   * @param doc RDF document
   * @param type Format type e.g. "text/turtle" Accepted types include: Turtle, TriG, N-Triples, N-Quads, and Notation3
   * @returns {Promise<Object>} Promise which resolves to JSON-LD Object
   */
  static parse(doc, type) {
    return new Promise(resolve => {
      const quads = [];
      new N3.Parser({ format: type }).parse(doc, (error, quad) => {
        if (quad) {
          quads.push(quad);
        } else {
          const writer = new N3.Writer({ format: "application/n-quads" });
          writer.addQuads(quads);
          writer.end(async (error, nquads) => {
            const doc = await jsonld.fromRDF(nquads, {
              format: "application/n-quads"
            });
            // console.log(JSON.stringify(doc));
            // const blankNodes = super.removeBlankNodes(doc);
            // super.traverse(doc, super.fillBlankNode, blankNodes);
            // console.log(JSON.stringify(doc));
            resolve(doc);
          });
        }
      });
    });
  }
}
