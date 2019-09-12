/**
 * Helper function to traverse over an object and apply a function.
 * @param {object} o object to be traversed.
 * @param {function} func function that is applied recursively to every property of the object.
 * @param {object} args arguments passed on to the function.
 *        NOTE: first two arguments are always the index and property.
 */
export default function traverse(o, func, ...args) {
  for (const i in o) {
    // eslint-disable-next-line babel/no-invalid-this
    func.apply(this, [i, o[i], ...args]);
    if (o[i] !== null && typeof o[i] === "object") {
      traverse(o[i], func, ...args);
    }
  }
}
