import { TERM } from "../../translation/terminology";
import { LABEL } from "../constants";

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
  TERM.lessThan,
  TERM.lessThanOrEquals,
  TERM.not,
  TERM.node,
  TERM.path,
  TERM.pattern,
  TERM.qualifiedMaxCount,
  TERM.qualifiedMinCount,
  TERM.qualifiedValueShape,
  TERM.targetClass
]);
const values = new Set([
  TERM.closed,
  TERM.hasValue,
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
  LABEL
]);
const valueLists = new Set([TERM.ignoredProperties, TERM.languageIn, TERM.in]);
const idLists = new Set([TERM.and, TERM.or, TERM.xone]);

/**
 * Get the value type of the given url.
 * @param url
 * @returns {string} either "id", "type", or "valueList" or "idList"
 */
export default function getValueType(url) {
  if (ids.has(url)) return ValueTypes.ID;
  if (values.has(url)) return ValueTypes.VALUE;
  if (valueLists.has(url)) return ValueTypes.VALUE_LIST;
  if (idLists.has(url)) return ValueTypes.ID_LIST;
}

/**
 * Determine the value type of the given constraint.
 * @param constraint
 * @returns {string|null}
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
