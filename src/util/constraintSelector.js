import { groupedConstraints } from "./shaclConstraints";
import { format } from "./enums/format";

export function getConstraints(input) {
  switch (input) {
    case format.SHACL:
      return groupedConstraints;
    case format.SHEX:
      return null; // replace with shex constraints when  finished
  }
}
