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
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      schema: "http://schema.org/",
      foaf: "http://xmlns.com/foaf/0.1/",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      ex: "http://example.org/ns#",
      skos: "http://www.w3.org/2004/02/skos/core#",
      ost: "http://w3id.org/ost/ns#",
      org: "http://www.w3.org/ns/org#",
      regorg: "http://www.w3.org/ns/regorg#",
      person: "http://www.w3.org/ns/person#",
      locn: "http://www.w3.org/ns/locn#",
      dcterms: "http://purl.org/dc/terms/",
      vcard: "http://www.w3.org/2006/vcard/ns#",
      adms: "http://www.w3.org/ns/adms#",
      time: "http://www.w3.org/2006/time#",
      prov: "http://www.w3.org/ns/prov#",
      csvw: "http://www.w3.org/ns/csvw#",
      gr: "http://purl.org/goodrelations/v1#",
      muto: "http://purl.org/muto/core#",
      acco: "http://purl.org/acco/ns#",
      oslo: "http://purl.org/oslo/ns/localgov/",
      tio: "http://purl.org/tio/ns#",
      tourism: "http://lddemo.mmlab.be/tourism/",
      oh: "http://semweb.mmlab.be/ns/oh#",
      combust: "http://combust.iminds.be/",
      "dbpedia-owl": "http://dbpedia.org/ontology/"
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
