
## Acceptance tests

### SHACL core constraints - ShapeUML

This test uses a dataset covering all SHACL core constraints taken from the ShapeViBe benchmark.

* data in SHACL turtle: https://w3id.org/imec/unshacled/shape-vibe/modules/shacl-core-constraints/

| Test case ID  | Context       | Visualization |
| ------------- | ------------- | ------------- |
| 0001          | Person shape  | There should be a dashed arrow to `ex:organizationShape` with the label `NOT` |
| 0002          | Person shape  | There should be the following text in the lower compartment: `nodeKind IRI` |
| 0003          | Person shape  | There should be a disjunction between a property shape with path `ex:fullName` and a data shape (\<\<Conditions\>\>), i.e. two solid arrows from the node shape `personShape` to both data shapes part of the disjunction with the cardinalities `0..1` next to the arrow head of the connection to `ex:fullName` |
| 0004          | Person shape  | There should be a conjunction between two property shapes with the property paths `ex:givenName` and `ex:firstName`, both properties of the data shape from the previous point, next to both arrow heads the cardinalities `1..*` should be shown |
| 0005          | Person shape  | There should be the following text in the lower compartment of the property shape with path `ex:givenName`: `equals ex:firstName` |
| 0006          | Person shape  | There should be a solid arrow to the property shape `emailAddress` |
| 0007          | Person shape  | There should be the following text in the lower compartment of the `emailAddress` property shape: `pattern /^.*@.*/i` |
| 0008          | Person shape  | There should be the following text in the lower compartment of the `emailAddress` property shape: `minLength 3` |
| 0009          | Person shape  | There should be the following text in the lower compartment of the `emailAddress` property shape: `maxLength 320` |
| 0010          | Person shape  | There should be a dashed arrow from the property shape with path `ex:address` to the node shape `ex:addressShape` and the label `complyWith` |
| 0011          | Person shape  | There should be a dashed arrow from the property shape with path `ex:bicycle` to the node shape `ex:bicycleShape` and the label `complyWith` |
| 0012              | Person shape  | There should be a solid arrow to the property shape `validBirthDate` with the cardinalities `1..1` next to the arrow head |
| 0013          | Address shape | There should be a label `Address` in the upper compartment of the node shape |
| 0014          | Address shape | There should be an exclusive disjunction between `zipCode`, `postalCode` and `postleitzahl`, i.e. three arrows overlayed with a dashed line and label `OneOf` |
| 0015          | Address shape | There should be the cardinalities `1..*` next to the arrow heads of the solid arrows to the property shapes `zipCode`, `postalCode` and `postleitzahl` |
| 0016          | Address shape | There should be the following text in the lower compartment of the property shape with path `ex:zipCode`: `valueMinExclusive 1000` |
| 0017          | Address shape | There should be the following text in the lower compartment of the property shape with path `ex:zipCode`: `valueMaxExclusive 10000` |
| 0018          | Address shape | There should be the following text in the lower compartment of the property shape with path `ex:postleitzahl`: `valueMinInclusive 10000` |
| 0019          | Address shape | There should be the following text in the lower compartment of the property shape with path `ex:postleitzahl`: `valueMaxInclusive 99999` |
| 0020          | Biological parent shape | There should be a solid arrow to the property shape with path `ex:biologicalParent` with the cardinalities `2..2` next to the arrow head |
| 0021          | Biological parent shape | There should be a dashed arrow from the property shape with path `ex:biologicalParent` to a property shape with path `ex:gender` with the cardinalities `1..1` next to the start of the arrow |
| 0022          | Biological parent shape | There should be the following text in the lower compartment of the property shape with path `ex:gender`: `hasValue ex:female` |
| 0023          | Biological parent shape | There should be the following text in the lower compartment of the `biologicalParent` property shape: `class ex:Person` |
| 0024          | Organization shape      | There should be the label `Organization` in the upper compartment of the `organizationShape` |
| 0025          | Organization shape      | There should be a solid arrow to the property shape with the path `ex:prefLabel` |
| 0026          | Organization shape      | There should be the following text in the lower compartment of the property shape with path `ex:prefLabel`: `disjoint ex:altLabel` |
| 0027          | Organization shape      | There should be the following text in the lower compartment of the property shape with path `ex:prefLabel`: `languageIn (en, de, nl)` |
| 0028          | Organization shape      | There should be the following text in the lower compartment of the property shape with path `ex:prefLabel`: `uniqueLang true` |
| 0029          | Organization shape      | There should be a solid arrow to the property shape with the path `ex:hasCEO` and the cardinalities `1..*` next to the arrow head |
| 0030          | Bicycle shape           | There should be the following text in the lower compartment of the node shape `bicycleShape`: `onlyListedProperties true` |
| 0031          | Bicycle shape           | There should be the following text in the lower compartment of the node shape `bicycleShape`: `otherAllowedProperties (rdf:type, rdfs:label)` |
| 0032          | Bicycle shape           | There should be a solid arrow to the property shape with the path `ex:manufacturingDate` |
| 0033          | Bicycle shape           | There should be the following text in the lower compartment of the property shape with path `ex:manufacturingDate`: `lessThan ex:recyclingDate` |
| 0034          | Bicycle shape           | There should be a solid arrow to the property shape with the path `ex:manufacturer` |
| 0035          | Bicycle shape           | There should be the following text in the lower compartment of the property shape with path `ex:manufacturer`: `valueIn ("m1", "m2", "m3")` |
| 0036          | Date of birth shape     | There should be the following text in the lower compartment of the property shape with path `ex:birthDate`: `datatype xsd:date` |
| 0037          | Date of birth shape     | There should be the following text in the lower compartment of the property shape with path `ex:birthDate`: `lessThanOrEquals ex:deathDate` |
