import traverse from "../util/traverse";
import dictionary from "./shaclDictionary";
/**
 *  ShaclTranslator class translates SHACL JSON-LD to an internal model and back
 */
export default class ShaclTranslator {
  /**
   * Replaces all SHACL URI's with model URI's
   * @param shacl SHACL in JSON-LD
   * @returns {any} Translated document
   */
  static toModel(shacl) {
    return ShaclTranslator.translate(shacl, dictionary.MODEL);
  }

  /**
   * Replaces all model URI's with SHACL URI's
   * @param model Model in JSON-LD
   * @returns {any} Translated document
   */
  static toSHACL(model) {
    return ShaclTranslator.translate(model, dictionary.SHACL);
  }

  /**
   * Translates by replacing URI's found in dictionary
   * @param document Document in JSON-LD
   * @param dict Dictionary which contains URI's to be translated
   * @returns {any} Translated document
   */
  static translate(document, dict) {
    for (const property in document) {
      if (Object.prototype.hasOwnProperty.call(document, property)) {
        const translation = dict[property];
        if (translation) {
          document[translation] = document[property];
          delete document[property];
        }
      }
    }
    traverse(document, (index, object) => {
      // Translate strings in an array
      if (Array.isArray(object)) {
        for (let i = 0; i < object.length; ++i) {
          const translation = dict[object[i]];
          if (translation) object[i] = translation;
        }
        return;
      }
      for (const property in object) {
        if (Object.prototype.hasOwnProperty.call(object, property)) {
          // Translate property value (only if it isn't an array)
          let translation = Array.isArray(object[property])
            ? null
            : dict[object[property]];
          if (translation) {
            object[property] = translation;
          }
          // Translate property name
          translation = dict[property];
          if (translation) {
            object[translation] = object[property];
            delete object[property];
          }
        }
      }
    });
    return document;
  }
}
