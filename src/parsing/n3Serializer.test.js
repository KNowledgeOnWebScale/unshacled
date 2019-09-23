import N3Serializer from "./n3Serializer";

const ttlShacl = `_:b0 <https://www.w3.org/ns/shacl#class> <https://example.org/ns#PostalAddress>;
    <https://www.w3.org/ns/shacl#path> <https://example.org/ns#address>.
<https://example.org/ns#ClassExampleShape> a <https://www.w3.org/ns/shacl#NodeShape>;
    <https://www.w3.org/ns/shacl#property> _:b0;
    <https://www.w3.org/ns/shacl#targetNode> <https://example.org/ns#Bob>, <https://example.org/ns#Alice>, <https://example.org/ns#Carol>.
`;
const jsonldSHACL = [
  {
    "@id": "_:b0",
    "https://www.w3.org/ns/shacl#path": [
      { "@id": "https://example.org/ns#address" }
    ],
    "https://www.w3.org/ns/shacl#class": [
      { "@id": "https://example.org/ns#PostalAddress" }
    ]
  },
  {
    "@id": "https://example.org/ns#ClassExampleShape",
    "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
    "https://www.w3.org/ns/shacl#property": [{ "@id": "_:b0" }],
    "https://www.w3.org/ns/shacl#targetNode": [
      { "@id": "https://example.org/ns#Bob" },
      { "@id": "https://example.org/ns#Alice" },
      { "@id": "https://example.org/ns#Carol" }
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
