import N3Parser from "./n3Parser";

const ttlShacl = `@prefix ex: <https://example.org/ns#> .
@prefix sh: <https://www.w3.org/ns/shacl#> .

# Shape
ex:ClassExampleShape
        a sh:NodeShape ;
        sh:property [
                sh:path ex:address ;
                sh:class ex:PostalAddress ;
        ] .

# Targeting
ex:ClassExampleShape
    sh:targetNode ex:Bob, ex:Alice, ex:Carol .`;
const jsonldSHACL =
  '[{"@id":"_:b0","https://www.w3.org/ns/shacl#path":[{"@id":"https://example.org/ns#address"}],"https://www.w3.org/ns/shacl#class":[{"@id":"https://example.org/ns#PostalAddress"}]},{"@id":"https://example.org/ns#ClassExampleShape","@type":["https://www.w3.org/ns/shacl#NodeShape"],"https://www.w3.org/ns/shacl#property":[{"@id":"_:b0"}],"https://www.w3.org/ns/shacl#targetNode":[{"@id":"https://example.org/ns#Bob"},{"@id":"https://example.org/ns#Alice"},{"@id":"https://example.org/ns#Carol"}]}]';

test("turtle SHACL to json-ld", async () => {
  const jsonld = await N3Parser.parse(ttlShacl, "text/turtle");
  expect(JSON.stringify(jsonld)).toBe(jsonldSHACL);
});
