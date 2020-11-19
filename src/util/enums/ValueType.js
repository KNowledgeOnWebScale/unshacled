import { TERM } from "../../translation/terminology";
import { LABEL } from "../constants";

/**
 * The different types of values.
 * @type {{ID: string, VALUE: string, ID_LIST: string, LIST: string, VALUE_LIST: string}}
 */
export const ValueTypes = {
  ID: "id",
  VALUE: "type",
  LIST: "List",
  ID_LIST: "idList",
  VALUE_LIST: "valueList"
};

const ids = new Set([
  TERM.id,
  TERM.class,
  TERM.property,
  TERM.targetNode,
  TERM.datatype,
  TERM.nodeKind,
  TERM.targetObjectsOf,
  TERM.equals,
  TERM.disjoint,
  TERM.hasValue,
  TERM.lessThan,
  TERM.lessThanOrEquals,
  TERM.not,
  TERM.node,
  TERM.path,
  TERM.qualifiedMaxCount,
  TERM.qualifiedMinCount,
  TERM.qualifiedValueShape,
  TERM.targetClass
]);
const values = new Set([
  TERM.closed,
  TERM.minCount,
  TERM.maxCount,
  TERM.minExclusive,
  TERM.maxExclusive,
  TERM.minInclusive,
  TERM.maxInclusive,
  TERM.minLength,
  TERM.maxLength,
  TERM.name,
  TERM.uniqueLang,
  TERM.description,
  TERM.pattern,
  LABEL
]);
const valueLists = new Set([TERM.languageIn, TERM.in]);
const idLists = new Set([TERM.ignoredProperties, TERM.and, TERM.or, TERM.xone]);

/**
 * Get the value type of the given predicate.
 * @param {string} predicate the predicate we want to determine the type of.
 * @returns {string} either "id", "type", or "valueList" or "idList"
 */
export default function getValueType(predicate) {
  if (ids.has(predicate)) return ValueTypes.ID;
  if (values.has(predicate)) return ValueTypes.VALUE;
  if (valueLists.has(predicate)) return ValueTypes.VALUE_LIST;
  if (idLists.has(predicate)) return ValueTypes.ID_LIST;
}

/**
 * Determine the value type of the given constraint object.
 * @param {object} constraint constraint object with values.
 * @returns {string|null} the value type of this constraint.
 */
export function getValueTypeFromConstraint(constraint) {
  if (constraint.length > 0) {
    if (constraint.length > 1) return ValueTypes.ID_LIST;

    let value = constraint[0];
    if (value["@list"]) {
      value = value["@list"][0];
      if (value["@id"]) return ValueTypes.ID_LIST;
      if (value["@value"]) return ValueTypes.VALUE_LIST;
    } else {
      if (value["@id"]) return ValueTypes.ID;
      if (value["@value"]) return ValueTypes.VALUE;
    }
  }
  return null;
}
