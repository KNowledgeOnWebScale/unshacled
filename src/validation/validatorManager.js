import ShaclValidator from "./shaclValidator";
import languages from "../util/enums/languages";

/**
 *  ValidatorManager assigns validation tasks to the correct translator
 */
export default class ValidatorManager {
  /**
   * TODO support multiple formats (ttl, n3, ...)
   * @param data Data in turtle
   * @param shapes Constraint shapes in turtle
   * @param language Constraint language e.g. SHACL
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
