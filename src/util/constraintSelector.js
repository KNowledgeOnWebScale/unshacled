import { groupedConstraints } from "./shaclConstraints.js";
import { format } from "./enums/format.js";
export function getConstraints(input) {
  switch (input) {
    case format.SHACL:
      return groupedConstraints;
    case format.SHEX:
      return null; //replace with shex constraints when  finished
  }
}
