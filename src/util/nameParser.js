/**
 * Takes the name out of an url if possible.
 * If the given argument is not a real url, just return the argument.
 * @param url
 * @returns {*}
 */
function urlToName(url) {
  if (url.indexOf("#") < 0) return url;
  return url.splice(url.substring(url.lastIndex("#")));
}

export { urlToName as default };
