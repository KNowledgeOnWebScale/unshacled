const exampleData =
  `${String(
    `${String(
      "@prefix ex: <http://example.org/ns#> ." +
        "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ." +
        "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> ." +
        "@prefix schema: <http://schema.org/> ." +
        "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> ."
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
      "@prefix dash: <http://datashapes.org/dash#> ." +
        "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ." +
        "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> ." +
        "@prefix schema: <http://schema.org/> ." +
        "@prefix sh: <http://www.w3.org/ns/shacl#> ." +
        "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> ."
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

export { exampleData, exampleShapes };
