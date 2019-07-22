import ShaclDictionary from "../translation/shaclDictionary";
import SHACLTranslator from "../translation/shaclTranslator"; // "../translation/shacl-translator";
import shacl from "./shacl";

/** Dictionary with distinct Types
 {
  Ontology: 'http://www.w3.org/2002/07/owl#Ontology',
  Class: 'http://www.w3.org/2000/01/rdf-schema#Class',
  ConstraintComponent: 'http://www.w3.org/ns/shacl#ConstraintComponent',
  Parameter: 'http://www.w3.org/ns/shacl#Parameter',
  NodeKind: 'http://www.w3.org/ns/shacl#NodeKind',
  Severity: 'http://www.w3.org/ns/shacl#Severity',
  Property: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property',
  Resource: 'http://www.w3.org/2000/01/rdf-schema#Resource'
}
 */
const Types = listDistinctTypes(shacl);

/** INFORMATION BUILD UP */
const Shape = "http://www.w3.org/ns/shacl#Shape";
const NodeShape = "http://www.w3.org/ns/shacl#NodeShape";
const PropertyShape = "http://www.w3.org/ns/shacl#PropertyShape";

// Add all concepts to the dictionary
let Dictionary = {};
shacl.forEach(obj => {
  Dictionary[obj["@id"]] = [];
});

// Add predicates of shapes via rdfs:domain
const ShapeFields = findPredicatesWithSubject(shacl, Shape).map(
  obj => obj["@id"]
);
Dictionary[NodeShape].push(...ShapeFields);
const PropertyShapeFields = ShapeFields.concat(
  findPredicatesWithSubject(shacl, PropertyShape).map(obj => obj["@id"])
);
Dictionary[PropertyShape].push(...PropertyShapeFields);

// Add constraints of shapes and remove double entries
const Constraints = findObjectsWithType(shacl, Types.Parameter).map(
  obj => obj["http://www.w3.org/ns/shacl#path"][0]["@id"]
);
Dictionary[NodeShape].push(...Constraints);
Dictionary[NodeShape] = removeDoubles(Dictionary[NodeShape]);
Dictionary[PropertyShape].push(...Constraints);
Dictionary[PropertyShape] = removeDoubles(Dictionary[PropertyShape]);

// Add possible values for predicates
Dictionary[PropertyShape].forEach(predicate => {
  const range = findObjectWithId(shacl, predicate)[
    "http://www.w3.org/2000/01/rdf-schema#range"
  ];
  if (range) {
    // console.log(predicate);
    // TODO is it correct that if path is not defined it's supposed to be a Resource??
    Dictionary[predicate].push(range[0]["@id"]);
  } else {
    Dictionary[predicate].push("http://www.w3.org/2000/01/rdf-schema#Resource");
  }
});

// Translate to internal terminology
Dictionary = SHACLTranslator.toModel(Dictionary);

/** FUNCTIONS TO GATHER INFORMATION */

/**
 * Returns first object with a matching @id from document
 * @param doc Array with objects that have an @id
 * @param id URI
 * @returns {*}
 */
function findObjectWithId(doc, id) {
  return doc.filter(object => object["@id"] === id)[0];
}

/**
 * Returns array with all objects that have a certain type
 * @param doc
 * @param type
 * @returns {*}
 */
function findObjectsWithType(doc, type) {
  return doc.filter(object => object["@type"] && object["@type"][0] === type); // .map(object => object['@id']);
}

/**
 * Uses rdfs:domain to find predicates that have a specified subject
 * @param doc
 * @param subject
 * @returns {*}
 */
function findPredicatesWithSubject(doc, subject) {
  return doc.filter(obj => {
    const domain = obj["http://www.w3.org/2000/01/rdf-schema#domain"];
    return domain && domain[0]["@id"] === subject;
  });
}

/**
 * Returns object with all distinct types such as rdfs:class and shacl:ConstraintComponent
 * NOTE: The term for each type is used as key so duplicate terms WILL override eachother
 * @param doc
 */
function listDistinctTypes(doc) {
  const types = {};
  doc.forEach(object => {
    if (object["@type"]) {
      const uri = object["@type"][0];
      const term = uri.substring(uri.lastIndexOf("#") + 1, uri.length);
      types[term] = uri;
    }
  });
  return types;
}

/**
 * Removes double entries from array
 * @param array
 * @returns {string[]}
 */
function removeDoubles(array) {
  const dictionary = array.reduce((dict, entry) => {
    dict[entry] = true;
    return dict;
  }, {});
  return Object.keys(dictionary);
}

/** FUNCTIONS TO GIVE INFORMATION   */

/**
 * Checks whether uri is of a class
 * @param uri
 * @returns {boolean} true if class
 */
export function isClass(uri) {
  const character = uri.substring(
    uri.lastIndexOf("#") + 1,
    uri.lastIndexOf("#") + 2
  );
  return character === character.toUpperCase();
}

/**
 * Checks whether uri is of a predicate
 * @param uri
 * @returns {boolean} true if predicate
 */
export function isPredicate(uri) {
  return !isClass(uri);
}

/**
 * TODO
 * @param id
 * @returns {boolean}
 */
export function isInDictionary(id) {
  return Dictionary[id] !== undefined;
}

/**
 * TODO
 * @param predicate
 * @param state
 * @returns {null}
 */
export function listType(predicate, state) {
  // The (single) value of this property must be a list of path elements, representing the elements of alternative paths.
  if (predicate === ShaclDictionary.TERM.alternativePath) {
    return null; // TODO
  }
  // RDF list of shapes to validate the value nodes against.
  if (predicate === ShaclDictionary.TERM.and) {
    return null; // TODO List of all existing Shape instance id's
  }
  // An optional RDF list of properties that are also permitted in addition to those explicitly enumerated via sh:property/sh:path.
  if (predicate === ShaclDictionary.TERM.ignoredProperties) {
    return null; // TODO
  }
  // Specifies a list of allowed values so that each value node must be among the members of the given list.
  if (predicate === ShaclDictionary.TERM.in) {
    return null; // TODO
  }
  // Specifies a list of language tags that all value nodes must have.
  if (predicate === ShaclDictionary.TERM.languageIn) {
    return null; // TODO
  }
  // Specifies a list of shapes so that the value nodes must conform to at least one of the shapes.
  if (predicate === ShaclDictionary.TERM.or) {
    return null; // TODO
  }
  // Specifies a list of shapes so that the value nodes must conform to exactly one of the shapes.
  if (predicate === ShaclDictionary.TERM.xone) {
    return null; // TODO
  }
}

/**
 * Returns URI's of all possible predicates for given subject
 * @param subject
 * @returns {*}
 */
export function possiblePredicates(subject) {
  return Dictionary[subject];
}

/**
 * Returns URI's of all possible objects for given predicate
 * @param predicate
 * @returns {*}
 */
export function possibleObjects(predicate) {
  return Dictionary[predicate];
}
