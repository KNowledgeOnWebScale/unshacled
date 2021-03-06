import Vue from "vue";
import { clone } from "ramda";
import { IDENTIFIER } from "./constants";

export { default as getNonOverlappingCoordinates } from "./getNonOverlappingCoordinates"; // prettier-ignore
export { default as traverse } from "./traverse";
export { default as XML_DATATYPES } from "./enums/xmlDatatypes";

/**
 * Prompt to download a file with the given filename and contents.
 * @param {string} filename the name of the file we want to download.
 * @param {string} contents the contents of the file.
 */
export function downloadFile(filename, contents) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(contents)}`
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Group the given dictionary by the given key.
 * @param dictionary a dictionary of objects.
 * @param key the key by which the objects should be grouped.
 * @param deleteKey boolean, indicates if the key should be removed from the object.
 */
export function groupBy(dictionary, key, deleteKey = false) {
  const output = {};
  for (const e of Object.keys(dictionary)) {
    const elem = clone(dictionary[e]);
    const k = elem[key];
    if (k) {
      if (!output[k]) output[k] = [];
      if (deleteKey) Vue.delete(elem, key);
      output[k].push(elem);
    }
  }
  return output;
}

/**
 * Swap the keys and values from `namespaces`.
 */
export function swapKeyValue(object) {
  const output = {};
  Object.keys(object).map(key => {
    output[object[key]] = key;
  });
  return output;
}

/**
 * Generate an UUID using the current set base URI and the `uuid/v4` generator.
 * @param baseURI
 * @returns {string}
 */
export function generateUUID(baseURI) {
  if (baseURI === "") {
    return `${IDENTIFIER}/${require("uuid/v4")()}`;
  } else {
    return `${baseURI}${require("uuid/v4")()}`;
  }
}
