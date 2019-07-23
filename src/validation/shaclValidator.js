const SHACLValidator = require("shacl-js");

/**
 *  Validator class for SHACL
 */
export default class ShaclValidator {
  /**
   * Validates SHACL data using shapes
   * @param data Data in turtle
   * @param shapes Shapes in turtle
   * @returns {Promise<Object>} Returns a promise which resolves to a SHACL report
   */
  static validate(data, shapes) {
    return new Promise((resolve, reject) => {
      new SHACLValidator().validate(
        data,
        "text/turtle",
        shapes,
        "text/turtle",
        (e, report) => {
          e ? reject(e) : resolve(report);
        }
      );
    });
  }
}
