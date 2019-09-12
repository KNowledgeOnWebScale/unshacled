import shacl from "./shacl";
import { TERM } from "../../translation/terminology";
import SHACLTranslator from "../../translation/shaclTranslator";

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

/** Gathering information from SHACL.js */
const Shape = "http://www.w3.org/ns/shacl#Shape";
const NodeShape = "http://www.w3.org/ns/shacl#NodeShape";
const PropertyShape = "http://www.w3.org/ns/shacl#PropertyShape";

/* Add all concepts to the dictionary. */
let Dictionary = {};
shacl.forEach(obj => {
  Dictionary[obj["@id"]] = [];
});

/* Add predicates of shapes via rdfs:domain. */
const ShapeFields = findPredicatesWithSubject(shacl, Shape).map(
  obj => obj["@id"]
);
Dictionary[NodeShape].push(...ShapeFields);
const PropertyShapeFields = ShapeFields.concat(
  findPredicatesWithSubject(shacl, PropertyShape).map(obj => obj["@id"])
);
Dictionary[PropertyShape].push(...PropertyShapeFields);

/* Add constraints of shapes and remove double entries */
const Constraints = findObjectsWithType(shacl, Types.Parameter).map(
  obj => obj["http://www.w3.org/ns/shacl#path"][0]["@id"]
);

// FIXME Not every constraint is applicable to a NodeShape or a PropertyShape
Dictionary[NodeShape].push(...Constraints);
Dictionary[NodeShape] = removeDuplicates(Dictionary[NodeShape]);
Dictionary[PropertyShape].push(...Constraints);
Dictionary[PropertyShape] = removeDuplicates(Dictionary[PropertyShape]);

/* Add possible values for predicates. */
Dictionary[PropertyShape].forEach(predicate => {
  const range = findObjectWithId(shacl, predicate)[
    "http://www.w3.org/2000/01/rdf-schema#range"
  ];
  Dictionary[predicate].push(
    range ? range[0]["@id"] : "http://www.w3.org/2000/01/rdf-schema#Resource"
  );
});

/* Translate to internal terminology. */
Dictionary = SHACLTranslator.toModel(Dictionary);

/* FUNCTIONS TO GATHER INFORMATION FROM SHACL.JS ==================================================================== */

/**
 * Returns first object with a matching `@id` from document.
 * @param {[object]} doc array with objects that have an `@id`.
 * @param {string} id the given URI we want to match.
 * @returns {any} the first object that matches.
 */
function findObjectWithId(doc, id) {
  return doc.filter(object => object["@id"] === id)[0];
}

/**
 * Returns array with all objects that have a certain type.
 * @param {[object]} doc array with objects.
 * @param {string} type the type we want to match.
 * @returns {[object]} all objects that have the given type.
 */
function findObjectsWithType(doc, type) {
  return doc.filter(object => object["@type"] && object["@type"][0] === type);
}

/**
 * Uses rdfs:domain to find predicates that have a specified subject.
 * @param {[object]} doc array with objects.
 * @param {string} subject the subject we want to match.
 * @returns {[object]} all objects that match the given subject.
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
 * @param {[object]} doc array with objects.
 * @returns {object} an object with the distinct types.
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
 * Removes duplicate entries from array of strings.
 * @param {[string]} array an array of strings.
 * @returns {[string]} the input array with duplicates removed.
 */
function removeDuplicates(array) {
  const dictionary = array.reduce((dict, entry) => {
    dict[entry] = true;
    return dict;
  }, {});
  return Object.keys(dictionary);
}

/* EXPORTED FUNCTIONS TO USE ======================================================================================== */

/**
 * Checks whether URI is of a class.
 * @param {string} uri the URI we want to check.
 * @returns {boolean} true if class.
 */
export function isClass(uri) {
  const character = uri.substring(
    uri.lastIndexOf("#") + 1,
    uri.lastIndexOf("#") + 2
  );
  return character === character.toUpperCase();
}

/**
 * Checks whether the URI is of a predicate.
 * @param {string} uri the URI we want to check.
 * @returns {boolean} true if predicate
 */
export function isPredicate(uri) {
  return !isClass(uri);
}

/**
 * Check whether the URI is known in the dictionary.
 * @param {string} uri the URI we want to check.
 * @returns {boolean} true if the URI is found in the dictionary.
 */
export function isInDictionary(uri) {
  return Dictionary[uri] !== undefined;
}

/**
 * Returns array of possible entries for a list with the given predicate.
 * @param {string} predicate the predicate we want to check.
 * @returns {[Object]} an array with possible values for the list.
 */
export function listValues(predicate) {
  // The (single) value of this property must be a list of path elements, representing the elements of alternative paths.
  if (predicate === TERM.alternativePath) {
    return null; // TODO
  }
  // RDF list of shapes to validate the value nodes against.
  if (predicate === TERM.and) {
    return null; // TODO List of all existing Shape instance id's
  }
  // An optional RDF list of properties that are also permitted in addition to those explicitly enumerated via sh:property/sh:path.
  if (predicate === TERM.ignoredProperties) {
    return null; // TODO
  }
  // Specifies a list of allowed values so that each value node must be among the members of the given list.
  if (predicate === TERM.in) {
    return null; // TODO
  }
  // Specifies a list of language tags that all value nodes must have.
  if (predicate === TERM.languageIn) {
    return null; // TODO
  }
  // Specifies a list of shapes so that the value nodes must conform to at least one of the shapes.
  if (predicate === TERM.or) {
    return null; // TODO
  }
  // Specifies a list of shapes so that the value nodes must conform to exactly one of the shapes.
  if (predicate === TERM.xone) {
    return null; // TODO
  }
}

/**
 * Returns URI's of all possible predicates for given subject.
 * @param {string} subject the subject we want to get the predicates of.
 * @returns {[string]} array of URIs of all the predicates for the given subject.
 */
export function possiblePredicates(subject) {
  return Dictionary[subject];
}

/**
 * Returns URI's of all possible objects for given predicate.
 * @param {string} predicate the predicate we want to get the objects of.
 * @returns {[string]} array of URIs of all the objects for the given predicate.
 */
export function possibleObjects(predicate) {
  return Dictionary[predicate];
}
