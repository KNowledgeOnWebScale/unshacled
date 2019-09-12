import Vue from "vue";

/**
 * This module contains all the state data related to the namespace modal.
 * @type {{mutations: {toggleNamespaceModal(*=, boolean=): void, clearTableEdit(*=): void, startEditingNamespace(*=, {editRow: string, editField: string}): void}, state: {editField: string, editRow: string, show: boolean}, actions: {addNewPrefix({commit: *}, {prefix: string, uri: string}): void}}}
 */
const namespaceModalModule = {
  state: {
    show: false,
    editRow: "",
    editField: ""
  },
  mutations: {
    /**
     * Toggle the visibility of the namespace modal.
     * @param state
     * @param {boolean} bool indicates if the modal should be shown.
     */
    toggleNamespaceModal(state, bool = true) {
      event.preventDefault();
      Vue.set(state, "show", bool);
    },

    /**
     * Start editing the given row and field.
     * @param state
     * @param {string} editRow the prefix of the row we want to edit.
     * @param {string} editField the field we want to edit; either 'prefix' or 'uri'
     */
    startEditingNamespace(state, { editRow, editField }) {
      Vue.set(state, "editRow", editRow);
      Vue.set(state, "editField", editField);
    },

    /**
     * Clear the edit fields for the namespace modal.
     * @param state
     */
    clearTableEdit(state) {
      Vue.set(state, "editRow", "");
      Vue.set(state, "editField", "");
    }
  },

  actions: {
    /**
     * Add a new entry with the given prefix and URI.
     * @param commit
     * @param {string} prefix the prefix of the new entry.
     * @param {string} uri the URI of the new entry.
     */
    addNewPrefix({ commit }, { prefix, uri }) {
      commit("addPrefix", { prefix, uri });
    }
  }
};

export { namespaceModalModule as default };
