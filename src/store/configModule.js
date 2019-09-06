import Vue from "vue";
import namespaces from "../config/config";

const configModule = {
  state: {
    namespaces: {
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
    namespaceModal: {
      show: false,
      editRow: "",
      editField: ""
    }
  },
  mutations: {
    /**
     * Update the given prefix in the namespaces config.
     * @param state
     * @param args
     */
    updateNamespacePrefix(state, args) {
      const { oldPrefix, newPrefix } = args;
      const uri = state.namespaces[oldPrefix];
      Vue.delete(state.namespaces, oldPrefix);
      Vue.set(state.namespaces, newPrefix, uri);
    },

    /**
     * Update the URI of the given prefix in the namespaces config.
     * @param state
     * @param args
     */
    updateNamespaceURI(state, args) {
      const { prefix, newURI } = args;
      Vue.set(state.namespaces, prefix, newURI);
    },

    /**
     * Delete the given prefix from the namespaces.
     * @param state
     * @param args
     */
    deletePrefix(state, args) {
      const { prefix } = args;
      Vue.delete(state.namespaces, prefix);
    },

    /* NAMESPACE MODAL ============================================================================================== */

    /**
     * Toggle the visibility of the namespace modal.
     * @param state
     * @param bool {boolean} indicates if the modal should be shown.
     */
    toggleNamespaceModal(state, bool = true) {
      event.preventDefault();
      Vue.set(state.namespaceModal, "show", bool);
    },

    /**
     * TODO
     * @param state
     * @param args
     */
    startEditingNamespace(state, args) {
      const { editRow, editField } = args;
      Vue.set(state.namespaceModal, "editRow", editRow);
      Vue.set(state.namespaceModal, "editField", editField);
    },

    /**
     * Clear the edit fields for the namespace modal.
     * @param state
     */
    clearTableEdit(state) {
      Vue.set(state.namespaceModal, "editRow", "");
      Vue.set(state.namespaceModal, "editField", "");
    }
  },
  actions: {
    /**
     * TODO
     * @param state
     * @param commit
     * @param args
     */
    stopEditingNamespace({ state, commit }, args) {
      const { input } = args;
      const { editRow, editField } = state.namespaceModal;
      if (editField === "prefix") {
        commit("updateNamespacePrefix", {
          oldPrefix: editRow,
          newPrefix: input
        });

        // Since the key is replaced (removed and added again), it gets appended to the bottom of the list.
        // Scroll to the bottom of the table to make the change visible.
        const body = document.getElementById("table-body");
        body.scrollTop = body.scrollHeight;
      } else {
        commit("updateNamespaceURI", { prefix: editRow, newURI: input });
      }
      commit("clearTableEdit");
    }
  },
  getters: {
    /**
     * Get a dictionary mapping the prefixes to their namespaces.
     * `namespaces` cannot be referenced directly in the HTML.
     * @returns {{schema, xsd, skos, tourism, rdfs, muto, ost, oslo, combust, regorg, dcterms, oh, tio, locn, prov, foaf, csvw, acco, "dbpedia-owl", adms, org, vcard, gr, ex, rdf, person, time}}
     */
    namespaces(state) {
      const ordered = {};
      Object.keys(state.namespaces)
        .sort()
        .forEach(key => {
          ordered[key] = state.namespaces[key];
        });
      return ordered;
    }
  }
};

export { configModule as default };
