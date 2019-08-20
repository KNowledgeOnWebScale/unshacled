/**
 * Returns `string` with the first letter capitalized.
 * @param string
 * @returns {string}
 */
import {MAX_LENGTH} from "./konvaConfigs";

export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

/**
 * Abbreviate the given string to the given maximum length.
 * This will use the first and last part of the string and put dots in between.
 * @param string
 * @returns {string}
 */
export function abbreviate(string) {
  if (string.length > MAX_LENGTH) {
    const half = Math.floor(MAX_LENGTH / 2) - 1;
    return `${string.slice(0, half)}...${string.slice(string.length - half)}`;
  }
  return string;
}
