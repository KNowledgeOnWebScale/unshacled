import language from "./enums/languages";
import { DEFAULT_BASE_URI, IDENTIFIER, SHACL_URI } from "./constants";

const emptyState = {
  editor: null,
  showClearModal: false,
  showExportModal: false,
  pathModal: {
    show: false,
    editing: false,
    shapeID: ""
  },
  exportType: "",

  mData: {
    format: language.SHACL,
    dataFile: {},
    dataFileName: String,
    dataFileExtension: String,
    dataText: "",
    validationReport: {},
    showValidationReportModal: false
  },

  mConfig: {
    namespaces: {
      usd: `${DEFAULT_BASE_URI}${IDENTIFIER}/`,
      shacl: SHACL_URI,
      rdf: "https://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "https://www.w3.org/2000/01/rdf-schema#",
      schema: "https://schema.org/",
      foaf: "https://xmlns.com/foaf/0.1/",
      xsd: "https://www.w3.org/2001/XMLSchema#",
      ex: "https://www.example.com/",
      skos: "https://www.w3.org/2004/02/skos/core#",
      ost: "https://w3id.org/ost/ns#",
      org: "https://www.w3.org/ns/org#",
      regorg: "https://www.w3.org/ns/regorg#",
      person: "https://www.w3.org/ns/person#",
      locn: "https://www.w3.org/ns/locn#",
      dcterms: "https://purl.org/dc/terms/",
      vcard: "https://www.w3.org/2006/vcard/ns#",
      adms: "https://www.w3.org/ns/adms#",
      time: "https://www.w3.org/2006/time#",
      prov: "https://www.w3.org/ns/prov#",
      csvw: "https://www.w3.org/ns/csvw#",
      gr: "https://purl.org/goodrelations/v1#",
      muto: "https://purl.org/muto/core#",
      acco: "https://purl.org/acco/ns#",
      oslo: "https://purl.org/oslo/ns/localgov/",
      tio: "https://purl.org/tio/ns#",
      tourism: "https://lddemo.mmlab.be/tourism/",
      oh: "https://semweb.mmlab.be/ns/oh#",
      combust: "https://combust.iminds.be/",
      "dbpedia-owl": "https://dbpedia.org/ontology/"
    },
    baseURI: `${DEFAULT_BASE_URI}${IDENTIFIER}/`,
    mModal: {
      show: false,
      editRow: "",
      editField: ""
    }
  },

  mShape: {
    model: [],
    shapeModal: {
      show: false,
      id: "",
      label: "",
      labelLang: "em",
      description: "",
      descrLang: "en",
      nodeShape: false
    },
    mConstraint: {
      constraintIndex: 0,
      mModal: {
        show: false,
        shapeID: "",
        shapeType: "",
        input: "",
        object: "",
        editing: false,
        onExit: undefined,
        selected: "",
        sorting: {
          sorted: true,
          sortBy: "predicate",
          ascending: true
        }
      }
    },
    mCoordinate: {
      yValues: {},
      coordinates: {},
      heights: {}
    }
  }
};

export { emptyState as default };
