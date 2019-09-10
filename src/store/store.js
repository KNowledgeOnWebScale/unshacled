// Vue
import Vue from "vue";
import Vuex from "vuex";

// Util
import { possiblePredicates, possibleObjects } from "../util/shacl/vocabulary";

// Translation
import TranslatorManager from "../translation/translatorManager";
import ShaclTranslator from "../translation/shaclTranslator";
import { TERM } from "../translation/terminology";

// Modules
import shapeModule from "./shapeModule";
import dataModule from "./dataModule";
import configModule from "./configModule";
import {exampleData, exampleShapes, exampleShapesJSON} from "../assets/example";
import ParserManager from "../parsing/parserManager";
import {ETF} from "../util/enums/extensionToFormat";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: null,
    showClearModal: false,
    showExportModal: false,
    pathModal: {
      show: false,
      editing: false,
      shapeID: ""
    },
    exportType: ""
  },
  modules: {
    mShape: shapeModule,
    mData: dataModule,
    mConfig: configModule
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
     * Toggle the visibility of the clear modal.
     * @param state
     */
    toggleClearModal(state) {
      event.preventDefault();
      state.showClearModal = !state.showClearModal;
    },

    /**
     * Toggle the visibility of the path modal.
     * @param state
     * @param editing {boolean}
     * @param shapeID {string}
     */
    togglePathModal(state, { editing, shapeID }) {
      event.preventDefault();
      const { show } = state.pathModal;
      Vue.set(state.pathModal, "editing", editing || false);
      Vue.set(state.pathModal, "shapeID", shapeID || "");
      Vue.set(state.pathModal, "show", !show);
    },

    /**
     * Toggle the visibility of the export modal.
     * @param state
     * @param type
     */
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
      const self = this;
      this.commit("clear"); // Clear the existing data first.
      this.commit("setData", {
        name: "example.ttl",
        contents: exampleData,
        extension: "ttl"
      }); // Set the data.
      ParserManager.parse(exampleShapes, ETF["ttl"]).then(model => {
        self.commit("setModel", { model, getters }); // Set the shapes.
      });
    }
  },
  getters: {
    /**
     * Returns the Json Internal model.
     * @param state
     * @returns {*}
     */
    internalModelToJson: state => {
      return ShaclTranslator.toSHACLSimple(state.mShape.model);
    },

    /**
     * Returns the internal model in ttl format.
     * @param state
     * @returns {any}
     */
    internalModelToTurtle: state => {
      return TranslatorManager.translateToLanguage(
        ShaclTranslator.toSHACLSimple(state.mShape.model),
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
