import Vue from "vue";

/**
 * This module contains all the state data related to the predicate modal.
 * @type {{mutations: {selectRow(*=, {key: string}): void, togglePredicateModal(*=, {shapeID: string, shapeType: string, editing: boolean, onExit: string, selected: string, input: string}): void, resetPredicateModal(*=): void, sortPredicateModal(*, {sorted: boolean, sortBy: string, ascending: boolean}): void}, state: {shapeType: string, input: string, shapeID: string, onExit: *, sorting: {sorted: boolean, sortBy: string, ascending: boolean}, show: boolean, selected: string, object: string, editing: boolean}}}
 */
const predicateModalModule = {
  state: {
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
  },

  mutations: {
    /**
     * Toggle the visibility of the predicate modal.
     * @param state
     * @param {string} shapeID the ID of the shape.
     * @param {string} shapeType the type of the shape.
     * @param {boolean} editing indicates if we are editing a predicate.
     * @param {string} onExit the action that should be dispatched when the modal is confirmed.
     * @param {string} selected the prefix of the predicate that is currently selected.
     * @param {string} input the search term that is currently entered.
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
     * @param {boolean} sorted indicates if the modal is sorted.
     * @param {string} sortBy the column the modal is sorted on.
     * @param {boolean} ascending indicates if the column is sorted alphabetically.
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
     * @param {string} key the key of the row that is selected.
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
      Vue.set(state, "sorting", {
        sorted: true,
        sortBy: "predicate",
        ascending: true
      });
    }
  }
};

export { predicateModalModule as default };
