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
     * @param shapeID {string} the ID of the shape.
     * @param shapeType {string} the type of the shape.
     * @param editing {boolean} indicates if we are editing a predicate.
     * @param onExit {string} the action that should be dispatched when the modal is confirmed.
     * @param selected {string} the prefix of the predicate that is currently selected.
     * @param input {string} the search term that is currently entered.
     */
    togglePredicateModal(
      state,
      { shapeID, shapeType, editing, onExit, selected, input }
    ) {
      Vue.set(state, "show", !state.show);
      Vue.set(state, "shapeID", shapeID || "");
      Vue.set(state, "shapeType", shapeType || "");
      Vue.set(state, "editing", editing || false);
      Vue.set(state, "input", input || "");
      Vue.set(state, "onExit", onExit || "");
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
     * @param sorted {boolean} indicates if the modal is sorted.
     * @param sortBy {string} the column the modal is sorted on.
     * @param ascending {boolean} indicates if the column is sorted ascending.
     */
    sortPredicateModal(state, { sorted, sortBy, ascending }) {
      Vue.set(state.sorting, "sorted", sorted);
      Vue.set(state.sorting, "sortBy", sortBy);
      Vue.set(state.sorting, "ascending", ascending);
    },

    /**
     * Select the row with the given key (constraint ID).
     * If the row was already selected, then deselect it.
     * @param state
     * @param key {string} the key of the row that is selected.
     */
    selectRow(state, { key }) {
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
