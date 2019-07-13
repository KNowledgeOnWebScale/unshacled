/**
 *
 * @param o
 * @param func
 */
export default function traverse(o, func) {
  for (const i in o) {
    func.apply(this, [i, o[i]]);
    if (o[i] !== null && typeof o[i] === "object") {
      traverse(o[i], func);
    }
  }
}
