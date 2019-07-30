import N3Serializer from "./n3Serializer";

const ttlShacl = `_:b0 <http://www.w3.org/ns/shacl#class> <http://example.org/ns#PostalAddress>;
    <http://www.w3.org/ns/shacl#path> <http://example.org/ns#address>.
<http://example.org/ns#ClassExampleShape> a <http://www.w3.org/ns/shacl#NodeShape>;
    <http://www.w3.org/ns/shacl#property> _:b0;
    <http://www.w3.org/ns/shacl#targetNode> <http://example.org/ns#Bob>, <http://example.org/ns#Alice>, <http://example.org/ns#Carol>.
`;
const jsonldSHACL = [
  {
    "@id": "_:b0",
    "http://www.w3.org/ns/shacl#path": [
      { "@id": "http://example.org/ns#address" }
    ],
    "http://www.w3.org/ns/shacl#class": [
      { "@id": "http://example.org/ns#PostalAddress" }
    ]
  },
  {
    "@id": "http://example.org/ns#ClassExampleShape",
    "@type": ["http://www.w3.org/ns/shacl#NodeShape"],
    "http://www.w3.org/ns/shacl#property": [{ "@id": "_:b0" }],
    "http://www.w3.org/ns/shacl#targetNode": [
      { "@id": "http://example.org/ns#Bob" },
      { "@id": "http://example.org/ns#Alice" },
      { "@id": "http://example.org/ns#Carol" }
    ]
  }
];

test("json-ld to turtle", async () => {
  const turtle = await N3Serializer.serialize(
    jsonldSHACL,
    "text/turtle"
  );
  expect(turtle).toBe(ttlShacl);
});
