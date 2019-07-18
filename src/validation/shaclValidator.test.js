import fs from "fs";
import ShaclValidator from "./shaclValidator";

const shapes = fs
  .readFileSync("./tests/examples/shacl-validator/shapes.ttl")
  .toString();
const data = fs
  .readFileSync("./tests/examples/shacl-validator/data.ttl")
  .toString();
/*
const expectedReport = fs
  .readFileSync("./tests/examples/shacl-validator/report.json")
  .toString();
*/

test("validate shacl", async () => {
  const report = await ShaclValidator.validate(data, shapes);
  expect(report).toBeTruthy();
  // expect(JSON.stringify(report)).toStrictEqual(expectedReport);
});
