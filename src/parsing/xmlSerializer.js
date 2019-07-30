/**
 *  XMLSerializer class can serialize to RDF/XML
 */
export default class XMLSerializer {
  /**
   * Takes a JSON-LD document and desired format type, returns the document as format.
   * @param json JSON-LD representation
   * @param type Format to serialize to e.g. "application/rdf+xml" Accepted types include: RDF/XML
   * @returns {Promise<String>} Promise which resolves to RDF/XML String
   */
  static serialize(json, type) {
    return new Promise(resolve => {
      console.log("XMLSerializer not yet implemented");
      resolve({ json, type }); // TODO: implement #serialize(json, type)
    });
  }
}
