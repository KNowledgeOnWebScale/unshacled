import ShaclValidator from "./shaclValidator";

/**
 *  ValidatorManager assigns validation tasks to the correct translator
 */
export default class ValidatorManager {
  /**
   * TODO support multiple formats (ttl, n3, ...)
   * @param data Data as ttl file
   * @param shapes Constraint shapes as ttl file
   * @param language Constraint language e.g. SHACL
   * @returns {any}
   */
  static validate(data, shapes, language) {
    switch (language) {
      case "SHACL":
      case "shacl":
        return ShaclValidator.validate(data, shapes);
      case "ShEx":
      case "shex":
        console.log("SHEX IS NOT YET SUPPORTED");
        break;
      default:
        console.log("UNSUPPORTED CONSTRAINT LANGUAGE");
    }
  }
}
