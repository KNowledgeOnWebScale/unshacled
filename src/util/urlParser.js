import { swapKeyValue } from "./index";
import { CUSTOM_URI } from "../translation/terminology";

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
  if (url.indexOf(":") !== -1 && url.indexOf("://") === -1)
    return url.substring(url.indexOf(":") + 1); // in case of prefixes
  return url;
}

/**
 * Change the URI in the given string to the matching prefix.
 * @param namespaces
 * @param string {string}
 * @returns {string}
 */
export function uriToPrefix(namespaces, string) {
  if (
    string.indexOf("_:") === 0 ||
    (string.indexOf(":") !== -1 && string.indexOf("://") === -1)
  )
    return string;
  const uri = extractUrl(string);
  if (uri === CUSTOM_URI) return urlToName(string);
  if (swapKeyValue(namespaces)[uri])
    return string.replace(uri, `${swapKeyValue(namespaces)[uri]}:`);
  return string;
}

/**
 * Change the prefix in the given string to the matching URI.
 * If there is no URI defined for the given prefix, return the string unchanged.
 * @param namespaces
 * @param string {string}
 * @returns {string}
 */
export function prefixToUri(namespaces, string) {
  const prefix = extractPrefix(string);
  if (namespaces[prefix])
    return string.replace(`${extractPrefix(string)}:`, namespaces[prefix]);
  return string;
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
  if (string.indexOf(":") !== -1 && string.indexOf("://") === -1) {
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
