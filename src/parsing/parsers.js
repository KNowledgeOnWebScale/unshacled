import * as N3 from "n3";
import jsonld from "jsonld";

/**
 *  Parser class contains utility functions for parsers
 */
class Parser {
  // Removes blank nodes from doc array and returns them in a dictionary
  static removeBlankNodes(doc) {
    const blankNodes = {};
    if (Array.isArray(doc)) {
      for (const i in doc) {
        const e = doc[i];
        if (Parser.isBlankNode(e)) {
          blankNodes[e["@id"]] = e;
          doc.splice(i, 1);
        }
      }
    }
    return blankNodes;
  }

  static isBlankNode(node) {
    return node["@id"] && node["@id"].match(/_:b[0-9]*/);
  }

  static fillBlankNode(index, object, blankNodes) {
    if (Parser.isBlankNode(object)) {
      if (!blankNodes[object["@id"]]) {
        return; // Could not find blank node with same id blankNodes
      }
      const blankNode = blankNodes[object["@id"]];
      delete blankNodes[object["@id"]];
      for (const property in blankNode) {
        // Copy properties
        object[property] = blankNode[property];
      }
    }
  }

  static traverse(o, func, blankNodes) {
    for (const i in o) {
      func.apply(this, [i, o[i], blankNodes]);
      if (o[i] !== null && typeof o[i] === "object") {
        Parser.traverse(o[i], func, blankNodes);
      }
    }
  }
}

/**
 *  N3Parser can parse Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3) to json-ld
 */
export class N3Parser {
  /**
   *
   * @param rdf RDF string
   * @param type Format of RDF string (Turtle, RDF/XML, ...)
   * @returns {Promise<any>}
   */
  static parse(rdf, type) {
    return new Promise(resolve => {
      const quads = [];
      new N3.Parser({ format: type }).parse(rdf, (error, quad) => {
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

/**
 *  XMLParser class can parse RDF/XML to json-ld
 */
export class XMLParser extends Parser {
  /**
   *
   * @param rdf RDF string
   * @param type Format of RDF string (Turtle, RDF/XML, ...)
   * @returns {Promise<any>}
   */
  static parse(rdf, type) {
    return new Promise(resolve => {
      resolve({ rdf, type }); // TODO: implement #parse(rdf, type)
    });
  }
}
