import { TERM } from "../../translation/terminology";

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
const types = new Set([
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
  TERM.uniqueLang
]);
const valueLists = new Set([TERM.ignoredProperties, TERM.languageIn, TERM.in]);
const idLists = new Set([TERM.and, TERM.or, TERM.xone]);

/**
 * Get the value type of the given url.
 * @param url
 * @returns {string} either "id", "type", or "valueList" or "idList"
 */
export default function getValueType(url) {
  if (ids.has(url)) return "id";
  if (types.has(url)) return "type";
  if (valueLists.has(url)) return "valueList";
  if (idLists.has(url)) return "idList";
}
