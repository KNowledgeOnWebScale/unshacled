/**
 *  XMLParser class can parse RDF/XML to JSON-LD
 */
export default class XMLParser {
  /**
   * Takes a RDF document and its format type, returns the document as JSON-LD.
   * @param doc RDF document
   * @param type Format type e.g. "application/rdf+xml" Accepted types include: RDF/XML
   * @returns {Promise<Object>} Promise which resolves to JSON-LD Object
   */
  static parse(doc, type) {
    return new Promise(resolve => {
      resolve({ doc, type }); // TODO: implement #parse(doc, type)
    });
  }
}
