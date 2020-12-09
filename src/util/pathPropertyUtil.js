import { PATH_PROPERTIES } from "./constants";
import { TERM } from "../translation/terminology";
import { uriToPrefix } from "./urlParser";

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

/**
 * This is a very complicated way to check for a very specific case.
 * This checks whether a node is a blank node that has sh:property as its only property and
 * if so, if that node is the destination shape of a relationship, coming from a nodeshape.
 * If these are both true, the node shouldn't be rendered and instead, a relationship node should be shown.
 * @param {Object} node The node that is being checked for being a blank property node and destination of a relationship from a nodeshape
 * @param {Object} relationships All relationships, to check for the relationship coming from a nodeshape to the node being checked
 * @param {Object} model The entire model, to check whether the source shape is a nodeshape
 */
export function isBlankLogicalRelationshipNode(node, relationships, model) {
  if (node["@id"][0] === "_" && Object.keys(node).length === 2) {
    const testConstraints = [TERM.property, "@id"].every(x => Object.keys(node).includes(x));
    if (testConstraints) {
      for (const rel of relationships) {
        if (rel.to === node["@id"]) {
          return model.some(item => item["@id"] === rel.from && item["@type"] && item["@type"][0] === TERM.NodeShape);
        }
      }
    }
  }
  return false;
}

/**
 * This function parses a complex path, following the blank path nodes
 * (blank nodes with only one property, a (special) path property)
 * @param partialPath A partially parsed path, this is either the uri of a blank path node, just a regular uri, or a list of uri's indicating a sequence path
 * @param getters The getters, required to retrieve the next shapes in the sequence (and for uriToPrefix)
 */
export function parsePath({ partialPath, getters }) {
  if (Array.isArray(partialPath)) {
    return partialPath
      .map(x =>
        parsePath({
          partialPath: x["@id"],
          getters
        })
      )
      .join("/");
  } else {
    const shape = getters.shapeWithID(partialPath);
    if (shape && isBlankPathNode(shape)) {
      if (shape[TERM.path]) {
        const path = shape[TERM.path][0];
        if (path["@value"]) {
          return path["@value"];
        } else if (path["@id"]) {
          const pathNode = getters.shapeWithID(path["@id"]);
          if (pathNode && isBlankPathNode(pathNode)) {
            return parsePath({
              partialPath: path["@id"],
              getters
            });
          } else {
            return uriToPrefix(getters.namespaces, path["@id"]);
          }
        } else if (path["@list"]) {
          return parsePath({
            partialPath: path["@list"],
            getters
          });
        } else {
          return "value missing";
        }
      } else if (shape[TERM.alternativePath]) {
        const altPath = shape[TERM.alternativePath][0]["@list"];
        return altPath
          .map(x =>
            parsePath({
              partialPath: x["@id"],
              getters
            })
          )
          .join("|");
      } else if (shape[TERM.inversePath]) {
        return `^(${parsePath({
          partialPath: shape[TERM.inversePath][0]["@id"],
          getters
        })})`;
      } else if (shape[TERM.zeroOrMorePath]) {
        return `(${parsePath({
          partialPath: shape[TERM.zeroOrMorePath][0]["@id"],
          getters
        })})*`;
      } else if (shape[TERM.zeroOrOnePath]) {
        return `(${parsePath({
          partialPath: shape[TERM.zeroOrOnePath][0]["@id"],
          getters
        })})?`;
      } else if (shape[TERM.oneOrMorePath]) {
        return `(${parsePath({
          partialPath: shape[TERM.oneOrMorePath][0]["@id"],
          getters
        })})+`;
      }
    } else {
      return uriToPrefix(getters.namespaces, partialPath);
    }
  }
}
