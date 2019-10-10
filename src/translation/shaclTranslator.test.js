import examples from "Examples";
import ShaclTranslator from "./shaclTranslator";

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
    const model = await ShaclTranslator.toModel(naiveCopy(examples.shacl[i]));
    expect(JSON.stringify(model)).toBe(JSON.stringify(examples.model[i]));
  }
});

test("translate model to SHACL", async () => {
  for (let i = 0; i < examples.shacl.length; ++i) {
    const shacl = await ShaclTranslator.toSHACL(naiveCopy(examples.model[i]));
    expect(JSON.stringify(shacl)).toBe(JSON.stringify(examples.shacl[i]));
  }
});

test("translate dictionary to model", async () => {
  const modelDictionary = {
    "https://2019.summerofcode.be/unshacled#NodeShape": [
      "https://2019.summerofcode.be/unshacled#property",
      "https://2019.summerofcode.be/unshacled#rule",
      "https://2019.summerofcode.be/unshacled#severity",
      "https://2019.summerofcode.be/unshacled#sparql",
    ]
  };
  const shaclDictionary = {
    "https://www.w3.org/ns/shacl#NodeShape": [
      "https://www.w3.org/ns/shacl#property",
      "https://www.w3.org/ns/shacl#rule",
      "https://www.w3.org/ns/shacl#severity",
      "https://www.w3.org/ns/shacl#sparql",
    ]
  };
  const translated = await ShaclTranslator.toModel(naiveCopy(shaclDictionary));
  expect(JSON.stringify(translated)).toBe(JSON.stringify(modelDictionary));
});
