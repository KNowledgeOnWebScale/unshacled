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
     * @param args
     */
    startEditingNamespace(state, args) {
      const { editRow, editField } = args;
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
     * @param args
     */
    addNewPrefix({ commit }, args) {
      const { prefix, uri } = args;
      commit("addPrefix", { prefix, uri });
    }
  }
};

export { namespaceModalModule as default };
