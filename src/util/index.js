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