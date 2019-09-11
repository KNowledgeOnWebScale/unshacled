import Vue from "vue";

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
     * @param bool {boolean} indicates if the modal should be shown.
     */
    toggleNamespaceModal(state, bool = true) {
      event.preventDefault();
      Vue.set(state, "show", bool);
    },

    /**
     * Start editing the given row and field.
     * @param state
     * @param editRow {string} the prefix of the row we want to edit.
     * @param editField {string} the field we want to edit; either 'prefix' or 'uri'
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
     * @param prefix {string} the prefix of the new entry.
     * @param uri {string} the URI of the new entry.
     */
    addNewPrefix({ commit }, { prefix, uri }) {
      commit("addPrefix", { prefix, uri });
    }
  }
};

export { namespaceModalModule as default };
