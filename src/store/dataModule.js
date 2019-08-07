import Vue from "vue";
import { ETF } from "../util/enums/extensionToFormat";
import ParserManager from "../parsing/parserManager";
import SerializerManager from "../parsing/serializerManager";
import ValidatorManager from "../validation/validatorManager";
import language from "../util/enums/languages";
import getConstraints from "../util/constraintSelector";
import { internalToShacl } from "../parsing/internalParser";
import { downloadFile } from "../util";

/**
 * This module contains everything to handle data imports/exports and validation.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const dataModule = {
  state: {
    format: language.SHACL,
    dataFile: {},
    dataFileExtension: String,
    validationReport: {},
    showValidationReportModal: false
  },
  mutations: {
    /**
     * Set the data file to the given contents.
     * @param state
     * @param contents the contents of a read data file.
     */
    setDataFile(state, contents) {
      Vue.set(state, "dataFile", contents);
    },

    /**
     * Parse the model to the expected format and validate the data file using these shapes.
     * If there is no data file loaded, this will print an error.
     * @param state
     * @param model
     */
    validateWithModel(state, model) {
      if (state.dataFile.length > 0) {
        SerializerManager.serialize(internalToShacl(model), ETF.ttl)
          .then(shapes => {
            ValidatorManager.validate(state.dataFile, shapes, state.format)
              .then(report => {
                state.validationReport = report;
                state.showValidationReportModal = true;
              })
              .catch(e => console.error(`Error while validating: ${e}`));
          })
          .catch(e => console.error(`Error while serializing: ${e}`));
      } else {
        console.error("No data file loaded.");
      }
    }
  },
  actions: {
    /**
     * Recieves a datafile and takes its content to the state
     * @param state
     * @param commit
     * @param file The file containing data to check on
     * */
    uploadDataFile({ state, commit }, file) {
      const reader = new FileReader();
      state.dataFileExtension = file.name.split(".").pop();
      reader.readAsText(file);
      reader.onload = event => commit("setDataFile", event.target.result);
    },

    /**
     * Takes a file, reads the extension and depending on the format uses the correct parser to turn it into an intern model
     * @param _
     * @param file The uploaded file
     * */
    uploadSchemaFile(_, file) {
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
      this.commit("validateWithModel", rootState.mShape.model);
    },

    /**
     * Export the internal model to a file.
     * // FIXME the default is SHACL for now
     * @param rootState
     * @param filename
     */
    exportFileWithName({ rootState, rootGetters }, args) {
      const { filename, extension } = args;
      const type = ETF[extension];
      if (extension === "json") {
        downloadFile(
          filename,
          JSON.stringify(rootGetters.internalModelToJson, null, 2)
        );
      } else {
        SerializerManager.serialize(
          internalToShacl(rootState.mShape.model),
          type
        ).then(e => downloadFile(filename, e));
      }
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
