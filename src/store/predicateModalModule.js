import Vue from "vue";

const predicateModalModule = {
  state: {
    show: false,
    shapeID: "",
    shapeType: "",
    urls: {},
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
  },
  mutations: {
    /**
     * Toggle the visibility of the predicate modal.
     * @param state
     * @param args
     */
    togglePredicateModal(state, args) {
      if (!args)
        args = { shapeID: "", shapeType: "", onExit: "", editing: false };
      const { shapeID, shapeType, editing, onExit, selected, input } = args;

      Vue.set(state, "show", !state.show);
      Vue.set(state, "shapeID", shapeID);
      Vue.set(state, "shapeType", shapeType);
      Vue.set(state, "editing", editing);
      Vue.set(state, "input", input || "");
      Vue.set(state, "onExit", onExit);
      Vue.set(state, "selected", selected || "");
      Vue.set(state, "sorting", {
        sorted: true,
        sortBy: "predicate",
        ascending: true
      });
    },

    /**
     * Set the sorting of the table in the predicate modal.
     * @param state
     * @param args
     *            sorted {boolean}
     *            sortBy {string}
     *            ascending {boolean}
     */
    sortPredicateModal(state, args) {
      const { sorted, sortBy, ascending } = args;
      Vue.set(state.sorting, "sorted", sorted);
      Vue.set(state.sorting, "sortBy", sortBy);
      Vue.set(state.sorting, "ascending", ascending);
    },

    /**
     * Select the row with the given key (constraint ID).
     * If the row was already selected, then deselect it.
     * @param state
     * @param args
     */
    selectRow(state, args) {
      const { key } = args;
      const selected = state.selected === key ? "" : key;
      Vue.set(state, "selected", selected);
    },

    /**
     * Reset the properties of the predicate modal.
     * @param state
     */
    resetPredicateModal(state) {
      Vue.set(state, "show", false);
      Vue.set(state, "shapeID", "");
      Vue.set(state, "shapeType", "");
      Vue.set(state, "input", "");
      Vue.set(state, "object", "");
      Vue.set(state, "editing", false);
      Vue.set(state, "onExit", undefined);
      Vue.set(state, "urls", {});
      Vue.set(state, "sorting", {
        sorted: true,
        sortBy: "predicate",
        ascending: true
      });
    }
  },
  actions: {}
};

export { predicateModalModule as default };
