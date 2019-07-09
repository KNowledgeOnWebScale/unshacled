import * as N3 from "n3";
import * as jsonld from "jsonld";

class Parser {
  constructor() {
  }

  // Removes blank nodes from doc array and returns them in a dictionary
  static removeBlankNodes(doc) {
    let blankNodes = {};
    if (Array.isArray(doc)) {
      for (let i in doc) {
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
      for (let property in blankNode) {
        // Copy properties
        object[property] = blankNode[property];
      }
    }
  }

  traverse(o, func, blankNodes) {
    for (let i in o) {
      func.apply(this, [i, o[i], blankNodes]);
      if (o[i] !== null && typeof o[i] == "object") {
        this.traverse(o[i], func, blankNodes);
      }
    }
  }

  parse() {
    console.log("PARSING NOT IMPLEMENTED IF YOU SEE THIS MESSAGE");
  }
}

export class N3Parser extends Parser {
  constructor() {
    super();
    this.parser = new N3.Parser();
    this.writer = new N3.Writer({format: "application/n-quads"});
  }

  parse(rdf, type) {
    return new Promise(resolve => {
      const quads = [];
      this.parser.parse(rdf, (error, quad) => {
        if (quad) {
          quads.push(quad);
        } else {
          this.writer.addQuads(quads);
          this.writer.end(async (error, nquads) => {
            const doc = await jsonld.fromRDF(nquads, {
              format: type
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

export class XMLParser extends Parser {
  constructor() {
    super();
  }

  // TODO: implement #parse(rdf, type)
}
