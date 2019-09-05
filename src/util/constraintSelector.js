import { groupedConstraints } from "./shacl/shaclConstraints";
import language from "./enums/languages";

/**
 * Currently not used.
 * @param input
 * @returns {*}
 */
export default function getConstraints(input) {
  switch (input) {
    case language.SHACL:
      return groupedConstraints;
    case language.SHEX:
      return null; // replace with shex constraints when  finished
  }
}
