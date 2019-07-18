const SHACLValidator = require("shacl-js");

/**
 *  TODO
 */
export default class ShaclValidator {
  /**
   * TODO introduce support for different formats
   * @param data
   * @param shapes
   * @returns {Promise<any>}
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
