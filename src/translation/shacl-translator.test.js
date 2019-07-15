import examples from "Examples";
import { SHACLTranslator } from "./shacl-translator";

/**
 * naiveCopy copies an object by serializing and parsing it, not efficient but good enough for unit tests
 * @param object
 * @returns {object} copy of object
 */
function naiveCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

test("translate SHACL to model", async () => {
  for (let i = 0; i < examples.shacl.length; ++i) {
    const model = await SHACLTranslator.toModel(naiveCopy(examples.shacl[i]));
    expect(JSON.stringify(model)).toBe(JSON.stringify(examples.model[i]));
  }
});

test("translate model to SHACL", async () => {
  for (let i = 0; i < examples.shacl.length; ++i) {
    const shacl = await SHACLTranslator.toSHACL(naiveCopy(examples.model[i]));
    expect(JSON.stringify(shacl)).toBe(JSON.stringify(examples.shacl[i]));
  }
});
