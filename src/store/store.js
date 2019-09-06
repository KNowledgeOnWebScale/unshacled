// Vue
import Vue from "vue";
import Vuex from "vuex";
import namespaces from "../config/config";

// Util
import { possiblePredicates, possibleObjects } from "../util/shacl/vocabulary";
import { ETF } from "../util/enums/extensionToFormat";

// Translation
import TranslatorManager from "../translation/translatorManager";
import ParserManager from "../parsing/parserManager";
import ShaclTranslator from "../translation/shaclTranslator";
import { TERM } from "../translation/terminology";

// Modules
import shapeModule from "./shapeModule";
import dataModule from "./dataModule";
import { exampleData, exampleShapes } from "../assets/example";
import { swapKeyValue } from "../util";

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
    namespaceModal: {
      show: false,
      editRow: "",
      editField: "",
      input: ""
    },
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

    /* NAMESPACE MODAL ============================================================================================== */

    /**
     * Toggle the visibility of the namespace modal.
     * @param state
     * @param bool {boolean} indicates if the modal should be shown.
     */
    toggleNamespaceModal(state, bool = true) {
      event.preventDefault();
      Vue.set(state.namespaceModal, "show", bool);
    },

    /**
     * TODO
     * @param state
     * @param args
     */
    startEditingNamespace(state, args) {
      const { editRow, editField } = args;
      Vue.set(state.namespaceModal, "editRow", editRow);
      Vue.set(state.namespaceModal, "editField", editField);
    },

    /**
     * Clear the edit fields for the namespace modal.
     * @param state
     */
    clearTableEdit(state) {
      Vue.set(state.namespaceModal, "editRow", "");
      Vue.set(state.namespaceModal, "editField", "");
      Vue.set(state.namespaceModal, "input", "");
    },

    /**
     * Update the given prefix in the namespaces config.
     * @param state
     * @param args
     */
    updateNamespacePrefix(state, args) {
      const { prefix, uri } = args;
      const oldPrefix = swapKeyValue(namespaces)[uri];
      Vue.delete(namespaces, oldPrefix);
      Vue.set(namespaces, prefix, uri);
    },

    /**
     * Update the URI of the given prefix in the namespaces config.
     * @param state
     * @param args
     */
    updateNamespaceURI(state, args) {
      const { prefix, uri } = args;
      Vue.set(namespaces, prefix, uri);
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
     * @param args
     */
    togglePathModal(state, args = {}) {
      event.preventDefault();
      const { editing, shapeID } = args;
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
      this.commit("setDataFile", {
        name: "example.ttl",
        contents: exampleData,
        extension: "ttl"
      }); // Set the data.
      ParserManager.parse(exampleShapes, ETF["ttl"]).then(model => {
        self.commit("setModel", { model, getters }); // Set the shapes.
      });
    },

    /**
     * TODO
     * @param state
     * @param commit
     * @param args
     */
    stopEditingNamespace({ state, commit }, args) {
      const { input } = args;
      const { editRow, editField } = state.namespaceModal;
      const mutation =
        editField === "prefix" ? "updateNamespacePrefix" : "updateNamespaceURI";
      commit(mutation, { editRow, uri: input });
      commit("clearTableEdit");
      console.log(state.namespaceModal);
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
