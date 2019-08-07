const exampleData =
  "{\n" +
  '    "@context": { "@vocab": "http://schema.org/" },\n' +
  "\n" +
  '    "@id": "http://example.org/ns#Bob",\n' +
  '    "@type": "Person",\n' +
  '    "givenName": "Robert",\n' +
  '    "familyName": "Junior",\n' +
  '    "birthDate": "1971-07-07",\n' +
  '    "deathDate": "1968-09-10",\n' +
  '    "address": {\n' +
  '        "@id": "http://example.org/ns#BobsAddress",\n' +
  '        "streetAddress": "1600 Amphitheatre Pkway",\n' +
  '        "postalCode": 9404\n' +
  "    }\n" +
  "}\n";

const exampleShapes =
  "@prefix dash: <http://datashapes.org/dash#> .\n" +
  "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n" +
  "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n" +
  "@prefix schema: <http://schema.org/> .\n" +
  "@prefix sh: <http://www.w3.org/ns/shacl#> .\n" +
  "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n" +
  "\n" +
  "schema:PersonShape\n" +
  "    a sh:NodeShape ;\n" +
  "    sh:targetClass schema:Person ;\n" +
  "    sh:property [\n" +
  "        sh:path schema:givenName ;\n" +
  "        sh:datatype xsd:string ;\n" +
  '        sh:name "given name" ;\n' +
  "    ] ;\n" +
  "    sh:property [\n" +
  "        sh:path schema:birthDate ;\n" +
  "        sh:lessThan schema:deathDate ;\n" +
  "        sh:maxCount 1 ;\n" +
  "    ] ;\n" +
  "    sh:property [\n" +
  "        sh:path schema:gender ;\n" +
  '        sh:in ( "female" "male" ) ;\n' +
  "    ] ;\n" +
  "    sh:property [\n" +
  "        sh:path schema:address ;\n" +
  "        sh:node schema:AddressShape ;\n" +
  "    ] .\n" +
  "\n" +
  "schema:AddressShape\n" +
  "    a sh:NodeShape ;\n" +
  "    sh:closed true ;\n" +
  "    sh:property [\n" +
  "        sh:path schema:streetAddress ;\n" +
  "        sh:datatype xsd:string ;\n" +
  "    ] ;\n" +
  "    sh:property [\n" +
  "        sh:path schema:postalCode ;\n" +
  "        sh:or ( [ sh:datatype xsd:string ] [ sh:datatype xsd:integer ] ) ;\n" +
  "        sh:minInclusive 10000 ;\n" +
  "        sh:maxInclusive 99999 ;\n" +
  "    ] .\n";

export { exampleData, exampleShapes };
