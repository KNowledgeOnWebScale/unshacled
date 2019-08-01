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
  TERM.targetClass,
  TERM.node
]);
const types = new Set([
  TERM.minCount,
  TERM.maxCount,
  TERM.minExclusive,
  TERM.maxExclusive,
  TERM.minInclusive,
  TERM.maxInclusive,
  TERM.minLength,
  TERM.maxLength,
  TERM.uniqueLang
]);
const lists = new Set([TERM.languageIn, TERM.and, TERM.or, TERM.xone]);

/**
 * TODO
 * @param url
 * @returns {string}
 */
export default function getValueType(url) {
  if (ids.has(url)) return "id";
  if (types.has(url)) return "type";
  if (lists.has(url)) return "list";
}
