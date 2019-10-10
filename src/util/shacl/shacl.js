const shacl = [
  {
    "@id": "_:b0",
    "https://www.w3.org/ns/shacl#prefix": [
      {
        "@value": "sh"
      }
    ],
    "https://www.w3.org/ns/shacl#namespace": [
      {
        "@value": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#",
    "@type": ["https://www.w3.org/2002/07/owl#Ontology"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "W3C Shapes Constraint Language (SHACL) Vocabulary",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "This vocabulary defines terms used in SHACL, the W3C Shapes Constraint Language.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#declare": [
      {
        "@id": "_:b0"
      }
    ],
    "https://www.w3.org/ns/shacl#suggestedShapesGraph": [
      {
        "@id": "https://www.w3.org/ns/shacl-shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#AbstractResult",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Abstract result",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The base class of validation results, typically not instantiated directly.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#AndConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "And constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to test whether a value node conforms to all members of a provided list of shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#AndConstraintComponent-and"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#AndConstraintComponent-and",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#and"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#BlankNode",
    "@type": ["https://www.w3.org/ns/shacl#NodeKind"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Blank node",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all blank nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#BlankNodeOrIRI",
    "@type": ["https://www.w3.org/ns/shacl#NodeKind"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Blank node or IRI",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all blank nodes or IRIs.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#BlankNodeOrLiteral",
    "@type": ["https://www.w3.org/ns/shacl#NodeKind"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Blank node or literal",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all blank nodes or literals.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ClassConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Class constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that each value node is an instance of a given type.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#ClassConstraintComponent-class"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ClassConstraintComponent-class",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#class"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#IRI"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ClosedConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Closed constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to indicate that focus nodes must only have values for those properties that have been explicitly enumerated via sh:property/sh:path.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#ClosedConstraintComponent-closed"
      },
      {
        "@id":
          "https://www.w3.org/ns/shacl#ClosedConstraintComponent-ignoredProperties"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ClosedConstraintComponent-closed",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#closed"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#ClosedConstraintComponent-ignoredProperties",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#ignoredProperties"
      }
    ],
    "https://www.w3.org/ns/shacl#optional": [
      {
        "@value": "true",
        "@type": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ConstraintComponent",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of constraint components.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#DatatypeConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Datatype constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the datatype of all value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#DatatypeConstraintComponent-datatype"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#DatatypeConstraintComponent-datatype",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#datatype"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#IRI"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#DisjointConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Disjoint constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that the set of value nodes is disjoint with the the set of nodes that have the focus node as subject and the value of a given property as predicate.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#DisjointConstraintComponent-disjoint"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#DisjointConstraintComponent-disjoint",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#disjoint"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#IRI"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#EqualsConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Equals constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that the set of value nodes is equal to the set of nodes that have the focus node as subject and the value of a given property as predicate.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#EqualsConstraintComponent-equals"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#EqualsConstraintComponent-equals",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#equals"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#IRI"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ExpressionConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Expression constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that a given node expression produces true for all value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#ExpressionConstraintComponent-expression"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#ExpressionConstraintComponent-expression",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#expression"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Function",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Function",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL functions.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#HasValueConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Has-value constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that one of the value nodes is a given RDF node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#HasValueConstraintComponent-hasValue"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#HasValueConstraintComponent-hasValue",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#hasValue"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#IRI",
    "@type": ["https://www.w3.org/ns/shacl#NodeKind"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "IRI",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all IRIs.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#IRIOrLiteral",
    "@type": ["https://www.w3.org/ns/shacl#NodeKind"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "IRI or literal",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all IRIs or literals.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#InConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "In constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to exclusively enumerate the permitted value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#InConstraintComponent-in"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#InConstraintComponent-in",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#in"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Info",
    "@type": ["https://www.w3.org/ns/shacl#Severity"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Info",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The severity for an informational validation result.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSConstraint",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript-based constraint",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of constraints backed by a JavaScript function.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSConstraint-js",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#js"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component with the parameter sh:js linking to a sh:JSConstraint containing a sh:script.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#JSConstraint-js"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSExecutable",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript executable",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Abstract base class of resources that declare an executable JavaScript.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSFunction",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript function",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of SHACL functions that execute a JavaScript function when called.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Function"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSLibrary",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript library",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Represents a JavaScript library, typically identified by one or more URLs of files to include.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSRule",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript rule",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL rules expressed using JavaScript.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#JSExecutable"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#Rule"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSTarget",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript target",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of targets that are based on JavaScript functions.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Target"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSTargetType",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript target type",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (meta) class for parameterizable targets that are based on JavaScript functions.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#TargetType"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#JSValidator",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript validator",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A SHACL validator based on JavaScript. This can be used to declare SHACL constraint components that perform JavaScript-based validation when used.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#JSExecutable"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#Validator"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#LanguageInConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Language-in constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to enumerate language tags that all value nodes must have.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#LanguageInConstraintComponent-languageIn"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#LanguageInConstraintComponent-languageIn",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#languageIn"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#LessThanConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Less-than constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that each value node is smaller than all the nodes that have the focus node as subject and the value of a given property as predicate.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#LessThanConstraintComponent-lessThan"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#LessThanConstraintComponent-lessThan",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#lessThan"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#IRI"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#LessThanOrEqualsConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "less-than-or-equals constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that every value node is smaller than all the nodes that have the focus node as subject and the value of a given property as predicate.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#LessThanOrEqualsConstraintComponent-lessThanOrEquals"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#LessThanOrEqualsConstraintComponent-lessThanOrEquals",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#lessThanOrEquals"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#IRI"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Literal",
    "@type": ["https://www.w3.org/ns/shacl#NodeKind"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Literal",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all literals.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MaxCountConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Max-count constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the maximum number of value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#MaxCountConstraintComponent-maxCount"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MaxCountConstraintComponent-maxCount",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#maxCount"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MaxExclusiveConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Max-exclusive constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the range of value nodes with a maximum exclusive value.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#MaxExclusiveConstraintComponent-maxExclusive"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#MaxExclusiveConstraintComponent-maxExclusive",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#maxExclusive"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#Literal"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MaxInclusiveConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Max-inclusive constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the range of value nodes with a maximum inclusive value.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#MaxInclusiveConstraintComponent-maxInclusive"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#MaxInclusiveConstraintComponent-maxInclusive",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#maxInclusive"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#Literal"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MaxLengthConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Max-length constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the maximum string length of value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#MaxLengthConstraintComponent-maxLength"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MaxLengthConstraintComponent-maxLength",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#maxLength"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MinCountConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Min-count constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the minimum number of value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#MinCountConstraintComponent-minCount"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MinCountConstraintComponent-minCount",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#minCount"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MinExclusiveConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Min-exclusive constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the range of value nodes with a minimum exclusive value.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#MinExclusiveConstraintComponent-minExclusive"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#MinExclusiveConstraintComponent-minExclusive",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#minExclusive"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#Literal"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MinInclusiveConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Min-inclusive constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the range of value nodes with a minimum inclusive value.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#MinInclusiveConstraintComponent-minInclusive"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#MinInclusiveConstraintComponent-minInclusive",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#minInclusive"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "https://www.w3.org/ns/shacl#Literal"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MinLengthConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Min-length constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the minimum string length of value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#MinLengthConstraintComponent-minLength"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#MinLengthConstraintComponent-minLength",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#minLength"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#NodeConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Node constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that all value nodes conform to the given node shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#NodeConstraintComponent-node"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#NodeConstraintComponent-node",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#node"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#NodeKind",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Node kind",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of all node kinds, including sh:BlankNode, sh:IRI, sh:Literal or the combinations of these: sh:BlankNodeOrIRI, sh:BlankNodeOrLiteral, sh:IRIOrLiteral.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#NodeKindConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Node-kind constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the RDF node kind of each value node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#NodeKindConstraintComponent-nodeKind"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#NodeKindConstraintComponent-nodeKind",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#nodeKind"
      }
    ],
    "https://www.w3.org/ns/shacl#in": [
      {
        "@list": [
          {
            "@id": "https://www.w3.org/ns/shacl#BlankNode"
          },
          {
            "@id": "https://www.w3.org/ns/shacl#IRI"
          },
          {
            "@id": "https://www.w3.org/ns/shacl#Literal"
          },
          {
            "@id": "https://www.w3.org/ns/shacl#BlankNodeOrIRI"
          },
          {
            "@id": "https://www.w3.org/ns/shacl#BlankNodeOrLiteral"
          },
          {
            "@id": "https://www.w3.org/ns/shacl#IRIOrLiteral"
          }
        ]
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#NodeShape",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Node shape",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A node shape is a shape that specifies constraint that need to be met with respect to focus nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#NotConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Not constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that value nodes do not conform to a given shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#NotConstraintComponent-not"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#NotConstraintComponent-not",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#not"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#OrConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Or constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the value nodes so that they conform to at least one out of several provided shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#OrConstraintComponent-or"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#OrConstraintComponent-or",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#or"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Parameter",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Parameter",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of parameter declarations, consisting of a path predicate and (possibly) information about allowed value type, cardinality and other characteristics.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Parameterizable",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Parameterizable",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Superclass of components that can take parameters, especially functions and constraint components.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#PatternConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Pattern constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that every value node matches a given regular expression.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#PatternConstraintComponent-pattern"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#PatternConstraintComponent-flags"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#PatternConstraintComponent-flags",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#flags"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/ns/shacl#optional": [
      {
        "@value": "true",
        "@type": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#PatternConstraintComponent-pattern",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#pattern"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#PrefixDeclaration",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Prefix declaration",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of prefix declarations, consisting of pairs of a prefix with a namespace.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#PropertyConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Property constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that all value nodes conform to the given property shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#PropertyConstraintComponent-property"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#PropertyConstraintComponent-property",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#property"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#PropertyGroup",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Property group",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Instances of this class represent groups of property shapes that belong together.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#PropertyShape",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Property shape",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A property shape is a shape that specifies constraints on the values of a focus node for a given property or path.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Qualified-max-count constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that a specified maximum number of value nodes conforms to a given shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedMaxCount"
      },
      {
        "@id":
          "https://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedValueShape"
      },
      {
        "@id":
          "https://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedValueShapesDisjoint"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedMaxCount",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#qualifiedMaxCount"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedValueShape",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#qualifiedValueShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedValueShapesDisjoint",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#qualifiedValueShapesDisjoint"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/ns/shacl#optional": [
      {
        "@value": "true",
        "@type": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Qualified-min-count constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that a specified minimum number of value nodes conforms to a given shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedMinCount"
      },
      {
        "@id":
          "https://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedValueShape"
      },
      {
        "@id":
          "https://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedValueShapesDisjoint"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedMinCount",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#qualifiedMinCount"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedValueShape",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#qualifiedValueShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedValueShapesDisjoint",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#qualifiedValueShapesDisjoint"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/ns/shacl#optional": [
      {
        "@value": "true",
        "@type": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ResultAnnotation",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Result annotation",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A class of result annotations, which define the rules to derive the values of a given annotation property as extra values for a validation result.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Rule",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Rule",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL rules. Never instantiated directly.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLAskExecutable",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL ASK executable",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of SPARQL executables that are based on an ASK query.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLAskValidator",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL ASK validator",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of validators based on SPARQL ASK queries. The queries are evaluated for each value node and are supposed to return true if the given node conforms.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Validator"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLAskExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLConstraint",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL constraint",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of constraints based on SPARQL SELECT queries.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to define constraints based on SPARQL queries.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLConstraintComponent-sparql"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLConstraintComponent-sparql",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#sparql"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLConstructExecutable",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL CONSTRUCT executable",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of SPARQL executables that are based on a CONSTRUCT query.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLExecutable",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL executable",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of resources that encapsulate a SPARQL query.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLFunction",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL function",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "A function backed by a SPARQL query - either ASK or SELECT.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Function"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLAskExecutable"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLRule",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL CONSTRUCT rule",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL rules based on SPARQL CONSTRUCT queries.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Rule"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLConstructExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLSelectExecutable",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL SELECT executable",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SPARQL executables based on a SELECT query.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLSelectValidator",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL SELECT validator",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of validators based on SPARQL SELECT queries. The queries are evaluated for each focus node and are supposed to produce bindings for all focus nodes that do not conform.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Validator"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLTarget",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL target",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of targets that are based on SPARQL queries.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Target"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLAskExecutable"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLTargetType",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL target type",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (meta) class for parameterizable targets that are based on SPARQL queries.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#TargetType"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLAskExecutable"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#SPARQLUpdateExecutable",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL UPDATE executable",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SPARQL executables based on a SPARQL UPDATE.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Severity",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Severity",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of validation result severity levels, including violation and warning levels.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Shape",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Shape",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A shape is a collection of constraints that may be targeted for certain nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Target",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Target",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The base class of targets such as those based on SPARQL queries.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#TargetType",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Target type",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (meta) class for parameterizable targets.\tInstances of this are instantiated as values of the sh:target property.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Class"
      },
      {
        "@id": "https://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#TripleRule",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value":
          "A rule based on triple (subject, predicate, object) pattern.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#Rule"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#UniqueLangConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Unique-languages constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to specify that no pair of value nodes may use the same language tag.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "https://www.w3.org/ns/shacl#UniqueLangConstraintComponent-uniqueLang"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "https://www.w3.org/ns/shacl#UniqueLangConstraintComponent-uniqueLang",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#uniqueLang"
      }
    ],
    "https://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": "1",
        "@type": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ValidationReport",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Validation report",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL validation reports.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ValidationResult",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Validation result",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of validation results.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Validator",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Class"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Validator",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of validators, which provide instructions on how to process a constraint definition. This class serves as base class for the SPARQL-based validators and other possible implementations.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Violation",
    "@type": ["https://www.w3.org/ns/shacl#Severity"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Violation",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The severity for a violation validation result.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#Warning",
    "@type": ["https://www.w3.org/ns/shacl#Severity"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Warning",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The severity for a warning validation result.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#XoneConstraintComponent",
    "@type": ["https://www.w3.org/ns/shacl#ConstraintComponent"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Exactly one constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the value nodes so that they conform to exactly one out of several provided shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "https://www.w3.org/ns/shacl#XoneConstraintComponent-xone"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#XoneConstraintComponent-xone",
    "@type": ["https://www.w3.org/ns/shacl#Parameter"],
    "https://www.w3.org/ns/shacl#path": [
      {
        "@id": "https://www.w3.org/ns/shacl#xone"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#alternativePath",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "alternative path",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property must be a list of path elements, representing the elements of alternative paths.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#and",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "and",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "RDF list of shapes to validate the value nodes against.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#annotationProperty",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "annotation property",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The annotation property that shall be set.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#ResultAnnotation"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#annotationValue",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "annotation value",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The (default) values of the annotation property.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#ResultAnnotation"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#annotationVarName",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "annotation variable name",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The name of the SPARQL variable from the SELECT clause that shall be used for the values.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#ResultAnnotation"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ask",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "ask",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The SPARQL ASK query to execute.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLAskExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#class",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "class",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The type that all value nodes must have.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Class"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#closed",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "closed",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "If set to true then the shape is closed.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#condition",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "condition",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The shapes that the focus nodes need to conform to before a rule is executed on them.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Rule"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#conforms",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "conforms",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "True if the validation did not produce any validation results, and false otherwise.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#ValidationReport"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#construct",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "construct",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The SPARQL CONSTRUCT query to execute.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLConstructExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#datatype",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "datatype",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies an RDF datatype that all value nodes must have.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Datatype"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#deactivated",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "deactivated",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "If set to true then all nodes conform to this.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#declare",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "declare",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Links a resource with its namespace prefix declarations.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#PrefixDeclaration"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#defaultValue",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "default value",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A default value for a property, for example for user interface tools to pre-populate input fields.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#description",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "description",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Human-readable descriptions for the property in the context of the surrounding shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#detail",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "detail",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a result with other results that provide more details, for example to describe violations against nested shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#disjoint",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "disjoint",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a property where the set of values must be disjoint with the value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#entailment",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "entailment",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An entailment regime that indicates what kind of inferencing is required by a shapes graph.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#equals",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "equals",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a property that must have the same values as the value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#expression",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "expression",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The node expression that must return true for the value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#filterShape",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "filter shape",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The shape that all input nodes of the expression need to conform to.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#flags",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "flags",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An optional flag to be used with regular expression pattern matching.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#focusNode",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "focus node",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The focus node that was validated when the result was produced.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#group",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "group",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Can be used to link to a property group to indicate that a property shape belongs to a group of related property shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#PropertyGroup"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#hasValue",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "has value",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies a value that must be among the value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#ignoredProperties",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "ignored properties",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An optional RDF list of properties that are also permitted in addition to those explicitly enumerated via sh:property/sh:path.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#in",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "in",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a list of allowed values so that each value node must be among the members of the given list.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#intersection",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "intersection",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "A list of node expressions that shall be intersected.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#inversePath",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "inverse path",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property represents an inverse path (object to subject).",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#js",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript constraint",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Constraints expressed in JavaScript."
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#JSConstraint"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#jsFunctionName",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript function name",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The name of the JavaScript function to execute.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#jsLibrary",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript library",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Declares which JavaScript libraries are needed to execute this.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#JSLibrary"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#jsLibraryURL",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript library URL",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Declares the URLs of a JavaScript library. This should be the absolute URL of a JavaScript file. Implementations may redirect those to local files.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#JSLibrary"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#anyURI"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#labelTemplate",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "label template",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Outlines how human-readable labels of instances of the associated Parameterizable shall be produced. The values can contain {?paramName} as placeholders for the actual values of the given parameter.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#languageIn",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "language in",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a list of language tags that all value nodes must have.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#lessThan",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "less than",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a property that must have smaller values than the value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#lessThanOrEquals",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "less than or equals",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a property that must have smaller or equal values than the value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#maxCount",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "max count",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the maximum number of values in the set of value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#maxExclusive",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "max exclusive",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the maximum exclusive value of each value node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#maxInclusive",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "max inclusive",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the maximum inclusive value of each value node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#maxLength",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "max length",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the maximum string length of each value node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#message",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "message",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A human-readable message (possibly with placeholders for variables) explaining the cause of the result.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#minCount",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "min count",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the minimum number of values in the set of value nodes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#minExclusive",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "min exclusive",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the minimum exclusive value of each value node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#minInclusive",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "min inclusive",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the minimum inclusive value of each value node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#minLength",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "min length",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the minimum string length of each value node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#name",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "name",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Human-readable labels for the property in the context of the surrounding shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#namespace",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "namespace",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The namespace associated with a prefix in a prefix declaration.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#PrefixDeclaration"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#anyURI"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#node",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "node",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the node shape that all value nodes must conform to.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#NodeShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#nodeKind",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "node kind",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the node kind (e.g. IRI or literal) each value node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#NodeKind"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#nodeValidator",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "shape validator",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The validator(s) used to evaluate a constraint in the context of a node shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#ConstraintComponent"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Validator"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#nodes",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "nodes",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The node expression producing the input nodes of a filter shape expression.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#not",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "not",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies a shape that the value nodes must not conform to.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#object",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "object",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An expression producing the nodes that shall be inferred as objects.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#TripleRule"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#oneOrMorePath",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "one or more path",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property represents a path that is matched one or more times.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#optional",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "optional",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Indicates whether a parameter is optional.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Parameter"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#or",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "or",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a list of shapes so that the value nodes must conform to at least one of the shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#order",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "order",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the relative order of this compared to its siblings. For example use 0 for the first, 1 for the second.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#parameter",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "parameter",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The parameters of a function or constraint component.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Parameter"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#path",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "path",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the property path of a property shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#pattern",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "pattern",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a regular expression pattern that the string representations of the value nodes must match.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#predicate",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "predicate",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An expression producing the properties that shall be inferred as predicates.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#TripleRule"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#prefix",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "prefix",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The prefix of a prefix declaration.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#PrefixDeclaration"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#prefixes",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "prefixes",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The prefixes that shall be applied before parsing the associated SPARQL query.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#property",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "property",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Links a shape to its property shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#propertyValidator",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "property validator",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The validator(s) used to evaluate a constraint in the context of a property shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#ConstraintComponent"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Validator"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#qualifiedMaxCount",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "qualified max count",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The maximum number of value nodes that can conform to the shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#qualifiedMinCount",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "qualified min count",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The minimum number of value nodes that must conform to the shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#qualifiedValueShape",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "qualified value shape",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The shape that a specified number of values must conform to.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#qualifiedValueShapesDisjoint",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "qualified value shapes disjoint",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Can be used to mark the qualified value shape to be disjoint with its sibling shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#result",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The validation results contained in a validation report.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#ValidationReport"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#ValidationResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#resultAnnotation",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result annotation",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a SPARQL validator with zero or more sh:ResultAnnotation instances, defining how to derive additional result properties based on the variables of the SELECT query.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLSelectValidator"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#ResultAnnotation"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#resultMessage",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result message",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Human-readable messages explaining the cause of the result.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#resultPath",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result path",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The path of a validation result, based on the path of the validated property shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#resultSeverity",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result severity",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The severity of the result, e.g. warning.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Severity"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#returnType",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "return type",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The expected type of values returned by the associated function.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Function"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Class"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#rule",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "rule",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The rules linked to a shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Rule"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#select",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "select",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The SPARQL SELECT query to execute.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#severity",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "severity",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Defines the severity that validation results produced by a shape must have. Defaults to sh:Violation.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Severity"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#shapesGraph",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "shapes graph",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Shapes graphs that should be used when validating this data graph.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#shapesGraphWellFormed",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "shapes graph well-formed",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "If true then the validation engine was certain that the shapes graph has passed all SHACL syntax requirements during the validation process.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#ValidationReport"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#sourceConstraint",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "source constraint",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The constraint that was validated when the result was produced.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#sourceConstraintComponent",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "source constraint component",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The constraint component that is the source of the result.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#ConstraintComponent"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#sourceShape",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "source shape",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The shape that is was validated when the result was produced.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#sparql",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "constraint (in SPARQL)",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Links a shape with SPARQL constraints.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLConstraint"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#subject",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "subject",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An expression producing the resources that shall be inferred as subjects.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#TripleRule"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#suggestedShapesGraph",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "suggested shapes graph",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Suggested shapes graphs for this ontology. The values of this property may be used in the absence of specific sh:shapesGraph statements.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#target",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to a target specified by an extension language, for example instances of sh:SPARQLTarget.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Target"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#targetClass",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target class",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to a class, indicating that all instances of the class must conform to the shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Class"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#targetNode",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target node",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to individual nodes, indicating that these nodes must conform to the shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#targetObjectsOf",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target objects of",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to a property, indicating that all all objects of triples that have the given property as their predicate must conform to the shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#targetSubjectsOf",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target subjects of",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to a property, indicating that all subjects of triples that have the given property as their predicate must conform to the shape.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#Shape"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#this",
    "@type": ["https://www.w3.org/2000/01/rdf-schema#Resource"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "this",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "A node expression that represents the current focus node.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#union",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "union",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "A list of node expressions that shall be used together.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#uniqueLang",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "unique languages",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies whether all node values must have a unique (or no) language tag.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#update",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "update",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The SPARQL UPDATE to execute.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#SPARQLUpdateExecutable"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#validator",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "validator",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The validator(s) used to evaluate constraints of either node or property shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#ConstraintComponent"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/ns/shacl#Validator"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#value",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "value",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "An RDF node that has caused the result.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "https://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#xone",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "exactly one",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a list of shapes so that the value nodes must conform to exactly one of the shapes.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#zeroOrMorePath",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "zero or more path",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property represents a path that is matched zero or more times.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "https://www.w3.org/ns/shacl#zeroOrOnePath",
    "@type": ["https://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "https://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "zero or one path",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property represents a path that is matched zero or one times.",
        "@language": "en"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "https://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "https://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "https://www.w3.org/ns/shacl#"
      }
    ]
  }
];

export { shacl as default };
