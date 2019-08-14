import Vue from "vue";
import { clone } from "ramda";

export { default as getNonOverlappingCoordinates } from "./getNonOverlappingCoordinates"; // prettier-ignore
export { default as traverse } from "./traverse";

/**
 * Prompt to download a file with the given filename and contents.
 * @param filename
 * @param contents
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
 * Returns `string` with the first letter capitalized.
 * @param string
 * @returns {string}
 */
export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

/**
 * Calculate the distance between the two given points.
 * @returns {number}
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
export function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
