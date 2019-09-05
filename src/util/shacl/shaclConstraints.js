import ShaclTranslator from "../../translation/shaclTranslator";
import { uriToPrefix } from "../urlParser";

getReady;
const initialConstraints = [];
let getReady = function() {
  // Filters through vocabulary file to find all the constraints and then maps them into clean objects

  json.forEach(obj => {
    if (obj["@type"] === "http://www.w3.org/ns/shacl#ConstraintComponent") {
      initialConstraints.push(simplifyCons(obj));
    }
  });

  // Filters through the vocabulary to find all parameters and links the parameters to corresponding constraints
  json.forEach(obj => {
    if (obj["@type"] === "http://www.w3.org/ns/shacl#Parameter") {
      simplifyParameter(obj);
    }
  });
};

function simplifyCons(obj) {
  const constraint = {};
  constraint.comment = obj[
    "http://www.w3.org/2000/01/rdf-schema#comment"
  ].shift()["@value"];
  constraint.definedby = obj[
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy"
  ].shift()["@id"];
  constraint.label = obj["http://www.w3.org/2000/01/rdf-schema#label"].shift()[
    "@value"
  ];
  constraint.parameter = obj["http://www.w3.org/ns/shacl#parameter"].shift()[
    "@id"
  ];
  return constraint;
}

function simplifyParameter(obj) {
  const parameter = {};
  const constraint = initialConstraints
    .filter(constraint => constraint.parameter === obj["@id"])
    .shift();
  parameter.definedby = obj[
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy"
  ].shift()["@id"];
  parameter.path = obj["http://www.w3.org/ns/shacl#path"].shift()["@id"];
  parameter.optional = !obj["http://www.w3.org/ns/shacl#optional"];
  parameter.datatype = obj["http://www.w3.org/ns/shacl#datatype"]
    ? obj["http://www.w3.org/ns/shacl#datatype"].shift()["@id"]
    : null;
  if (constraint) constraint.parameter = parameter;
}

/**
 * Group the given dictionary of objects by the given key.
 * @param xs
 * @param key
 * @returns {*}
 */
function groupBy(xs, key) {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

// These are the constraints with the type added manually
const constraintsWithTypes = [
  {
    type: "Logical Constraints",
    comment:
      "A constraint component that can be used to test whether a value node conforms to all members of a provided list of shapes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "And constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#and",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Value Type Constraints",
    comment:
      "A constraint component that can be used to verify that each value node is an instance of a given type.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Class constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#class",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Other Constraints",
    comment:
      "A constraint component that can be used to indicate that focus nodes must only have values for those properties that have been explicitly enumerated via sh:property/sh:path.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Closed constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#closed",
      optional: "true",
      datatype: "http://www.w3.org/2001/XMLSchema#boolean"
    }
  },
  {
    type: "Value Type Constraints",
    comment:
      "A constraint component that can be used to restrict the datatype of all value nodes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Datatype constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#datatype",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Property Pair Constraints",
    comment:
      "A constraint component that can be used to verify that the set of value nodes is disjoint with the the set of nodes that have the focus node as subject and the value of a given property as predicate.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Disjoint constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#disjoint",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Property Pair Constraints",
    comment:
      "A constraint component that can be used to verify that the set of value nodes is equal to the set of nodes that have the focus node as subject and the value of a given property as predicate.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Equals constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#equals",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Shape-Based Constraints",
    comment:
      "A constraint component that can be used to verify that a given node expression produces true for all value nodes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Expression constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#expression",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Other Constraints",
    comment:
      "A constraint component that can be used to verify that one of the value nodes is a given RDF node.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Has-value constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#hasValue",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Other Constraints",
    comment:
      "A constraint component that can be used to exclusively enumerate the permitted value nodes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "In constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#in",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "String-Based Constraints",
    comment:
      "A constraint component that can be used to enumerate language tags that all value nodes must have.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Language-in constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#languageIn",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Property Pair Constraints",
    comment:
      "A constraint component that can be used to verify that each value node is smaller than all the nodes that have the focus node as subject and the value of a given property as predicate.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Less-than constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#lessThan",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Property Pair Constraints",
    comment:
      "A constraint component that can be used to verify that every value node is smaller than all the nodes that have the focus node as subject and the value of a given property as predicate.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "less-than-or-equals constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#lessThanOrEquals",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Cardinality Constraints",
    comment:
      "A constraint component that can be used to restrict the maximum number of value nodes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Max-count constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#maxCount",
      optional: "true",
      datatype: "http://www.w3.org/2001/XMLSchema#integer"
    }
  },
  {
    type: "Value Range Constraints",
    comment:
      "A constraint component that can be used to restrict the range of value nodes with a maximum exclusive value.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Max-exclusive constraints",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#maxExclusive",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Value Range Constraints",
    comment:
      "A constraint component that can be used to restrict the range of value nodes with a maximum inclusive value.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Max-inclusive constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#maxInclusive",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "String-Based Constraints",
    comment:
      "A constraint component that can be used to restrict the maximum string length of value nodes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Max-length constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#maxLength",
      optional: "true",
      datatype: "http://www.w3.org/2001/XMLSchema#integer"
    }
  },
  {
    type: "Cardinality Constraints",
    comment:
      "A constraint component that can be used to restrict the minimum number of value nodes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Min-count constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#minCount",
      optional: "true",
      datatype: "http://www.w3.org/2001/XMLSchema#integer"
    }
  },
  {
    type: "Value Range Constraints",
    comment:
      "A constraint component that can be used to restrict the range of value nodes with a minimum exclusive value.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Min-exclusive constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#minExclusive",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Value Range Constraints",
    comment:
      "A constraint component that can be used to restrict the range of value nodes with a minimum inclusive value.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Min-inclusive constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#minInclusive",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "String-Based Constraints",
    comment:
      "A constraint component that can be used to restrict the minimum string length of value nodes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Min-length constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#minLength",
      optional: "true",
      datatype: "http://www.w3.org/2001/XMLSchema#integer"
    }
  },
  {
    type: "Shape-Based Constraints",
    comment:
      "A constraint component that can be used to verify that all value nodes conform to the given node shape.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Node constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#node",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Value Type Constraints",
    comment:
      "A constraint component that can be used to restrict the RDF node kind of each value node.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Node-kind constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#nodeKind",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Logical Constraints",
    comment:
      "A constraint component that can be used to verify that value nodes do not conform to a given shape.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Not constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#not",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Logical Constraints",
    comment:
      "A constraint component that can be used to restrict the value nodes so that they conform to at least one out of several provided shapes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Or constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#or",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "String-Based Constraints",
    comment:
      "A constraint component that can be used to verify that every value node matches a given regular expression.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Pattern constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#pattern",
      optional: "true",
      datatype: "http://www.w3.org/2001/XMLSchema#string"
    }
  },
  {
    type: "Shape-Based Constraints",
    comment:
      "A constraint component that can be used to verify that all value nodes conform to the given property shape.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Property constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#property",
      optional: "true",
      datatype: null
    }
  },
  {
    type: "Shape-Based Constraints",
    comment:
      "A constraint component that can be used to verify that a specified maximum number of value nodes conforms to a given shape.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Qualified-max-count constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#qualifiedMaxCount",
      optional: "true",
      datatype: "http://www.w3.org/2001/XMLSchema#integer"
    }
  },
  {
    type: "Shape-Based Constraints",
    comment:
      "A constraint component that can be used to verify that a specified minimum number of value nodes conforms to a given shape.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Qualified-min-count constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#qualifiedMinCount",
      optional: "true",
      datatype: "http://www.w3.org/2001/XMLSchema#integer"
    }
  },
  {
    type: "String-Based Constraints",
    comment:
      "A constraint component that can be used to specify that no pair of value nodes may use the same language tag.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Unique-languages constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#uniqueLang",
      optional: "true",
      datatype: "http://www.w3.org/2001/XMLSchema#boolean"
    }
  },
  {
    type: "Logical Constraints",
    comment:
      "A constraint component that can be used to restrict the value nodes so that they conform to exactly one out of several provided shapes.",
    definedby: "http://www.w3.org/ns/shacl#",
    label: "Exactly one constraint component",
    parameter: {
      definedby: "http://www.w3.org/ns/shacl#",
      path: "http://www.w3.org/ns/shacl#xone",
      optional: "true",
      datatype: null
    }
  }
];

const json = [
  {
    "@id": "_:b0",
    "http://www.w3.org/ns/shacl#prefix": [
      {
        "@value": "sh"
      }
    ],
    "http://www.w3.org/ns/shacl#namespace": [
      {
        "@value": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "_:b1",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#first": [
      {
        "@id": "http://www.w3.org/ns/shacl#BlankNode"
      }
    ],
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest": [
      {
        "@id": "_:b2"
      }
    ]
  },
  {
    "@id": "_:b2",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#first": [
      {
        "@id": "http://www.w3.org/ns/shacl#IRI"
      }
    ],
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest": [
      {
        "@id": "_:b3"
      }
    ]
  },
  {
    "@id": "_:b3",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#first": [
      {
        "@id": "http://www.w3.org/ns/shacl#Literal"
      }
    ],
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest": [
      {
        "@id": "_:b4"
      }
    ]
  },
  {
    "@id": "_:b4",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#first": [
      {
        "@id": "http://www.w3.org/ns/shacl#BlankNodeOrIRI"
      }
    ],
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest": [
      {
        "@id": "_:b5"
      }
    ]
  },
  {
    "@id": "_:b5",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#first": [
      {
        "@id": "http://www.w3.org/ns/shacl#BlankNodeOrLiteral"
      }
    ],
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest": [
      {
        "@id": "_:b6"
      }
    ]
  },
  {
    "@id": "_:b6",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#first": [
      {
        "@id": "http://www.w3.org/ns/shacl#IRIOrLiteral"
      }
    ],
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
  },
  {
    "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
  },
  {
    "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"
  },
  {
    "@id": "http://www.w3.org/2000/01/rdf-schema#Class"
  },
  {
    "@id": "http://www.w3.org/2000/01/rdf-schema#Datatype"
  },
  {
    "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
  },
  {
    "@id": "http://www.w3.org/2001/XMLSchema#anyURI"
  },
  {
    "@id": "http://www.w3.org/2001/XMLSchema#boolean"
  },
  {
    "@id": "http://www.w3.org/2001/XMLSchema#integer"
  },
  {
    "@id": "http://www.w3.org/2001/XMLSchema#string"
  },
  {
    "@id": "http://www.w3.org/2002/07/owl#Ontology"
  },
  {
    "@id": "http://www.w3.org/ns/shacl#",
    "@type": ["http://www.w3.org/2002/07/owl#Ontology"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "W3C Shapes Constraint Language (SHACL) Vocabulary",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "This vocabulary defines terms used in SHACL, the W3C Shapes Constraint Language.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#declare": [
      {
        "@id": "_:b0"
      }
    ],
    "http://www.w3.org/ns/shacl#suggestedShapesGraph": [
      {
        "@id": "http://www.w3.org/ns/shacl-shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#AbstractResult",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Abstract result",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The base class of validation results, typically not instantiated directly.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#AndConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "And constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to test whether a value node conforms to all members of a provided list of shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#AndConstraintComponent-and"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#AndConstraintComponent-and",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#and"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#BlankNode",
    "@type": ["http://www.w3.org/ns/shacl#NodeKind"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Blank node",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all blank nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#BlankNodeOrIRI",
    "@type": ["http://www.w3.org/ns/shacl#NodeKind"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Blank node or IRI",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all blank nodes or IRIs.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#BlankNodeOrLiteral",
    "@type": ["http://www.w3.org/ns/shacl#NodeKind"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Blank node or literal",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all blank nodes or literals.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ClassConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Class constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that each value node is an instance of a given type.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#ClassConstraintComponent-class"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ClassConstraintComponent-class",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#class"
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#IRI"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ClosedConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Closed constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to indicate that focus nodes must only have values for those properties that have been explicitly enumerated via sh:property/sh:path.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#ClosedConstraintComponent-closed"
      },
      {
        "@id":
          "http://www.w3.org/ns/shacl#ClosedConstraintComponent-ignoredProperties"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ClosedConstraintComponent-closed",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#closed"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#ClosedConstraintComponent-ignoredProperties",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#ignoredProperties"
      }
    ],
    "http://www.w3.org/ns/shacl#optional": [
      {
        "@value": true
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ConstraintComponent",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of constraint components.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#DatatypeConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Datatype constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the datatype of all value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#DatatypeConstraintComponent-datatype"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#DatatypeConstraintComponent-datatype",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#datatype"
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#IRI"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#DisjointConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Disjoint constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that the set of value nodes is disjoint with the the set of nodes that have the focus node as subject and the value of a given property as predicate.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#DisjointConstraintComponent-disjoint"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#DisjointConstraintComponent-disjoint",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#disjoint"
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#IRI"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#EqualsConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Equals constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that the set of value nodes is equal to the set of nodes that have the focus node as subject and the value of a given property as predicate.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#EqualsConstraintComponent-equals"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#EqualsConstraintComponent-equals",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#equals"
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#IRI"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ExpressionConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Expression constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that a given node expression produces true for all value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#ExpressionConstraintComponent-expression"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#ExpressionConstraintComponent-expression",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#expression"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Function",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Function",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL functions.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#HasValueConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Has-value constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that one of the value nodes is a given RDF node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#HasValueConstraintComponent-hasValue"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#HasValueConstraintComponent-hasValue",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#hasValue"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#IRI",
    "@type": ["http://www.w3.org/ns/shacl#NodeKind"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "IRI",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all IRIs.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#IRIOrLiteral",
    "@type": ["http://www.w3.org/ns/shacl#NodeKind"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "IRI or literal",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all IRIs or literals.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#InConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "In constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to exclusively enumerate the permitted value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#InConstraintComponent-in"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#InConstraintComponent-in",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#in"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Info",
    "@type": ["http://www.w3.org/ns/shacl#Severity"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Info",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The severity for an informational validation result.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSConstraint",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript-based constraint",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of constraints backed by a JavaScript function.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSConstraint-js",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#js"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component with the parameter sh:js linking to a sh:JSConstraint containing a sh:script.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#JSConstraint-js"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSExecutable",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript executable",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Abstract base class of resources that declare an executable JavaScript.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSFunction",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript function",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of SHACL functions that execute a JavaScript function when called.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Function"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSLibrary",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript library",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Represents a JavaScript library, typically identified by one or more URLs of files to include.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSRule",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript rule",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL rules expressed using JavaScript.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#JSExecutable"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#Rule"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSTarget",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript target",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of targets that are based on JavaScript functions.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Target"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSTargetType",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript target type",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (meta) class for parameterizable targets that are based on JavaScript functions.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#TargetType"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#JSValidator",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript validator",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A SHACL validator based on JavaScript. This can be used to declare SHACL constraint components that perform JavaScript-based validation when used.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#JSExecutable"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#Validator"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#LanguageInConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Language-in constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to enumerate language tags that all value nodes must have.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#LanguageInConstraintComponent-languageIn"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#LanguageInConstraintComponent-languageIn",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#languageIn"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#LessThanConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Less-than constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that each value node is smaller than all the nodes that have the focus node as subject and the value of a given property as predicate.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#LessThanConstraintComponent-lessThan"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#LessThanConstraintComponent-lessThan",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#lessThan"
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#IRI"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#LessThanOrEqualsConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "less-than-or-equals constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that every value node is smaller than all the nodes that have the focus node as subject and the value of a given property as predicate.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#LessThanOrEqualsConstraintComponent-lessThanOrEquals"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#LessThanOrEqualsConstraintComponent-lessThanOrEquals",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#lessThanOrEquals"
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#IRI"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Literal",
    "@type": ["http://www.w3.org/ns/shacl#NodeKind"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Literal",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The node kind of all literals.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MaxCountConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Max-count constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the maximum number of value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#MaxCountConstraintComponent-maxCount"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MaxCountConstraintComponent-maxCount",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#maxCount"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MaxExclusiveConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Max-exclusive constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the range of value nodes with a maximum exclusive value.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#MaxExclusiveConstraintComponent-maxExclusive"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#MaxExclusiveConstraintComponent-maxExclusive",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#maxExclusive"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#Literal"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MaxInclusiveConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Max-inclusive constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the range of value nodes with a maximum inclusive value.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#MaxInclusiveConstraintComponent-maxInclusive"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#MaxInclusiveConstraintComponent-maxInclusive",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#maxInclusive"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#Literal"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MaxLengthConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Max-length constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the maximum string length of value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#MaxLengthConstraintComponent-maxLength"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MaxLengthConstraintComponent-maxLength",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#maxLength"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MinCountConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Min-count constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the minimum number of value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#MinCountConstraintComponent-minCount"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MinCountConstraintComponent-minCount",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#minCount"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MinExclusiveConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Min-exclusive constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the range of value nodes with a minimum exclusive value.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#MinExclusiveConstraintComponent-minExclusive"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#MinExclusiveConstraintComponent-minExclusive",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#minExclusive"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#Literal"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MinInclusiveConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Min-inclusive constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the range of value nodes with a minimum inclusive value.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#MinInclusiveConstraintComponent-minInclusive"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#MinInclusiveConstraintComponent-minInclusive",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#minInclusive"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/ns/shacl#nodeKind": [
      {
        "@id": "http://www.w3.org/ns/shacl#Literal"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MinLengthConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Min-length constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the minimum string length of value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#MinLengthConstraintComponent-minLength"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#MinLengthConstraintComponent-minLength",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#minLength"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#NodeConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Node constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that all value nodes conform to the given node shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#NodeConstraintComponent-node"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#NodeConstraintComponent-node",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#node"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#NodeKind",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Node kind",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of all node kinds, including sh:BlankNode, sh:IRI, sh:Literal or the combinations of these: sh:BlankNodeOrIRI, sh:BlankNodeOrLiteral, sh:IRIOrLiteral.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#NodeKindConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Node-kind constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the RDF node kind of each value node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#NodeKindConstraintComponent-nodeKind"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#NodeKindConstraintComponent-nodeKind",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#nodeKind"
      }
    ],
    "http://www.w3.org/ns/shacl#in": [
      {
        "@id": "_:b1"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#NodeShape",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Node shape",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A node shape is a shape that specifies constraint that need to be met with respect to focus nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#NotConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Not constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that value nodes do not conform to a given shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#NotConstraintComponent-not"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#NotConstraintComponent-not",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#not"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#OrConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Or constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the value nodes so that they conform to at least one out of several provided shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#OrConstraintComponent-or"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#OrConstraintComponent-or",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#or"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Parameter",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Parameter",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of parameter declarations, consisting of a path predicate and (possibly) information about allowed value type, cardinality and other characteristics.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Parameterizable",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Parameterizable",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Superclass of components that can take parameters, especially functions and constraint components.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#PatternConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Pattern constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that every value node matches a given regular expression.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#PatternConstraintComponent-pattern"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#PatternConstraintComponent-flags"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#PatternConstraintComponent-flags",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#flags"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/ns/shacl#optional": [
      {
        "@value": true
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#PatternConstraintComponent-pattern",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#pattern"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#PrefixDeclaration",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Prefix declaration",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of prefix declarations, consisting of pairs of a prefix with a namespace.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#PropertyConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Property constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that all value nodes conform to the given property shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#PropertyConstraintComponent-property"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#PropertyConstraintComponent-property",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#property"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#PropertyGroup",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Property group",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Instances of this class represent groups of property shapes that belong together.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#PropertyShape",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Property shape",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A property shape is a shape that specifies constraints on the values of a focus node for a given property or path.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Qualified-max-count constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that a specified maximum number of value nodes conforms to a given shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedMaxCount"
      },
      {
        "@id":
          "http://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedValueShape"
      },
      {
        "@id":
          "http://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedValueShapesDisjoint"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedMaxCount",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#qualifiedMaxCount"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedValueShape",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#qualifiedValueShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#QualifiedMaxCountConstraintComponent-qualifiedValueShapesDisjoint",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#qualifiedValueShapesDisjoint"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/ns/shacl#optional": [
      {
        "@value": true
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Qualified-min-count constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to verify that a specified minimum number of value nodes conforms to a given shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedMinCount"
      },
      {
        "@id":
          "http://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedValueShape"
      },
      {
        "@id":
          "http://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedValueShapesDisjoint"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedMinCount",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#qualifiedMinCount"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedValueShape",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#qualifiedValueShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#QualifiedMinCountConstraintComponent-qualifiedValueShapesDisjoint",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#qualifiedValueShapesDisjoint"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/ns/shacl#optional": [
      {
        "@value": true
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ResultAnnotation",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Result annotation",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A class of result annotations, which define the rules to derive the values of a given annotation property as extra values for a validation result.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Rule",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Rule",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL rules. Never instantiated directly.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLAskExecutable",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL ASK executable",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of SPARQL executables that are based on an ASK query.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLAskValidator",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL ASK validator",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of validators based on SPARQL ASK queries. The queries are evaluated for each value node and are supposed to return true if the given node conforms.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Validator"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLAskExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLConstraint",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL constraint",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of constraints based on SPARQL SELECT queries.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to define constraints based on SPARQL queries.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLConstraintComponent-sparql"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLConstraintComponent-sparql",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#sparql"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLConstructExecutable",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL CONSTRUCT executable",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of SPARQL executables that are based on a CONSTRUCT query.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLExecutable",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL executable",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of resources that encapsulate a SPARQL query.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLFunction",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL function",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "A function backed by a SPARQL query - either ASK or SELECT.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Function"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLAskExecutable"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLRule",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL CONSTRUCT rule",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL rules based on SPARQL CONSTRUCT queries.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Rule"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLConstructExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLSelectExecutable",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL SELECT executable",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SPARQL executables based on a SELECT query.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLSelectValidator",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL SELECT validator",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of validators based on SPARQL SELECT queries. The queries are evaluated for each focus node and are supposed to produce bindings for all focus nodes that do not conform.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Validator"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLTarget",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL target",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of targets that are based on SPARQL queries.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Target"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLAskExecutable"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLTargetType",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL target type",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (meta) class for parameterizable targets that are based on SPARQL queries.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#TargetType"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLAskExecutable"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#SPARQLUpdateExecutable",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "SPARQL UPDATE executable",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SPARQL executables based on a SPARQL UPDATE.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Severity",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Severity",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of validation result severity levels, including violation and warning levels.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Shape",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Shape",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A shape is a collection of constraints that may be targeted for certain nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Target",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Target",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The base class of targets such as those based on SPARQL queries.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#TargetType",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Target type",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (meta) class for parameterizable targets.\tInstances of this are instantiated as values of the sh:target property.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Class"
      },
      {
        "@id": "http://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#TripleRule",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value":
          "A rule based on triple (subject, predicate, object) pattern.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#Rule"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#UniqueLangConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Unique-languages constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to specify that no pair of value nodes may use the same language tag.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id":
          "http://www.w3.org/ns/shacl#UniqueLangConstraintComponent-uniqueLang"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id":
      "http://www.w3.org/ns/shacl#UniqueLangConstraintComponent-uniqueLang",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#uniqueLang"
      }
    ],
    "http://www.w3.org/ns/shacl#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/ns/shacl#maxCount": [
      {
        "@value": 1
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ValidationReport",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Validation report",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of SHACL validation reports.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ValidationResult",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Validation result",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The class of validation results.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Validator",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Class"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Validator",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The class of validators, which provide instructions on how to process a constraint definition. This class serves as base class for the SPARQL-based validators and other possible implementations.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Violation",
    "@type": ["http://www.w3.org/ns/shacl#Severity"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Violation",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The severity for a violation validation result.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#Warning",
    "@type": ["http://www.w3.org/ns/shacl#Severity"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Warning",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The severity for a warning validation result.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#XoneConstraintComponent",
    "@type": ["http://www.w3.org/ns/shacl#ConstraintComponent"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "Exactly one constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A constraint component that can be used to restrict the value nodes so that they conform to exactly one out of several provided shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/ns/shacl#parameter": [
      {
        "@id": "http://www.w3.org/ns/shacl#XoneConstraintComponent-xone"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#XoneConstraintComponent-xone",
    "@type": ["http://www.w3.org/ns/shacl#Parameter"],
    "http://www.w3.org/ns/shacl#path": [
      {
        "@id": "http://www.w3.org/ns/shacl#xone"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },

  {
    "@id": "http://www.w3.org/ns/shacl#alternativePath",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "alternative path",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property must be a list of path elements, representing the elements of alternative paths.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#and",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "and",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "RDF list of shapes to validate the value nodes against.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#annotationProperty",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "annotation property",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The annotation property that shall be set.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#ResultAnnotation"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#annotationValue",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "annotation value",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The (default) values of the annotation property.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#ResultAnnotation"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#annotationVarName",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "annotation variable name",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The name of the SPARQL variable from the SELECT clause that shall be used for the values.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#ResultAnnotation"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ask",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "ask",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The SPARQL ASK query to execute.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLAskExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#class",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "class",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The type that all value nodes must have.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Class"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#closed",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "closed",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "If set to true then the shape is closed.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#condition",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "condition",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The shapes that the focus nodes need to conform to before a rule is executed on them.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Rule"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#conforms",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "conforms",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "True if the validation did not produce any validation results, and false otherwise.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#ValidationReport"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#construct",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "construct",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The SPARQL CONSTRUCT query to execute.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLConstructExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#datatype",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "datatype",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies an RDF datatype that all value nodes must have.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Datatype"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#deactivated",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "deactivated",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "If set to true then all nodes conform to this.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#declare",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "declare",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Links a resource with its namespace prefix declarations.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#PrefixDeclaration"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#defaultValue",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "default value",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A default value for a property, for example for user interface tools to pre-populate input fields.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#description",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "description",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Human-readable descriptions for the property in the context of the surrounding shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#detail",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "detail",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a result with other results that provide more details, for example to describe violations against nested shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#disjoint",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "disjoint",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a property where the set of values must be disjoint with the value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#entailment",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "entailment",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An entailment regime that indicates what kind of inferencing is required by a shapes graph.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#equals",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "equals",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a property that must have the same values as the value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#expression",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "expression",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The node expression that must return true for the value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#filterShape",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "filter shape",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The shape that all input nodes of the expression need to conform to.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#flags",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "flags",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An optional flag to be used with regular expression pattern matching.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#focusNode",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "focus node",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The focus node that was validated when the result was produced.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#group",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "group",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Can be used to link to a property group to indicate that a property shape belongs to a group of related property shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#PropertyGroup"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#hasValue",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "has value",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies a value that must be among the value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#ignoredProperties",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "ignored properties",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An optional RDF list of properties that are also permitted in addition to those explicitly enumerated via sh:property/sh:path.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#in",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "in",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a list of allowed values so that each value node must be among the members of the given list.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#intersection",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "intersection",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "A list of node expressions that shall be intersected.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#inversePath",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "inverse path",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property represents an inverse path (object to subject).",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#js",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript constraint",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Constraints expressed in JavaScript."
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#JSConstraint"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#jsFunctionName",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript function name",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The name of the JavaScript function to execute.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#JSExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#jsLibrary",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript library",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Declares which JavaScript libraries are needed to execute this.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#JSLibrary"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#jsLibraryURL",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "JavaScript library URL",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Declares the URLs of a JavaScript library. This should be the absolute URL of a JavaScript file. Implementations may redirect those to local files.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#JSLibrary"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#anyURI"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#labelTemplate",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "label template",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Outlines how human-readable labels of instances of the associated Parameterizable shall be produced. The values can contain {?paramName} as placeholders for the actual values of the given parameter.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#languageIn",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "language in",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a list of language tags that all value nodes must have.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#lessThan",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "less than",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a property that must have smaller values than the value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#lessThanOrEquals",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "less than or equals",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a property that must have smaller or equal values than the value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#maxCount",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "max count",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the maximum number of values in the set of value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#maxExclusive",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "max exclusive",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the maximum exclusive value of each value node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#maxInclusive",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "max inclusive",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the maximum inclusive value of each value node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#maxLength",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "max length",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the maximum string length of each value node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#message",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "message",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "A human-readable message (possibly with placeholders for variables) explaining the cause of the result.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#minCount",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "min count",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the minimum number of values in the set of value nodes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#minExclusive",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "min exclusive",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the minimum exclusive value of each value node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#minInclusive",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "min inclusive",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the minimum inclusive value of each value node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#minLength",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "min length",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the minimum string length of each value node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#name",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "name",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Human-readable labels for the property in the context of the surrounding shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#namespace",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "namespace",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The namespace associated with a prefix in a prefix declaration.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#PrefixDeclaration"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#anyURI"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#node",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "node",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the node shape that all value nodes must conform to.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#NodeShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#nodeKind",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "node kind",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the node kind (e.g. IRI or literal) each value node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#NodeKind"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#nodeValidator",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "shape validator",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The validator(s) used to evaluate a constraint in the context of a node shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#ConstraintComponent"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Validator"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#nodes",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "nodes",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The node expression producing the input nodes of a filter shape expression.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#not",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "not",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies a shape that the value nodes must not conform to.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#object",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "object",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An expression producing the nodes that shall be inferred as objects.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#TripleRule"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#oneOrMorePath",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "one or more path",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property represents a path that is matched one or more times.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#optional",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "optional",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Indicates whether a parameter is optional.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Parameter"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#or",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "or",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a list of shapes so that the value nodes must conform to at least one of the shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#order",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "order",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies the relative order of this compared to its siblings. For example use 0 for the first, 1 for the second.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#parameter",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "parameter",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The parameters of a function or constraint component.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Parameterizable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Parameter"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#path",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "path",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Specifies the property path of a property shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#pattern",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "pattern",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a regular expression pattern that the string representations of the value nodes must match.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#predicate",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "predicate",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An expression producing the properties that shall be inferred as predicates.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#TripleRule"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#prefix",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "prefix",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The prefix of a prefix declaration.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#PrefixDeclaration"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#prefixes",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "prefixes",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The prefixes that shall be applied before parsing the associated SPARQL query.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#property",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "property",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Links a shape to its property shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#PropertyShape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#propertyValidator",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "property validator",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The validator(s) used to evaluate a constraint in the context of a property shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#ConstraintComponent"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Validator"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#qualifiedMaxCount",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "qualified max count",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The maximum number of value nodes that can conform to the shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#qualifiedMinCount",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "qualified min count",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The minimum number of value nodes that must conform to the shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#qualifiedValueShape",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "qualified value shape",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The shape that a specified number of values must conform to.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#qualifiedValueShapesDisjoint",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "qualified value shapes disjoint",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Can be used to mark the qualified value shape to be disjoint with its sibling shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#result",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The validation results contained in a validation report.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#ValidationReport"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#ValidationResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#resultAnnotation",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result annotation",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a SPARQL validator with zero or more sh:ResultAnnotation instances, defining how to derive additional result properties based on the variables of the SELECT query.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLSelectValidator"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#ResultAnnotation"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#resultMessage",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result message",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Human-readable messages explaining the cause of the result.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#resultPath",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result path",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The path of a validation result, based on the path of the validated property shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#resultSeverity",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "result severity",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The severity of the result, e.g. warning.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Severity"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#returnType",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "return type",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The expected type of values returned by the associated function.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Function"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Class"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#rule",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "rule",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The rules linked to a shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Rule"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#select",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "select",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The SPARQL SELECT query to execute.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLSelectExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#severity",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "severity",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Defines the severity that validation results produced by a shape must have. Defaults to sh:Violation.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Severity"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#shapesGraph",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "shapes graph",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Shapes graphs that should be used when validating this data graph.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#shapesGraphWellFormed",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "shapes graph well-formed",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "If true then the validation engine was certain that the shapes graph has passed all SHACL syntax requirements during the validation process.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#ValidationReport"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#sourceConstraint",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "source constraint",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The constraint that was validated when the result was produced.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#sourceConstraintComponent",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "source constraint component",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The constraint component that is the source of the result.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#ConstraintComponent"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#sourceShape",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "source shape",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The shape that is was validated when the result was produced.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#sparql",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "constraint (in SPARQL)",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "Links a shape with SPARQL constraints.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLConstraint"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#subject",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "subject",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "An expression producing the resources that shall be inferred as subjects.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#TripleRule"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#suggestedShapesGraph",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "suggested shapes graph",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Suggested shapes graphs for this ontology. The values of this property may be used in the absence of specific sh:shapesGraph statements.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2002/07/owl#Ontology"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#target",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to a target specified by an extension language, for example instances of sh:SPARQLTarget.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Target"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#targetClass",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target class",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to a class, indicating that all instances of the class must conform to the shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Class"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#targetNode",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target node",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to individual nodes, indicating that these nodes must conform to the shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#targetObjectsOf",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target objects of",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to a property, indicating that all all objects of triples that have the given property as their predicate must conform to the shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#targetSubjectsOf",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "target subjects of",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Links a shape to a property, indicating that all subjects of triples that have the given property as their predicate must conform to the shape.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#Shape"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#this",
    "@type": ["http://www.w3.org/2000/01/rdf-schema#Resource"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "this",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "A node expression that represents the current focus node.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#union",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "union",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "A list of node expressions that shall be used together.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#uniqueLang",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "unique languages",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies whether all node values must have a unique (or no) language tag.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#update",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "update",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "The SPARQL UPDATE to execute.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#SPARQLUpdateExecutable"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#validator",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "validator",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The validator(s) used to evaluate constraints of either node or property shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#ConstraintComponent"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/ns/shacl#Validator"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#value",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "value",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value": "An RDF node that has caused the result.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#domain": [
      {
        "@id": "http://www.w3.org/ns/shacl#AbstractResult"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#xone",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "exactly one",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "Specifies a list of shapes so that the value nodes must conform to exactly one of the shapes.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#zeroOrMorePath",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "zero or more path",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property represents a path that is matched zero or more times.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl#zeroOrOnePath",
    "@type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "http://www.w3.org/2000/01/rdf-schema#label": [
      {
        "@value": "zero or one path",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": [
      {
        "@value":
          "The (single) value of this property represents a path that is matched zero or one times.",
        "@language": "en"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#range": [
      {
        "@id": "http://www.w3.org/2000/01/rdf-schema#Resource"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#isDefinedBy": [
      {
        "@id": "http://www.w3.org/ns/shacl#"
      }
    ]
  },
  {
    "@id": "http://www.w3.org/ns/shacl-shacl#"
  }
];

// The core SHACL constraints divided by category.
export const constraintsByTypes = {
  "Value Type Constraints": [
    "http://www.w3.org/ns/shacl#class",
    // "http://www.w3.org/ns/shacl#path",
    "http://www.w3.org/ns/shacl#datatype",
    "http://www.w3.org/ns/shacl#nodeKind"
  ],
  "Cardinality Constraints": [
    "http://www.w3.org/ns/shacl#minCount",
    "http://www.w3.org/ns/shacl#maxCount"
  ],
  "Value Range Constraints": [
    "http://www.w3.org/ns/shacl#minInclusive",
    "http://www.w3.org/ns/shacl#minExclusive",
    "http://www.w3.org/ns/shacl#maxInclusive",
    "http://www.w3.org/ns/shacl#maxExclusive"
  ],
  "String-Based Constraints": [
    "http://www.w3.org/ns/shacl#name",
    "http://www.w3.org/ns/shacl#minLength",
    "http://www.w3.org/ns/shacl#maxLength",
    "http://www.w3.org/ns/shacl#pattern",
    "http://www.w3.org/ns/shacl#languageIn",
    "http://www.w3.org/ns/shacl#uniqueLang"
  ],
  "Property Pair Constraints": [
    "http://www.w3.org/ns/shacl#equals",
    "http://www.w3.org/ns/shacl#disjoint",
    "http://www.w3.org/ns/shacl#lessThan",
    "http://www.w3.org/ns/shacl#lessThanOrEquals"
  ],
  "Logical Constraints": [
    "http://www.w3.org/ns/shacl#not",
    "http://www.w3.org/ns/shacl#and",
    "http://www.w3.org/ns/shacl#or",
    "http://www.w3.org/ns/shacl#xone"
  ],
  "Shape-Based Constraints": [
    "http://www.w3.org/ns/shacl#node",
    "http://www.w3.org/ns/shacl#targetNode",
    "http://www.w3.org/ns/shacl#targetClass",
    "http://www.w3.org/ns/shacl#targetObjectsOf",
    "http://www.w3.org/ns/shacl#property",
    "http://www.w3.org/ns/shacl#qualifiedValueShape",
    "http://www.w3.org/ns/shacl#qualifiedMinCount",
    "http://www.w3.org/ns/shacl#qualifiedMaxCount"
  ],
  "Other Constraints": [
    "http://www.w3.org/ns/shacl#closed",
    "http://www.w3.org/ns/shacl#ignoredProperties",
    "http://www.w3.org/ns/shacl#hasValue",
    "http://www.w3.org/ns/shacl#in"
  ]
};

/**
 * Get an object mapping the category types to a list of custom constraints in that category.
 */
export function customConstraintsByCategory() {
  const output = {};
  for (const type in constraintsByTypes) {
    const byType = [];
    for (const constraint of constraintsByTypes[type]) {
      byType.push(ShaclTranslator.toModelSimple(constraint));
    }
    output[type] = byType;
  }
  return output;
}

/**
 * Get the table contents of the possible constraints.
 * Every constraint will be transformed into an object:
 * {
 *   id {string} the full ID of the constraint,
 *   predicate {string} the name of the predicate that will be used to visualize,
 *   type {string} the name of the category,
 *   description {string} the description of the constraint
 * }
 * @returns {[]} list of constraint objects meant for visualization.
 */
export function tableContents() {
  const allConstraints = [].concat(...Object.values(constraintsByTypes));
  const contents = [];
  allConstraints.map(constraint => {
    const id = ShaclTranslator.toModelSimple(constraint);
    contents.push({
      id,
      predicate: uriToPrefix(id),
      type: getConstraintCategory(id).replace(" Constraints", ""),
      description: json.filter(obj => obj["@id"] === constraint)[0][
        "http://www.w3.org/2000/01/rdf-schema#comment"
      ][0]["@value"]
    });
  });
  return contents;
}

/**
 * Get the constraint category of the constraint with the given ID.
 * @param constraintID
 * @returns {string}
 */
export function getConstraintCategory(constraintID) {
  constraintID = ShaclTranslator.toSHACLSimple(constraintID);
  for (const type in constraintsByTypes) {
    if (constraintsByTypes[type].includes(constraintID)) return type;
  }
}

/**
 * Get the value type of the constraint with the given ID.
 * @param constraint
 * @returns {string} possible values:
 *                    Class, Datatype,  NodeKind, List
 *                    Property, PropertyShape, NodeShape, Shape
 *                    integer, string, boolean
 */
export function getConstraintValueType(constraint) {
  const object = json.filter(
    c => c["@id"] === ShaclTranslator.toSHACLSimple(constraint)
  )[0];
  const range = object["http://www.w3.org/2000/01/rdf-schema#range"];
  return range ? ShaclTranslator.toModelSimple(range[0]["@id"]) : "";
}

export const groupedConstraints = groupBy(constraintsWithTypes, "type");
