/**
 * Takes the name out of an url if possible.
 * If the given argument is not a real url, just return the argument.
 * @param url
 * @returns {*}
 */
export function urlToName(url) {
  if (url.indexOf("#") < 0) return url;
  return url.substring(url.indexOf("#") + 1);
}

/**
 * Get the base url from a string.
 * @param string
 * @returns {*}
 */
export function extractUrl(string) {
  return string.slice(0, string.indexOf("#") + 1);
}
