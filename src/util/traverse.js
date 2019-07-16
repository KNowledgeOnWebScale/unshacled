/**
 * TODO
 * @param o
 * @param func
 * @param args Arguments passed on to the function NOTE: after index and object
 */
export default function traverse(o, func, ...args) {
  for (const i in o) {
    func.apply(this, [i, o[i], ...args]);
    if (o[i] !== null && typeof o[i] === "object") {
      traverse(o[i], func, ...args);
    }
  }
}
