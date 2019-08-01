import { CUSTOM_URI, SHACL_URI } from "../util/constants";

/**
 * Parse SHACL to the internal model.
 * @param shacl
 * @returns {string}
 */
export function shaclToInternal(shacl) {
  return JSON.parse(
    JSON.stringify(shacl).replace(new RegExp(SHACL_URI, "g"), CUSTOM_URI)
  );
}

/**
 * Parse the internal model to SHACL
 * @param internal
 * @returns {any}
 */
export function internalToShacl(internal) {
  return JSON.parse(
    JSON.stringify(internal).replace(new RegExp(CUSTOM_URI, "g"), SHACL_URI)
  );
}

// TODO ShEx to internal
// TODO internal to ShEx
