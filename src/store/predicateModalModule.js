import Vue from "vue";

const predicateModalModule = {
  state: {
    show: false,
    shapeID: "",
    shapeType: "",
    category: "",
    predicate: "",
    urls: {},
    input: "",
    object: "",
    constraintType: "",
    editing: false,
    onExit: undefined,
    sorting: {
      sorted: false,
      sortBy: "",
      ascending: false
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

      Vue.set(state, "show", !state.show);
      Vue.set(state, "shapeID", args.shapeID);
      Vue.set(state, "shapeType", args.shapeType);
      Vue.set(state, "editing", args.editing);
      Vue.set(state, "onExit", args.onExit);
      Vue.set(state, "sorting", {
        sorted: false,
        sortBy: "",
        ascending: false
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
      Vue.set(state, "sorting", args);
    },

    /**
     * Reset the properties of the predicate modal.
     * @param state
     */
    resetPredicateModal(state) {
      Vue.set(state, "show", false);
      Vue.set(state, "shapeID", "");
      Vue.set(state, "shapeType", "");
      Vue.set(state, "constraintType", "");
      Vue.set(state, "category", "");
      Vue.set(state, "predicate", "");
      Vue.set(state, "input", "");
      Vue.set(state, "object", "");
      Vue.set(state, "editing", false);
      Vue.set(state, "onExit", undefined);
      Vue.set(state, "urls", {});
      Vue.set(state, "sorting", {
        sorted: false,
        sortBy: "",
        ascending: false
      });
    }
  },
  actions: {}
};

export { predicateModalModule as default };
