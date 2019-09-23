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
import { exampleData, exampleShapes } from "../assets/example";
import ParserManager from "../parsing/parserManager";
import { ETF } from "../util/enums/extensionToFormat";
import {config} from "@vue/test-utils";

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
     * Default empty state. This method is required by the VuexUndoRedo plugin.
     */
    emptyState() {
      console.log("emptyState");
      this.replaceState({
        editor: null,
        showClearModal: false,
        showExportModal: false,
        pathModal: {
          show: false,
          editing: false,
          shapeID: ""
        },
        exportType: "",
        mData: dataModule.state,
        mConfig: configModule.state,
        mShape: shapeModule.state
      });
    },

    /**
     * TODO
     * Save the state to use the VuexUndoRedoPlugin.
     */
    saveState() {
      // Is it enough to do nothing? FIXME
    },

    /**
     * Save a reference to the editor.
     * @param state
     * @param {object} editor the editor object.
     */
    setEditor(state, editor) {
      Vue.set(state, "editor", editor);
    },

    /* MODALS ======================================================================================================= */

    /**
     * Toggle the visibility of the clear modal.
     * @param state
     */
    toggleClearModal(state) {
      event.preventDefault();
      Vue.set(state, "showClearModal", !state.showClearModal);
    },

    /**
     * Toggle the visibility of the path modal.
     * @param state
     * @param {boolean} editing indicates if we are editing the path; default: false.
     * @param {string} shapeID the ID of the shape whose path we are editing; default: "".
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
     * @param {string} type the type of file we want to export.
     */
    toggleExportModal(state, type) {
      event.preventDefault();
      Vue.set(state, "exportType", type);
      Vue.set(state, "showExportModal", !state.showExportModal);
    }
  },
  actions: {
    /**
     * Load in some example data.
     */
    loadExample({ getters }) {
      const self = this;
      /* Clear the existing data first. */
      this.commit("clear");
      /* Set the new data. */
      this.commit("setData", {
        name: "example.ttl",
        contents: exampleData,
        extension: "ttl"
      });
      /* Set the new model. */
      ParserManager.parse(exampleShapes, ETF["ttl"]).then(model => {
        self.commit("setModel", { model, getters });
      });
    }
  },
  getters: {
    /**
     * Returns the internal model in SHACL, JSON format.
     * @param state
     * @returns {any} SHACL model in JSON
     */
    internalModelToJson: state => {
      return ShaclTranslator.toSHACLSimple(state.mShape.model);
    },

    /**
     * Returns the internal model in SHACL, Turtle format.
     * @param state
     * @returns {any} SHACL model, Turtle
     */
    internalModelToTurtle: state => {
      return TranslatorManager.translateToLanguage(
        ShaclTranslator.toSHACLSimple(state.mShape.model),
        state.format
      );
    },

    /**
     * Get the possible predicates for the given value type.
     * Type {string} the given value type.
     * @returns {function} getter
     */
    predicates: () => type => {
      return possiblePredicates(TERM[type]);
    },

    /**
     * Get the possible object for the currently set predicate.
     * Predicate {string} the currently set predicate.
     * @returns {function} getter
     */
    objects: () => predicate => {
      return possibleObjects(predicate);
    }
  }
});
