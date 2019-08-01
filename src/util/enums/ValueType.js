import { CUSTOM_URI } from "../constants";

const ids = new Set([
  `${CUSTOM_URI}path`,
  `${CUSTOM_URI}class`,
  `${CUSTOM_URI}property`,
  `${CUSTOM_URI}targetNode`,
  `${CUSTOM_URI}datatype`,
  `${CUSTOM_URI}nodeKind`,
  `${CUSTOM_URI}targetObjectsOf`,
  `${CUSTOM_URI}equals`,
  `${CUSTOM_URI}disjoint`,
  `${CUSTOM_URI}lessThan`,
  `${CUSTOM_URI}lessThanOrEquals`,
  `${CUSTOM_URI}not`,
  `${CUSTOM_URI}targetClass`,
  `${CUSTOM_URI}node`
]);
const types = new Set([
  `${CUSTOM_URI}minCount`,
  `${CUSTOM_URI}maxCount`,
  `${CUSTOM_URI}minExclusive`,
  `${CUSTOM_URI}maxExclusive`,
  `${CUSTOM_URI}minInclusive`,
  `${CUSTOM_URI}maxInclusive`,
  `${CUSTOM_URI}minLength`,
  `${CUSTOM_URI}maxLength`,
  `${CUSTOM_URI}uniqueLang`
]);
const lists = new Set([
  `${CUSTOM_URI}languageIn`,
  `${CUSTOM_URI}and`,
  `${CUSTOM_URI}or`,
  `${CUSTOM_URI}xone`
]);

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
