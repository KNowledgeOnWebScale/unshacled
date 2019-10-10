import { DataFactory } from "n3";

const { namedNode, literal, blankNode, defaultGraph } = DataFactory;

/**
 * Resolves RDF JS Term
 * @param {object} term
 * @returns {any}
 */
export default function resolveRDFJSTerm(term) {
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
