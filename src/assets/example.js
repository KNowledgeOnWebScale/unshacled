const exampleData =
  `${String(
    `${String(
      "@prefix ex: <https://example.org/ns#> ." +
        "@prefix rdf: <https://www.w3.org/1999/02/22-rdf-syntax-ns#> ." +
        "@prefix rdfs: <https://www.w3.org/2000/01/rdf-schema#> ." +
        "@prefix schema: <https://schema.org/> ." +
        "@prefix xsd: <https://www.w3.org/2001/XMLSchema#> ."
    )}ex:Bob` +
      `    a schema:Person ;` +
      `    schema:givenName "Robert" ;` +
      `    schema:familyName "Junior" ;` +
      `    schema:birthDate "1971-07-07"^^xsd:date ;` +
      `    schema:deathDate "1968-09-10"^^xsd:date ;` +
      `    schema:address ex:BobsAddress .`
  )}ex:BobsAddress` +
  `    schema:streetAddress "1600 Amphitheatre Pkway" ;` +
  `    schema:postalCode 9404 .`;

const exampleShapes =
  `${String(
    `${String(
      "@prefix dash: <https://datashapes.org/dash#> ." +
        "@prefix rdf: <https://www.w3.org/1999/02/22-rdf-syntax-ns#> ." +
        "@prefix rdfs: <https://www.w3.org/2000/01/rdf-schema#> ." +
        "@prefix schema: <https://schema.org/> ." +
        "@prefix sh: <https://www.w3.org/ns/shacl#> ." +
        "@prefix xsd: <https://www.w3.org/2001/XMLSchema#> ."
    )}schema:PersonShape` +
      `    a sh:NodeShape ;` +
      `    sh:targetClass schema:Person ;` +
      `    sh:property [` +
      `        sh:path schema:givenName ;` +
      `        sh:datatype xsd:string ;` +
      `        sh:name "given name" ;` +
      `    ] ;` +
      `    sh:property [` +
      `        sh:path schema:birthDate ;` +
      `        sh:lessThan schema:deathDate ;` +
      `        sh:maxCount 1 ;` +
      `    ] ;` +
      `    sh:property [` +
      `        sh:path schema:gender ;` +
      `        sh:in ( "female" "male" ) ;` +
      `    ] ;` +
      `    sh:property [` +
      `        sh:path schema:address ;` +
      `        sh:node schema:AddressShape ;` +
      `    ] .`
  )}schema:AddressShape` +
  `    a sh:NodeShape ;` +
  `    sh:closed true ;` +
  `    sh:property [` +
  `        sh:path schema:streetAddress ;` +
  `        sh:datatype xsd:string ;` +
  `    ] ;` +
  `    sh:property [` +
  `        sh:path schema:postalCode ;` +
  `        sh:or ( [ sh:datatype xsd:string ] [ sh:datatype xsd:integer ] ) ;` +
  `        sh:minInclusive 10000 ;` +
  `        sh:maxInclusive 99999 ;` +
  `    ] .`;

const exampleShapesJSON =
  "[\n" +
  "  {\n" +
  '    "@id": "_:b0",\n' +
  '    "https://www.w3.org/ns/shacl#path": [\n' +
  "      {\n" +
  '        "@id": "https://schema.org/givenName"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#datatype": [\n' +
  "      {\n" +
  '        "@id": "https://www.w3.org/2001/XMLSchema#string"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#name": [\n' +
  "      {\n" +
  '        "@value": "given name",\n' +
  '        "@language": "en"\n' +
  "      }\n" +
  "    ]\n" +
  "  },\n" +
  "  {\n" +
  '    "@id": "_:b1",\n' +
  '    "https://www.w3.org/ns/shacl#path": [\n' +
  "      {\n" +
  '        "@id": "https://schema.org/birthDate"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#lessThan": [\n' +
  "      {\n" +
  '        "@id": "https://schema.org/deathDate"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#maxCount": [\n' +
  "      {\n" +
  '        "@value": "1",\n' +
  '        "@type": "https://www.w3.org/2001/XMLSchema#integer"\n' +
  "      }\n" +
  "    ]\n" +
  "  },\n" +
  "  {\n" +
  '    "@id": "_:b11",\n' +
  '    "https://www.w3.org/ns/shacl#datatype": [\n' +
  "      {\n" +
  '        "@id": "https://www.w3.org/2001/XMLSchema#integer"\n' +
  "      }\n" +
  "    ]\n" +
  "  },\n" +
  "  {\n" +
  '    "@id": "_:b2",\n' +
  '    "https://www.w3.org/ns/shacl#path": [\n' +
  "      {\n" +
  '        "@id": "https://schema.org/gender"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#in": [\n' +
  "      {\n" +
  '        "@list": [\n' +
  "          {\n" +
  '            "@value": "female"\n' +
  "          },\n" +
  "          {\n" +
  '            "@value": "male"\n' +
  "          }\n" +
  "        ]\n" +
  "      }\n" +
  "    ]\n" +
  "  },\n" +
  "  {\n" +
  '    "@id": "_:b5",\n' +
  '    "https://www.w3.org/ns/shacl#path": [\n' +
  "      {\n" +
  '        "@id": "https://schema.org/address"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#node": [\n' +
  "      {\n" +
  '        "@id": "https://schema.org/AddressShape"\n' +
  "      }\n" +
  "    ]\n" +
  "  },\n" +
  "  {\n" +
  '    "@id": "_:b6",\n' +
  '    "https://www.w3.org/ns/shacl#path": [\n' +
  "      {\n" +
  '        "@id": "https://schema.org/streetAddress"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#datatype": [\n' +
  "      {\n" +
  '        "@id": "https://www.w3.org/2001/XMLSchema#string"\n' +
  "      }\n" +
  "    ]\n" +
  "  },\n" +
  "  {\n" +
  '    "@id": "_:b7",\n' +
  '    "https://www.w3.org/ns/shacl#path": [\n' +
  "      {\n" +
  '        "@id": "https://schema.org/postalCode"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#or": [\n' +
  "      {\n" +
  '        "@list": [\n' +
  "          {\n" +
  '            "@id": "_:b9"\n' +
  "          },\n" +
  "          {\n" +
  '            "@id": "_:b11"\n' +
  "          }\n" +
  "        ]\n" +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#minInclusive": [\n' +
  "      {\n" +
  '        "@value": "10000",\n' +
  '        "@type": "https://www.w3.org/2001/XMLSchema#integer"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#maxInclusive": [\n' +
  "      {\n" +
  '        "@value": "99999",\n' +
  '        "@type": "https://www.w3.org/2001/XMLSchema#integer"\n' +
  "      }\n" +
  "    ]\n" +
  "  },\n" +
  "  {\n" +
  '    "@id": "_:b9",\n' +
  '    "https://www.w3.org/ns/shacl#datatype": [\n' +
  "      {\n" +
  '        "@id": "https://www.w3.org/2001/XMLSchema#string"\n' +
  "      }\n" +
  "    ]\n" +
  "  },\n" +
  "  {\n" +
  '    "@id": "https://schema.org/AddressShape",\n' +
  '    "@type": [\n' +
  '      "https://www.w3.org/ns/shacl#NodeShape"\n' +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#closed": [\n' +
  "      {\n" +
  '        "@value": "true",\n' +
  '        "@type": "https://www.w3.org/2001/XMLSchema#boolean"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#property": [\n' +
  "      {\n" +
  '        "@id": "_:b6"\n' +
  "      },\n" +
  "      {\n" +
  '        "@id": "_:b7"\n' +
  "      }\n" +
  "    ]\n" +
  "  },\n" +
  "  {\n" +
  '    "@id": "https://schema.org/PersonShape",\n' +
  '    "@type": [\n' +
  '      "https://www.w3.org/ns/shacl#NodeShape"\n' +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#targetClass": [\n' +
  "      {\n" +
  '        "@id": "https://schema.org/Person"\n' +
  "      }\n" +
  "    ],\n" +
  '    "https://www.w3.org/ns/shacl#property": [\n' +
  "      {\n" +
  '        "@id": "_:b0"\n' +
  "      },\n" +
  "      {\n" +
  '        "@id": "_:b1"\n' +
  "      },\n" +
  "      {\n" +
  '        "@id": "_:b2"\n' +
  "      },\n" +
  "      {\n" +
  '        "@id": "_:b5"\n' +
  "      }\n" +
  "    ]\n" +
  "  }\n" +
  "]";

export { exampleData, exampleShapes, exampleShapesJSON };
