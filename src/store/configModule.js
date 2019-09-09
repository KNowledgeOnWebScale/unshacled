import Vue from "vue";
import { swapKeyValue } from "../util";
import namespaceModalModule from "./modals/namespaceModalModule";
import { DEFAULT_BASE_URI, SHACL_URI } from "../util/constants";

const configModule = {
  state: {
    namespaces: {
      usd: DEFAULT_BASE_URI,
      shacl: SHACL_URI,
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      schema: "http://schema.org/",
      foaf: "http://xmlns.com/foaf/0.1/",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      ex: "http://www.example.com/",
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
    baseURI: DEFAULT_BASE_URI
  },
  modules: {
    mModal: namespaceModalModule
  },
  mutations: {
    /**
     * Update the given prefix in the namespaces config.
     * @param state
     * @param oldPrefix {string}
     * @param newPrefix {string}
     */
    updateNamespacePrefix(state, { oldPrefix, newPrefix }) {
      const uri = state.namespaces[oldPrefix];
      Vue.delete(state.namespaces, oldPrefix);
      Vue.set(state.namespaces, newPrefix, uri);
    },

    /**
     * Update the URI of the given prefix in the namespaces config.
     * @param state
     * @param prefix {string}
     * @param newURI {string}
     */
    updateNamespaceURI(state, { prefix, newURI }) {
      Vue.set(state.namespaces, prefix, newURI);
    },

    /**
     * Add the given prefix to the namespaces.
     * @param state
     * @param prefix {string}
     * @param uri {string}
     */
    addPrefix(state, { prefix, uri }) {
      Vue.set(state.namespaces, prefix, uri);
    },

    /**
     * Delete the given prefix from the namespaces.
     * @param state
     * @param prefix {string}
     */
    deletePrefix(state, { prefix }) {
      Vue.delete(state.namespaces, prefix);
    },

    /**
     * Set the current base URI to the given URI (if given) or to the URI corresponding to the given prefix.
     * @param state
     * @param uri {string}
     * @param prefix {string}
     */
    setBaseUri(state, { uri, prefix }) {
      if (uri) Vue.set(state, "baseURI", uri);
      if (prefix) Vue.set(state, "baseURI", state.namespaces[prefix]);
    }
  },
  actions: {
    /**
     * Stop editing the namespaces.
     * Get the entered values and update the namespaces.
     * @param state
     * @param commit
     * @param getters
     * @param input
     */
    stopEditingNamespace({ state, commit, getters }, { input }) {
      const { editRow, editField } = state.mModal;
      // Only execute the update if the value has actually changed.
      if (editField === "prefix" && editRow !== input) {
        // Update the given prefix.
        commit("updateNamespacePrefix", {
          oldPrefix: editRow,
          newPrefix: input
        });
      } else if (editField === "uri" && state.namespaces[editRow] !== input) {
        // Update the given URI.
        if (editRow === getters.uriPrefix(state.baseURI))
          commit("setBaseUri", { uri: input });
        commit("updateNamespaceURI", { prefix: editRow, newURI: input });
      }
      commit("clearTableEdit"); // Stop editing the table.
    }
  },
  getters: {
    /**
     * Get an ordered dictionary mapping of the prefixes to their URIs.
     * @returns {{}}
     */
    namespaces(state) {
      const ordered = {};
      Object.keys(state.namespaces)
        .sort()
        .forEach(key => {
          ordered[key] = state.namespaces[key];
        });
      return ordered;
    },

    /**
     * Get the URI of the given prefix.
     * @param state
     * @returns {*}
     */
    prefixURI: state => prefix => {
      return state.namespaces[prefix];
    },

    /**
     * Get the prefix of the given URI.
     * @param state
     * @returns {*}
     */
    uriPrefix: state => uri => {
      return swapKeyValue(state.namespaces)[uri];
    },

    /**
     * Get the current base URI.
     * @param state
     * @returns {string}
     */
    baseURI: state => {
      return state.baseURI;
    }
  }
};

export { configModule as default };
