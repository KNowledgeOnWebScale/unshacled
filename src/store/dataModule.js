import Vue from "vue";
import { ETF } from "../util/enums/extensionToFormat";
import ParserManager from "../parsing/parserManager";
import SerializerManager from "../parsing/serializerManager";
import ValidatorManager from "../validation/validatorManager";
import language from "../util/enums/languages";
import getConstraints from "../util/constraintSelector";
import { internalToShacl } from "../parsing/internalParser";

/**
 * This module contains everything to handle data imports/exports and validation.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const dataModule = {
  state: {
    format: language.SHACL,
    dataFile: {},
    dataFileExtension: String,
    validationReport: "hello",
    showValidationReportModal: false,
    showNoDataFileModal: false
  },
  mutations: {
    /**
     * Recieves a datafile and takes its content to the state
     * @param state
     * @param file The file containing data to check on
     * */
    uploadDataFile(state, file) {
      const reader = new FileReader();
      state.dataFileExtension = file.name.split(".").pop();
      reader.readAsText(file);
      reader.onload = function(event) {
        state.dataFile = event.target.result;
      };
    },

    /**
     * Takes a file, reads the extension and depending on the format uses the correct parser to turn it into an intern model
     * @param state
     * @param file The uploaded file
     * */
    uploadSchemaFile(state, file) {
      const reader = new FileReader();
      const fileExtension = file.name.split(".").pop();
      const type = ETF[fileExtension];
      const self = this;

      reader.readAsText(file);
      reader.onload = function(event) {
        ParserManager.parse(event.target.result, type).then(e => {
          self.dispatch("updateModel", e);
        });
      };
    },

    /**
     * TODO
     * @param state
     * @param model
     */
    validateWithModel(state, model) {
      if (state.dataFile.length === 0) {
        this.commit("toggleNoDataFilePopup");
      } else {
        console.log("Serializing...");
        SerializerManager.serialize(model, ETF.ttl)
          .then(e => {
            console.log("Validating...");
            ValidatorManager.validate(state.dataFile, e, state.format)
              .then(e => {
                console.log("validationReport", e);
                state.validationReport = e;
                state.showValidationReportModal = true;
              })
              .catch(e => console.log(`Error while validating: ${e}`));
          })
          .catch(e => console.log(`Error while serializing: ${e}`));
      }
    },

    toggleNoDataFilePopup(state) {
      Vue.set(state, "showNoDataFileModal", !state.showNoDataFileModal);
    }
  },
  actions: {
    /**
     * Set the model to the given one.
     * @param commit
     * @param getters
     * @param model
     */
    updateModel({ commit, rootGetters }, model) {
      commit("setModel", { model, getters: rootGetters }, { root: true });
    },

    /**
     * Validate the interal model.
     * @param rootState
     */
    validate({ rootState }) {
      this.commit("validateWithModel", rootState.model);
    },

    /**
     * Export the internal model to a file.
     * // TODO parse the JSON to Turtle
     * // FIXME the default is SHACL for now
     * @param rootState
     * @param filename
     */
    exportFileWithName({ rootState }, filename) {
      const text = JSON.stringify(
        internalToShacl(rootState.mShape.model),
        null,
        2
      );

      const element = document.createElement("a");
      element.setAttribute(
        "href",
        `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  },
  getters: {
    /**
     * Get all the constraints for the current format.
     * @param state
     * @returns {null}
     */
    validators: state => {
      return getConstraints(state.format);
    },

    /**
     * TODO
     * @param state
     * @returns {string}
     */
    validationReport: state => {
      return state.ValidationReport;
    }
  }
};

export { dataModule as default };
