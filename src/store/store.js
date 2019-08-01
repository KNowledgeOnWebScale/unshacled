// Vue
import { clone } from "ramda";
import Vue from "vue";
import Vuex from "vuex";

// Util
import EXAMPLE from "../util/examples";
import { possiblePredicates, possibleObjects } from "../util/vocabulary";

// Translation
import { TranslatorManager } from "../translation/translatorManager";
import { TERM } from "../translation/terminology";

// Modules
import shapeModule from "./shapeModule";
import dataModule from "./dataModule";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: null,
    showNodeShapeModal: false,
    showClearModal: false,
    predicateModal: {
      show: false,
      id: String,
      type: String,
      predicate: String
    }
  },
  modules: {
    mShape: shapeModule,
    mData: dataModule
  },
  mutations: {
    updatePredicateInModal(state, pred) {
      Vue.set(state.predicateModal, "predicate", pred);
    },

    /**
     * Save a reference to the editor.
     * @param state
     * @param reference
     */
    setEditor(state, reference) {
      state.editor = reference;
    },

    /* MODALS ======================================================================================================= */

    /**
     * TODO
     * @param state
     */
    toggleValidationReport(state) {
      event.preventDefault();
      state.mData.showValidationReportModal = !state.mData
        .showValidationReportModal;
    },

    /**
     * Toggle the visibility of the node shape modal.
     * @param state
     */
    toggleShapeModal(state) {
      event.preventDefault();
      state.showNodeShapeModal = !state.showNodeShapeModal;
    },

    /**
     * Toggle the visibility of the clear modal.
     * @param state
     */
    toggleClearModal(state) {
      event.preventDefault();
      state.showClearModal = !state.showClearModal;
    },

    /**
     * Toggle the visibility of the predicate modal.
     * @param state
     * @param args
     */
    togglePredicateModal(state, args) {
      if (!args) args = { id: null, type: null };

      Vue.set(state.predicateModal, "show", !state.predicateModal.show);
      Vue.set(state.predicateModal, "id", args.id);
      Vue.set(state.predicateModal, "type", args.type);
    }
  },
  actions: {
    /**
     * Load in some example data.
     */
    loadExample({ getters }) {
      console.log("Loading example...");
      this.commit("clear"); // Clear the existing data first.

      const example = EXAMPLE.model[0];
      const newModel = [];
      for (const element of example) {
        newModel.push(clone(element)); // Deep copy
      }
      this.commit("setModel", { model: newModel, getters });
    }
  },
  getters: {
    /**
     * Returns the Json Internal model.
     * @param state
     * @returns {*}
     */
    internalModelToJson: state => {
      return state.mShape.model;
    },

    /**
     * Returns the internal model in ttl format.
     * @param state
     * @returns {any}
     */
    internalModelToTurtle: state => {
      return TranslatorManager.translateToLanguage(
        state.mShape.model,
        state.format
      );
    },

    /**
     * TODO
     * @returns {function(*): string[]}
     */
    predicates: () => type => {
      return possiblePredicates(TERM[type]);
    },

    /**
     * TODO
     * @param state
     * @returns {string[]}
     */
    objects: state => {
      return possibleObjects(state.predicateModal.predicate);
    }
  }
});
