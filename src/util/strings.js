import { MAX_LENGTH } from "../config/konvaConfigs";

/**
 * Capitalize the first letter of the given string.
 * @param {string} string the string we want to edit.
 * @returns {string} the given string with its first letter capitalized.
 */
export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

/**
 * Abbreviate the given string to the given maximum length.
 * This will use the first and last part of the string and put dots in between.
 * If the string is shorter than the given length, it will return the unchanged string.
 * @param {string} string the string we want to abbreviate.
 * @param {number} maxLength the maximum allowed string length. Default is `MAX_LENGTH`.
 * @returns {string} the abbreviated string.
 */
export function abbreviate(string, maxLength = MAX_LENGTH) {
  if (string.length > maxLength) {
    const half = Math.floor(maxLength / 2) - 1;
    return `${string.slice(0, half)}...${string.slice(string.length - half)}`;
  }
  return string;
}
