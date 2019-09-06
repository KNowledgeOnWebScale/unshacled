import Vue from "vue";
import namespaces from "../config/config";

const configModule = {
  state: {
    namespaceModal: {
      show: false,
      editRow: "",
      editField: ""
    }
  },
  mutations: {
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
    },

    /* NAMESPACE MUTATIONS ========================================================================================== */

    /**
     * Update the given prefix in the namespaces config.
     * @param state
     * @param args
     */
    updateNamespacePrefix(state, args) {
      const { oldPrefix, newPrefix } = args;
      const uri = namespaces[oldPrefix];
      Vue.delete(namespaces, oldPrefix);
      Vue.set(namespaces, newPrefix, uri);
    },

    /**
     * Update the URI of the given prefix in the namespaces config.
     * @param state
     * @param args
     */
    updateNamespaceURI(state, args) {
      const { prefix, newURI } = args;
      Vue.set(namespaces, prefix, newURI);
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
    namespaces() {
      const ordered = {};
      Object.keys(namespaces)
        .sort()
        .forEach(key => {
          ordered[key] = namespaces[key];
        });
      return namespaces;
    }
  }
};

export { configModule as default };
