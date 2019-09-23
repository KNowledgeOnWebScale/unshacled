const EXAMPLES = {
  shacl: [
    [
      {
        "@id": "_:b0",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#address"
          }
        ],
        "https://www.w3.org/ns/shacl#class": [
          {
            "@id": "https://example.org/ns#PostalAddress"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#ClassExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b0"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          },
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Carol"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b1",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#age"
          }
        ],
        "https://www.w3.org/ns/shacl#datatype": [
          {
            "@id": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#DatatypeExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b1"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          },
          {
            "@id": "https://example.org/ns#Carol"
          }
        ]
      }
    ],
    [
      {
        "@id": "https://example.org/ns#NodeKindExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#nodeKind": [
          {
            "@id": "https://www.w3.org/ns/shacl#IRI"
          }
        ],
        "https://www.w3.org/ns/shacl#targetObjectsOf": [
          {
            "@id": "https://example.org/ns#knows"
          }
        ]
      }
    ],
    [
      {
        "@id": "https://example.org/ns#MinCountExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#PropertyShape"],
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#name"
          }
        ],
        "https://www.w3.org/ns/shacl#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b2",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#birthDate"
          }
        ],
        "https://www.w3.org/ns/shacl#maxCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MaxCountExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b2"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b3",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#hasKeys"
          }
        ],
        "https://www.w3.org/ns/shacl#minExclusive": [
          {
            "@value": "2",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MinExclusiveExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b3"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b4",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#hasKeys"
          }
        ],
        "https://www.w3.org/ns/shacl#minInclusive": [
          {
            "@value": "2",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MinInclusiveExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b4"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b5",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#hasKeys"
          }
        ],
        "https://www.w3.org/ns/shacl#maxExclusive": [
          {
            "@value": "2",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MaxExclusiveExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b5"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b6",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#hasKeys"
          }
        ],
        "https://www.w3.org/ns/shacl#maxInclusive": [
          {
            "@value": "2",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MaxInclusiveExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b6"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b7",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#password"
          }
        ],
        "https://www.w3.org/ns/shacl#minLength": [
          {
            "@value": "8",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MinLengthExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b7"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b8",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#password"
          }
        ],
        "https://www.w3.org/ns/shacl#maxLength": [
          {
            "@value": "10",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MaxLengthExampleShape",
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MinLengthExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b8"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b9",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#bCode"
          }
        ],
        "https://www.w3.org/ns/shacl#pattern": [
          {
            "@value": "^B"
          }
        ],
        "https://www.w3.org/ns/shacl#flags": [
          {
            "@value": "i"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#PatternExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          },
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Carol"
          }
        ],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b9"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b10",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#prefLabel"
          }
        ],
        "https://www.w3.org/ns/shacl#languageIn": [
          {
            "@list": [
              {
                "@value": "en"
              },
              {
                "@value": "mi"
              }
            ]
          }
        ]
      },
      {
        "@id": "https://example.org/ns#NewZealandLanguagesShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b10"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Mountain"
          },
          {
            "@id": "https://example.org/ns#Berg"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b13",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#label"
          }
        ],
        "https://www.w3.org/ns/shacl#uniqueLang": [
          {
            "@value": "true",
            "@type": "https://www.w3.org/2001/XMLSchema#boolean"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#UniqueLangExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b13"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b14",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#firstName"
          }
        ],
        "https://www.w3.org/ns/shacl#equals": [
          {
            "@id": "https://example.org/ns#givenName"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#EqualExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b14"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          },
          {
            "@id": "https://example.org/ns#Alice"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b15",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#prefLabel"
          }
        ],
        "https://www.w3.org/ns/shacl#disjoint": [
          {
            "@id": "https://example.org/ns#altLabel"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#DisjointExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b15"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#USA"
          },
          {
            "@id": "https://example.org/ns#Germany"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b16",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#startDate"
          }
        ],
        "https://www.w3.org/ns/shacl#lessThan": [
          {
            "@id": "https://example.org/ns#endDate"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#LessThanExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b16"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Event1"
          },
          {
            "@id": "https://example.org/ns#Event2"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b17",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#startDate"
          }
        ],
        "https://www.w3.org/ns/shacl#lessThanOrEquals": [
          {
            "@id": "https://example.org/ns#endDate"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#LessThanOrEqualsExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b17"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Event1"
          },
          {
            "@id": "https://example.org/ns#Event2"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b18",
        "@type": ["https://www.w3.org/ns/shacl#PropertyShape"],
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#property"
          }
        ],
        "https://www.w3.org/ns/shacl#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#NotExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#not": [
          {
            "@id": "_:b18"
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#InvalidInstance1"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b19",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#property"
          }
        ],
        "https://www.w3.org/ns/shacl#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b22",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#property"
          }
        ],
        "https://www.w3.org/ns/shacl#maxCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#ExampleAndShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#and": [
          {
            "@list": [
              {
                "@id": "https://example.org/ns#SuperShape"
              },
              {
                "@id": "_:b22"
              }
            ]
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#ValidInstance"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#SuperShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b19"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b24",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#firstName"
          }
        ],
        "https://www.w3.org/ns/shacl#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b26",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#givenName"
          }
        ],
        "https://www.w3.org/ns/shacl#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#OrConstraintExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#or": [
          {
            "@list": [
              {
                "@id": "_:b24"
              },
              {
                "@id": "_:b26"
              }
            ]
          }
        ],
        "https://www.w3.org/ns/shacl#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b28",
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b29"
          }
        ]
      },
      {
        "@id": "_:b29",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#fullName"
          }
        ],
        "https://www.w3.org/ns/shacl#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b31",
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b32"
          },
          {
            "@id": "_:b33"
          }
        ]
      },
      {
        "@id": "_:b32",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#firstName"
          }
        ],
        "https://www.w3.org/ns/shacl#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b33",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#lastName"
          }
        ],
        "https://www.w3.org/ns/shacl#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#XoneConstraintExampleShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#xone": [
          {
            "@list": [
              {
                "@id": "_:b28"
              },
              {
                "@id": "_:b31"
              }
            ]
          }
        ],
        "https://www.w3.org/ns/shacl#targetClass": [
          {
            "@id": "https://example.org/ns#Person"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b34",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#postalCode"
          }
        ],
        "https://www.w3.org/ns/shacl#datatype": [
          {
            "@id": "https://www.w3.org/2001/XMLSchema#string"
          }
        ],
        "https://www.w3.org/ns/shacl#maxCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b35",
        "https://www.w3.org/ns/shacl#path": [
          {
            "@id": "https://example.org/ns#address"
          }
        ],
        "https://www.w3.org/ns/shacl#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ],
        "https://www.w3.org/ns/shacl#node": [
          {
            "@id": "https://example.org/ns#AddressShape"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#AddressShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b34"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#PersonShape",
        "@type": ["https://www.w3.org/ns/shacl#NodeShape"],
        "https://www.w3.org/ns/shacl#property": [
          {
            "@id": "_:b35"
          }
        ],
        "https://www.w3.org/ns/shacl#targetClass": [
          {
            "@id": "https://example.org/ns#Person"
          }
        ]
      }
    ]
  ],
  model: [
    [
      {
        "@id": "_:b0",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#address"
          }
        ],
        "https://2019.summerofcode.be/unshacled#class": [
          {
            "@id": "https://example.org/ns#PostalAddress"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#ClassExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b0"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          },
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Carol"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b1",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#age"
          }
        ],
        "https://2019.summerofcode.be/unshacled#datatype": [
          {
            "@id": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#DatatypeExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b1"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          },
          {
            "@id": "https://example.org/ns#Carol"
          }
        ]
      }
    ],
    [
      {
        "@id": "https://example.org/ns#NodeKindExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#nodeKind": [
          {
            "@id": "https://2019.summerofcode.be/unshacled#IRI"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetObjectsOf": [
          {
            "@id": "https://example.org/ns#knows"
          }
        ]
      }
    ],
    [
      {
        "@id": "https://example.org/ns#MinCountExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#PropertyShape"],
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#name"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b2",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#birthDate"
          }
        ],
        "https://2019.summerofcode.be/unshacled#maxCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MaxCountExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b2"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b3",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#hasKeys"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minExclusive": [
          {
            "@value": "2",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MinExclusiveExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b3"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b4",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#hasKeys"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minInclusive": [
          {
            "@value": "2",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MinInclusiveExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b4"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b5",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#hasKeys"
          }
        ],
        "https://2019.summerofcode.be/unshacled#maxExclusive": [
          {
            "@value": "2",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MaxExclusiveExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b5"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b6",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#hasKeys"
          }
        ],
        "https://2019.summerofcode.be/unshacled#maxInclusive": [
          {
            "@value": "2",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MaxInclusiveExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b6"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b7",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#password"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minLength": [
          {
            "@value": "8",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MinLengthExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b7"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b8",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#password"
          }
        ],
        "https://2019.summerofcode.be/unshacled#maxLength": [
          {
            "@value": "10",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MaxLengthExampleShape",
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#MinLengthExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b8"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b9",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#bCode"
          }
        ],
        "https://2019.summerofcode.be/unshacled#pattern": [
          {
            "@value": "^B"
          }
        ],
        "https://2019.summerofcode.be/unshacled#flags": [
          {
            "@value": "i"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#PatternExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          },
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Carol"
          }
        ],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b9"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b10",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#prefLabel"
          }
        ],
        "https://2019.summerofcode.be/unshacled#languageIn": [
          {
            "@list": [
              {
                "@value": "en"
              },
              {
                "@value": "mi"
              }
            ]
          }
        ]
      },
      {
        "@id": "https://example.org/ns#NewZealandLanguagesShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b10"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Mountain"
          },
          {
            "@id": "https://example.org/ns#Berg"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b13",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#label"
          }
        ],
        "https://2019.summerofcode.be/unshacled#uniqueLang": [
          {
            "@value": "true",
            "@type": "https://www.w3.org/2001/XMLSchema#boolean"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#UniqueLangExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b13"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Alice"
          },
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b14",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#firstName"
          }
        ],
        "https://2019.summerofcode.be/unshacled#equals": [
          {
            "@id": "https://example.org/ns#givenName"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#EqualExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b14"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          },
          {
            "@id": "https://example.org/ns#Alice"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b15",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#prefLabel"
          }
        ],
        "https://2019.summerofcode.be/unshacled#disjoint": [
          {
            "@id": "https://example.org/ns#altLabel"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#DisjointExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b15"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#USA"
          },
          {
            "@id": "https://example.org/ns#Germany"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b16",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#startDate"
          }
        ],
        "https://2019.summerofcode.be/unshacled#lessThan": [
          {
            "@id": "https://example.org/ns#endDate"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#LessThanExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b16"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Event1"
          },
          {
            "@id": "https://example.org/ns#Event2"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b17",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#startDate"
          }
        ],
        "https://2019.summerofcode.be/unshacled#lessThanOrEquals": [
          {
            "@id": "https://example.org/ns#endDate"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#LessThanOrEqualsExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b17"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Event1"
          },
          {
            "@id": "https://example.org/ns#Event2"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b18",
        "@type": ["https://2019.summerofcode.be/unshacled#PropertyShape"],
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#property"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#NotExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#not": [
          {
            "@id": "_:b18"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#InvalidInstance1"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b19",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#property"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b22",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#property"
          }
        ],
        "https://2019.summerofcode.be/unshacled#maxCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#ExampleAndShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#and": [
          {
            "@list": [
              {
                "@id": "https://example.org/ns#SuperShape"
              },
              {
                "@id": "_:b22"
              }
            ]
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#ValidInstance"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#SuperShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b19"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b24",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#firstName"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b26",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#givenName"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#OrConstraintExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#or": [
          {
            "@list": [
              {
                "@id": "_:b24"
              },
              {
                "@id": "_:b26"
              }
            ]
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetNode": [
          {
            "@id": "https://example.org/ns#Bob"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b28",
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b29"
          }
        ]
      },
      {
        "@id": "_:b29",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#fullName"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b31",
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b32"
          },
          {
            "@id": "_:b33"
          }
        ]
      },
      {
        "@id": "_:b32",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#firstName"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b33",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#lastName"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#XoneConstraintExampleShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#xone": [
          {
            "@list": [
              {
                "@id": "_:b28"
              },
              {
                "@id": "_:b31"
              }
            ]
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetClass": [
          {
            "@id": "https://example.org/ns#Person"
          }
        ]
      }
    ],
    [
      {
        "@id": "_:b34",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#postalCode"
          }
        ],
        "https://2019.summerofcode.be/unshacled#datatype": [
          {
            "@id": "https://www.w3.org/2001/XMLSchema#string"
          }
        ],
        "https://2019.summerofcode.be/unshacled#maxCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ]
      },
      {
        "@id": "_:b35",
        "https://2019.summerofcode.be/unshacled#path": [
          {
            "@id": "https://example.org/ns#address"
          }
        ],
        "https://2019.summerofcode.be/unshacled#minCount": [
          {
            "@value": "1",
            "@type": "https://www.w3.org/2001/XMLSchema#integer"
          }
        ],
        "https://2019.summerofcode.be/unshacled#node": [
          {
            "@id": "https://example.org/ns#AddressShape"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#AddressShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b34"
          }
        ]
      },
      {
        "@id": "https://example.org/ns#PersonShape",
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [
          {
            "@id": "_:b35"
          }
        ],
        "https://2019.summerofcode.be/unshacled#targetClass": [
          {
            "@id": "https://example.org/ns#Person"
          }
        ]
      }
    ]
  ]
};

const lists = {};
const types = new Set();
const ids = new Set();
EXAMPLES.model.forEach(e =>
  e.forEach(array => {
    for (const property in array) {
      const value = array[property];
      if (typeof value === "object") {
        const innervalue = value[0];
        if (innervalue["@id"]) ids[property] = true;
        if (innervalue["@type"]) types[property] = true;
        if (innervalue["@list"]) lists[property] = true;
      }
    }
  })
);
export { EXAMPLES as default };
