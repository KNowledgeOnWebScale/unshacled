import ShaclTranslator from "./shaclTranslator";

/**
 *  TranslatorManager assigns translation tasks to the correct translator
 */
export class TranslatorManager {
  /**
   * Translates from a constraint language to internal used model
   * @param doc Document in JSON-LD
   * @param lang Language e.g. SHACL or ShEx
   * @returns {any}
   */
  static translateToModel(doc, lang) {
    switch (lang) {
      case "SHACL":
      case "shacl":
        return ShaclTranslator.toModel(doc);
      case "ShEx":
      case "shex":
        console.log("SHEX IS NOT YET SUPPORTED");
        break;
      default:
        console.log("UNSUPPORTED CONSTRAINT LANGUAGE");
    }
  }

  /**
   * Translates from internal used model to a constraint language
   * @param doc Model in JSON-LD
   * @param lang Language e.g. SHACL or ShEx
   * @returns {any}
   */
  static translateToLanguage(doc, lang) {
    switch (lang) {
      case "SHACL":
      case "shacl":
        return ShaclTranslator.toSHACL(doc);
      case "ShEx":
      case "shex":
        console.log("SHEX IS NOT YET SUPPORTED");
        break;
      default:
        console.log("UNSUPPORTED CONSTRAINT LANGUAGE");
    }
  }
}
