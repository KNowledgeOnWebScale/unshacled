import { swapKeyValue } from "./index";
import { CUSTOM_URI } from "../translation/terminology";

/**
 * Takes the name out of an URL if possible.
 * If the given argument is not a real URL, just return the argument.
 * @param {string} url the string we want to remove the URL from.
 * @returns {string} if possible, the name extracted from the given URL.
 */
export function urlToName(url) {
  if (!url) return "(undefined)";
  if (url.indexOf("#") !== -1) return url.substring(url.indexOf("#") + 1);
  if (url.indexOf("/") !== -1) return url.substring(url.lastIndexOf("/") + 1);
  if (url.indexOf(":") !== -1 && url.indexOf("://") === -1)
    return url.substring(url.indexOf(":") + 1); // in case of prefixes
  return url;
}

/**
 * Change the URI in the given string to the matching prefix.
 * @param {object} namespaces the current set namespaces.
 * @param {string} string the string we want to change.
 * @returns {string} the input string with the URI replaced by a prefix.
 */
export function uriToPrefix(namespaces, string) {
  const uri = extractUrl(string);
  if (uri === CUSTOM_URI) return urlToName(string);
  if (swapKeyValue(namespaces)[uri])
    return string.replace(uri, `${swapKeyValue(namespaces)[uri]}:`);
  return string;
}

/**
 * Change the prefix in the given string to the matching URI.
 * If there is no URI defined for the given prefix, return the string unchanged.
 * @param {object} namespaces the current set namespaces.
 * @param {string} string the string we want to change.
 * @returns {string} the input string with the prefix replaced by the URI.
 */
export function prefixToUri(namespaces, string) {
  const prefix = extractPrefix(namespaces, string);
  if (namespaces[prefix])
    return string.replace(
      `${extractPrefix(namespaces, string)}:`,
      namespaces[prefix]
    );
  return string;
}

/**
 * Get the URL from a string.
 * @param {string} string the string we want to extract the URL from.
 * @returns {string} the URL from the given string.
 */
export function extractUrl(string) {
  const chars = "#/";
  for (const c of chars) {
    if (string.indexOf(c) !== -1) {
      return string.substring(0, string.lastIndexOf(c) + 1);
    }
  }
  return "";
}

/**
 * Get the prefix from a string.
 * @param {object} namespaces the current set namespaces.
 * @param {string} string the string we want to extract the prefix from.
 * @returns {string} the prefix from the given string.
 */
export function extractPrefix(namespaces, string) {
  const prefixes = Object.keys(namespaces);
  for (const prefix of prefixes) {
    if (string.indexOf(`${prefix}:`) === 0) return prefix;
  }
  return "";
}

/**
 * Check if the given string is an URL.
 * @param {string} string the string we want to check.
 * @returns {boolean} `true` if the given string is an URL.
 */
export function isUrl(string) {
  return string.includes("/");
}
