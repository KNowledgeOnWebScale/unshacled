import Vue from "vue";
import { swapKeyValue } from "../util";
import namespaceModalModule from "./modals/namespaceModalModule";
import { DEFAULT_BASE_URI, IDENTIFIER, SHACL_URI } from "../util/constants";

/**
 * This module contains everything related to the configuration of the application.
 * For now, this is mainly the namespaces.
 * @type {{mutations: {setBaseUri(*=, {uri: string, prefix: string}): void, updateNamespacePrefix(*, {oldPrefix: string, newPrefix: string}): void, updateNamespaceURI(*, {prefix: string, newURI: string}): void, deletePrefix(*, {prefix: string}): void, addPrefix(*, {prefix: string, uri: string}): void}, state: {baseURI: *, namespaces: {schema: string, usd: *, xsd: string, skos: string, tourism: string, rdfs: string, shacl: *, muto: string, ost: string, oslo: string, combust: string, regorg: string, dcterms: string, oh: string, tio: string, locn: string, prov: string, foaf: string, csvw: string, acco: string, "dbpedia-owl": string, adms: string, org: string, vcard: string, gr: string, ex: string, rdf: string, person: string, time: string}}, getters: {uriByPrefix: (function(*): function(*): *), baseURI: (function(*): *), prefixByURI: (function(*): function(*): *), namespaces(*): {}}, actions: {stopEditingNamespace({state: *, commit: *, getters: *}, {input: string}): void}, modules: {mModal: *}}}
 */
const configModule = {
  state: {
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
    baseURI: `${DEFAULT_BASE_URI}${IDENTIFIER}/`
  },
  modules: {
    mModal: namespaceModalModule
  },

  mutations: {
    /**
     * Update the given prefix in the namespaces config.
     * @param state
     * @param {string} oldPrefix the original prefix.
     * @param {string} newPrefix the new prefix we want to use for this namespace.
     */
    updateNamespacePrefix(state, { oldPrefix, newPrefix }) {
      const uri = state.namespaces[oldPrefix];
      Vue.delete(state.namespaces, oldPrefix);
      Vue.set(state.namespaces, newPrefix, uri);
    },

    /**
     * Update the URI of the given prefix in the namespaces config.
     * @param state
     * @param {string} prefix the prefix of the namespace we want to update.
     * @param {string} newURI the new URI for this namespace.
     */
    updateNamespaceURI(state, { prefix, newURI }) {
      Vue.set(state.namespaces, prefix, newURI);
    },

    /**
     * Add the given prefix to the namespaces.
     * @param state
     * @param {string} prefix the prefix of the namespace we want to add.
     * @param {string} uri the URI of the namespace we want to add.
     */
    addPrefix(state, { prefix, uri }) {
      Vue.set(state.namespaces, prefix, uri);
    },

    /**
     * Delete the given prefix from the namespaces.
     * @param state
     * @param {string} prefix the prefix of the namespace we want to delete.
     */
    deletePrefix(state, { prefix }) {
      Vue.delete(state.namespaces, prefix);
    },

    /**
     * Set the current base URI to the given URI (if given) or to the URI corresponding to the given prefix.
     * If the current base URI is identical to the given URI, then clear the base URI.
     * @param state
     * @param {string} uri the URI of the namespace we want to set as base.
     * @param {string} prefix the prefix of the namespace we want to set as base.
     */
    setBaseUri(state, { uri, prefix }) {
      if (uri === "") {
        Vue.set(state, "baseURI", "");
      } else {
        if (prefix) uri = state.namespaces[prefix];
        Vue.set(state, "baseURI", uri);
      }
    }
  },

  actions: {
    /**
     * Stop editing the namespaces.
     * Get the entered value and update the namespaces.
     * @param state
     * @param commit
     * @param getters
     * @param {string} input the value entered by the user.
     */
    stopEditingNamespace({ state, commit, getters }, { input }) {
      const { editRow, editField } = state.mModal;
      console.log(editRow, input);
      /* Only execute the update if the value has actually changed. */
      if (editField === "prefix" && editRow !== input) {
        // Update the given prefix.
        commit("updateNamespacePrefix", {
          oldPrefix: editRow,
          newPrefix: input
        });
      } else if (editField === "uri" && state.namespaces[editRow] !== input) {
        // Update the given URI.
        console.log(editRow, getters.uriByPrefix(state.baseURI));
        if (editRow === getters.uriByPrefix(state.baseURI))
          commit("setBaseUri", { uri: input });
        commit("updateNamespaceURI", { prefix: editRow, newURI: input });
      }
      commit("clearTableEdit"); /* Stop editing and clear the table. */
    }
  },

  getters: {
    /**
     * Get the current namespaces.
     * @returns {object} an ordered dictionary mapping of the prefixes to their URIs.
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
     * Prefix {string} the prefix of the namespace we want to get the URI from.
     * @param state
     * @returns {function} getter
     */
    prefixByURI: state => prefix => {
      return state.namespaces[prefix];
    },

    /**
     * Get the prefix of the given URI.
     * URI {string} the URI of the namespace we want to get the prefix from.
     * @param state
     * @returns {function} getter
     */
    uriByPrefix: state => uri => {
      return swapKeyValue(state.namespaces)[uri];
    },

    /**
     * Get the current base URI.
     * @param state
     * @returns {string} the current base URI.
     */
    baseURI: state => {
      return state.baseURI;
    }
  }
};

export { configModule as default };
