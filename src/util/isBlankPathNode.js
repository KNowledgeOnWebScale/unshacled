import { PATH_PROPERTIES } from "./constants";

/**
 * Check if the given node is a blank node with as its only property one of the path properties.
 * @param {object} node
 * @returns {boolean}
 */
export function isBlankPathNode(node) {
  if (node["@id"][0] === "_" && Object.keys(node).length === 2) {
    for (const item of Object.keys(node)) {
      if (item !== "@id") {
        return PATH_PROPERTIES.includes(item);
      }
    }
  } else {
    return false;
  }
}
