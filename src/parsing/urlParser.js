import { EXAMPLE_URI } from "../util/constants";

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
  return url;
}

/**
 * Get the base url from a string.
 * @param string
 * @returns {*}
 */
export function extractUrl(string) {
  return string.slice(0, string.indexOf("#") + 1);
}

/**
 * Create an example URL using the given ID.
 * @param id
 * @returns {string}
 */
export function createUrl(id) {
  return EXAMPLE_URI + id;
}