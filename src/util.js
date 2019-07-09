/**
 * Class with utility functions.
 */
export default class Util {
  static clone(object) {
    const newObject = {};
    for (const key of Object.keys(object)) {
      newObject[key] = object[key];
    }
    return newObject;
  }
}
