import namespaces from "../config/config";
import { swapKeyValue } from "./index";

/**
 * Takes the name out of an url if possible.
 * If the given argument is not a real url, just return the argument.
 * @param url
 * @returns {*}
 */
export function urlToName(url) {
  if (!url) return "(undefined)";
  if (url.indexOf("#") !== -1) return url.substring(url.indexOf("#") + 1);
  if (url.indexOf("/") !== -1) return url.substring(url.lastIndexOf("/") + 1);
  if (url.indexOf(":") !== -1) return url.substring(url.indexOf(":") + 1); // in case of prefixes
  return url;
}

/**
 * Change the URI in the given string to the matching prefix.
 * @param string {string}
 * @returns {string}
 */
export function uriToPrefix(string) {
  const uri = extractUrl(string);
  return string.replace(uri, swapKeyValue(namespaces)[uri]);
}

/**
 * Change the prefix in the given string to the matching URI.
 * @param string {string}
 * @returns {string}
 */
export function prefixToUri(string) {
  const prefix = extractPrefix(string);
  return string.replace(prefix, namespaces[prefix]);
}

/**
 * Get the base url from a string.
 * @param string {string}
 * @returns {string}
 */
export function extractUrl(string) {
  if (string.indexOf("#") !== -1)
    return string.substring(0, string.indexOf("#") + 1);
  if (string.indexOf("/") !== -1)
    return string.substring(0, string.lastIndexOf("/") + 1);
  return "";
}

/**
 * Get the prefix from a string.
 * @param string {string}
 * @returns {string}
 */
export function extractPrefix(string) {
  if (string.indexOf(":") !== -1) {
    return string.substring(0, string.indexOf(":"));
  }
  return "";
}

/**
 * Check if the given string is an url.
 * @param string
 * @returns {boolean}
 */
export function isUrl(string) {
  return string.includes("/");
}
