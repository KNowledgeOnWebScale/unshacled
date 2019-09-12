import ShaclValidator from "./shaclValidator";
import languages from "../util/enums/languages";

/**
 * The ValidatorManager assigns validation tasks to the correct validator.
 */
export default class ValidatorManager {
  /**
   * TODO support multiple formats (ttl, n3, ...)
   * @param data {object} data in Turtle.
   * @param shapes {object} constraint shapes in Turtle.
   * @param language {string} constraint language, e.g. SHACL.
   * @returns {Promise<any>}
   */
  static validate(data, shapes, language) {
    switch (language) {
      case languages.SHACL:
        return ShaclValidator.validate(data, shapes);
      case languages.SHEX:
        console.log("SHEX IS NOT YET SUPPORTED");
        break;
      default:
        console.log(`UNSUPPORTED CONSTRAINT LANGUAGE ${language}`);
    }
  }
}
