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
     * Save the state and the executed mutations for use in the undo/redo functionality.
     * This method does nothing on its own.
     */
    saveOperation(_, { mutations }) {},

    /**
     * Save a reference to the editor.
     * @param state
     * @param {object} editor the editor object.
     */
    setEditor(state, editor) {
      Vue.set(state, "editor", editor);
    },

    /**
     * Helper mutation. Removes the element at the given index of the given list.
     * @param state
     * @param {array} list the list where the element should be removed.
     * @param {number} index the index of the element that should be removed.
     */
    removeElementFromList(state, { list, index }) {
      list.splice(index, 1);
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
    loadExample({ getters, commit, rootState }) {
      const self = this;
      ParserManager.parse(exampleShapes, ETF["ttl"]).then(model => {
        self.commit("setModel", { model, getters });
        const mutations = [
          { type: "clear" }, // Clear the existing data first.
          {
            type: "setData", // Set the new data.
            payload: {
              name: "example.ttl",
              contents: exampleData,
              extension: "ttl"
            }
          },
          { type: "setModel", payload: { model, getters } } // Set the new model.
        ];

        /* Execute the mutations. */
        mutations.forEach(m => commit(`${m.type}`, m.payload));

        /* Save the state to undo later. */
        commit("saveOperation", { mutations });
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
