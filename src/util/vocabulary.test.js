import ShaclDictionary from "ShaclDictionary";
import * as Vocabulary from "./vocabulary";

test('dictionary contains predicates for subject "NodeShape"', () => {
  const expected = [
    "https://2019.summerofcode.be/unshacled#property",
    "https://2019.summerofcode.be/unshacled#rule",
    "https://2019.summerofcode.be/unshacled#severity",
    "https://2019.summerofcode.be/unshacled#sparql",
    "https://2019.summerofcode.be/unshacled#target",
    "https://2019.summerofcode.be/unshacled#targetClass",
    "https://2019.summerofcode.be/unshacled#targetNode",
    "https://2019.summerofcode.be/unshacled#targetObjectsOf",
    "https://2019.summerofcode.be/unshacled#targetSubjectsOf",
    "https://2019.summerofcode.be/unshacled#and",
    "https://2019.summerofcode.be/unshacled#class",
    "https://2019.summerofcode.be/unshacled#closed",
    "https://2019.summerofcode.be/unshacled#ignoredProperties",
    "https://2019.summerofcode.be/unshacled#datatype",
    "https://2019.summerofcode.be/unshacled#disjoint",
    "https://2019.summerofcode.be/unshacled#equals",
    "https://2019.summerofcode.be/unshacled#expression",
    "https://2019.summerofcode.be/unshacled#hasValue",
    "https://2019.summerofcode.be/unshacled#in",
    "https://2019.summerofcode.be/unshacled#js",
    "https://2019.summerofcode.be/unshacled#languageIn",
    "https://2019.summerofcode.be/unshacled#lessThan",
    "https://2019.summerofcode.be/unshacled#lessThanOrEquals",
    "https://2019.summerofcode.be/unshacled#maxCount",
    "https://2019.summerofcode.be/unshacled#maxExclusive",
    "https://2019.summerofcode.be/unshacled#maxInclusive",
    "https://2019.summerofcode.be/unshacled#maxLength",
    "https://2019.summerofcode.be/unshacled#minCount",
    "https://2019.summerofcode.be/unshacled#minExclusive",
    "https://2019.summerofcode.be/unshacled#minInclusive",
    "https://2019.summerofcode.be/unshacled#minLength",
    "https://2019.summerofcode.be/unshacled#node",
    "https://2019.summerofcode.be/unshacled#nodeKind",
    "https://2019.summerofcode.be/unshacled#not",
    "https://2019.summerofcode.be/unshacled#or",
    "https://2019.summerofcode.be/unshacled#flags",
    "https://2019.summerofcode.be/unshacled#pattern",
    "https://2019.summerofcode.be/unshacled#qualifiedMaxCount",
    "https://2019.summerofcode.be/unshacled#qualifiedValueShape",
    "https://2019.summerofcode.be/unshacled#qualifiedValueShapesDisjoint",
    "https://2019.summerofcode.be/unshacled#qualifiedMinCount",
    "https://2019.summerofcode.be/unshacled#uniqueLang",
    "https://2019.summerofcode.be/unshacled#xone"
  ];
  expect(
    JSON.stringify(
      Vocabulary.possiblePredicates(ShaclDictionary.TERM.NodeShape)
    )
  ).toStrictEqual(JSON.stringify(expected));
});

test('dictionary contains objects for predicate "property"', () => {
  const expected = ["https://2019.summerofcode.be/unshacled#PropertyShape"];
  expect(
    JSON.stringify(Vocabulary.possibleObjects(ShaclDictionary.TERM.property))
  ).toStrictEqual(JSON.stringify(expected));
});
