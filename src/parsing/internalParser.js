import { CUSTOM_URI, SHACL_URI } from "../util/constants";

/**
 * Parse SHACL to the internal model.
 * @param shacl
 * @returns {string}
 */
export default function shaclToInternal(shacl) {
  return JSON.parse(
    JSON.stringify(shacl).replace(new RegExp(SHACL_URI, "g"), CUSTOM_URI)
  );
}
