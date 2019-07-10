import * as Parsers from "./parsers";

const ttlShacl = `@prefix ex: <http://example.org/ns#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .

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
  '[{"@id":"_:b0","http://www.w3.org/ns/shacl#path":[{"@id":"http://example.org/ns#address"}],"http://www.w3.org/ns/shacl#class":[{"@id":"http://example.org/ns#PostalAddress"}]},{"@id":"http://example.org/ns#ClassExampleShape","@type":["http://www.w3.org/ns/shacl#NodeShape"],"http://www.w3.org/ns/shacl#property":[{"@id":"_:b0"}],"http://www.w3.org/ns/shacl#targetNode":[{"@id":"http://example.org/ns#Bob"},{"@id":"http://example.org/ns#Alice"},{"@id":"http://example.org/ns#Carol"}]}]';

test("turtle SHACL to json-ld", async () => {
  const jsonld = await Parsers.N3Parser.parse(ttlShacl, "text/turtle");
  expect(JSON.stringify(jsonld)).toBe(jsonldSHACL);
});
