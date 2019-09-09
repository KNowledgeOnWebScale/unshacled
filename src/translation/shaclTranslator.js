import traverse from "../util/traverse";
import dictionary from "./shaclDictionary";
import { SHACL_URI } from "../util/constants";
import { CUSTOM_URI } from "./terminology";
import clone from "ramda/src/clone";
/**
 *  ShaclTranslator class translates SHACL JSON-LD to an internal model and back
 */
export default class ShaclTranslator {
  /**
   * Replaces all SHACL URI's with model URI's.
   * @param shacl SHACL in JSON-LD
   * @returns {any} Translated document
   */
  static toModel(shacl) {
    return ShaclTranslator.translate(shacl, dictionary.MODEL);
  }

  /**
   * Replaces all SHACL URI's with model URI's.
   * @param shacl SHACL in JSON-LD
   * @returns {any|string} Translated document
   */
  static toModelSimple(shacl) {
    return JSON.parse(
      JSON.stringify(shacl).replace(new RegExp(SHACL_URI, "g"), CUSTOM_URI)
    );
  }

  /**
   * Replaces all model URI's with SHACL URI's.
   * @param model Model in JSON-LD
   * @returns {any|string} Translated document
   */
  static toSHACL(model) {
    return ShaclTranslator.translate(model, dictionary.SHACL);
  }

  /**
   * Replaces all model URI's with SHACL URI's.
   * @param model Model in JSON-LD
   * @returns {any|string} Translated document
   */
  static toSHACLSimple(model) {
    return JSON.parse(
      JSON.stringify(model).replace(new RegExp(CUSTOM_URI, "g"), SHACL_URI)
    );
  }

  /**
   * Translates by replacing URI's found in dictionary.
   * @param document Document in JSON-LD
   * @param dict Dictionary which contains URI's to be translated
   * @returns {any|string} Translated document
   */
  static translate(document, dict) {
    const output = {};
    for (const property of Object.keys(document)) {
      const translation = dict[property];
      output[translation || property] = clone(document[property]);
    }

    traverse(output, (index, object) => {
      // Translate strings in an array
      if (Array.isArray(object)) {
        for (let i = 0; i < object.length; ++i) {
          const translation = dict[object[i]];
          if (translation) object[i] = translation;
        }
        return;
      }
      for (const property of Object.keys(object)) {
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
    });
    return output;
  }
}
