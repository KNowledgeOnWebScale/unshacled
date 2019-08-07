// Vue
import { clone } from "ramda";
import Vue from "vue";
import Vuex from "vuex";

// Util
import EXAMPLE from "../util/examples";
import { possiblePredicates, possibleObjects } from "../util/vocabulary";

// Translation
import TranslatorManager from "../translation/translatorManager";
import { TERM } from "../translation/terminology";

// Modules
import shapeModule from "./shapeModule";
import dataModule from "./dataModule";
import { internalToShacl } from "../parsing/internalParser";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: null,
    showNodeShapeModal: false,
    showClearModal: false,
    showExportModal: false,
    exportType: ""
  },
  modules: {
    mShape: shapeModule,
    mData: dataModule
  },
  mutations: {
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
     * Show the validation report modal.
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

    toggleExportModal(state, type) {
      this.state.exportType = type;
      event.preventDefault();
      state.showExportModal = !state.showExportModal;
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
      return internalToShacl(state.mShape.model);
    },

    /**
     * Returns the internal model in ttl format.
     * @param state
     * @returns {any}
     */
    internalModelToTurtle: state => {
      return TranslatorManager.translateToLanguage(
        internalToShacl(state.mShape.model),
        state.format
      );
    },

    /**
     * Get the possible predicates for the given value type.
     * @returns {function(*): string[]}
     */
    predicates: () => type => {
      return possiblePredicates(TERM[type]);
    },

    /**
     * Get the possible object for the currently set predicate.
     */
    objects: () => predicate => {
      return possibleObjects(predicate);
    }
  }
});
