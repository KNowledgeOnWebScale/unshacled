import ShaclTranslator from "./shaclTranslator";
import language from "../util/enums/languages";
/**
 *  TranslatorManager assigns translation tasks to the correct translator
 */
export default class TranslatorManager {
  /**
   * Translates from a constraint language to internal used model
   * @param doc Document in JSON-LD
   * @param lang Language e.g. SHACL or ShEx
   * @returns {any}
   */
  static translateToModel(doc, lang) {
    switch (lang) {
      case language.SHACL:
        return ShaclTranslator.toModel(doc);
      case language.SHEX:
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
      case language.SHACL:
        return ShaclTranslator.toSHACL(doc);
      case language.SHEX:
        console.log("SHEX IS NOT YET SUPPORTED");
        break;
      default:
        console.log("UNSUPPORTED CONSTRAINT LANGUAGE");
    }
  }
}
