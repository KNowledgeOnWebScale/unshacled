// Vue imports
import { clone } from "ramda";
import Vue from "vue";
import Vuex from "vuex";

// Util imports
import { getNonOverlappingCoordinates } from "./util";
import EXAMPLE from "./util/examples";
import { urlToName } from "./util/nameParser";
import { possiblePredicates, possibleObjects } from "./util/vocabulary";

// Parsing, translation and validation imports
import { TranslatorManager } from "./translation/translatorManager";
import ShaclDictionary from "./translation/shaclDictionary";

// Modules
import shapeModule from "./store/shapeModule";
import dataModule from "./store/dataModule";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: null,
    model: [],
    // relationships: {}, // TODO remove this
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
    shapeModule,
    dataModule
  },
  mutations: {
    changePredicate(state, pred) {
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

    /**
     * Clear all shapes and properties from the current state.
     * @param state the current state
     */
    clear(state) {
      console.log("Clear!");
      state.model = [];
      this.commit("clearLocations");
    },

    /* ADD ========================================================================================================== */

    /**
     * Add the given shape to the state and set its coordinates to zero.
     * @param state
     * @param object
     */
    addShape(state, object) {
      state.model.push(object);
      const { x, y } = getNonOverlappingCoordinates({
        coordinates: state.shapeModule.coordinates
      });
      Vue.set(state.coordinates, object["@id"], { x, y });
      this.commit("updateYValues", {
        nodeID: object["@id"],
        model: state.model
      });
    },

    /**
     * Add a property with the given ID and value to the node with the given ID.
     * @param state
     * @param args
     */
    addPropertyToShape(state, args) {
      const { nodeID, propertyID, propertyValue } = args;
      // FIXME should not be put in list if it is a list already
      Vue.set(state.model[nodeID], propertyID, [propertyValue]);
      // TODO complete this
    },

    /**
     * Add the given property ID to the given shape.
     * @param state
     * @param args
     *            propertyID the ID of the property that should be added.
     *            shape the shape the property should be added to.
     */
    addPropertyIDToShape(state, args) {
      const { propertyID, shape } = args;
      // FIXME this assumes properties, not constraints or targetNodes or sth
      const p = shape["https://2019.summerofcode.be/unshacled#property"];
      if (!p) {
        shape["https://2019.summerofcode.be/unshacled#property"] = [];
      }
      shape["https://2019.summerofcode.be/unshacled#property"].push({
        "@id": propertyID
      });
    },

    /* EDIT ========================================================================================================= */

    /**
     * Update the shape's id.
     * @param state
     * @param args
     *            index the index of the shape that should be updated.
     *            newID the shape's new ID.
     */
    updateShapeID(state, args) {
      const { index, newID } = args;
      Vue.set(state.model[index], "@id", newID);
    },

    /**
     * Update the given property shape's ID.
     * @param state
     * @param args
     *            shape the property shape that should be updated,
     *            newID the shape's new ID.
     */
    updatePropertyShapeID(state, args) {
      const { shape, newID } = args;
      Vue.set(shape, "@id", newID);

      // Update the path with the new ID.
      const name = urlToName(newID);
      shape["https://2019.summerofcode.be/unshacled#path"][0][
        "@id"
      ] = `http://example.org/ns#${name}`;
    },

    /**
     * Set the model to the given value.
     * @param state
     * @param model
     */
    setModel(state, model) {
      state.model = model;

      // Update y values and set coordinates to zero
      for (const shape of state.model) {
        this.commit("updateYValues", {
          nodeID: shape["@id"],
          model: state.model
        });
        const { x, y } = getNonOverlappingCoordinates({
          coordinates: state.shapeModule.coordinates
        });
        Vue.set(state.shapeModule.coordinates, shape["@id"], { x, y });
      }
    },

    /* DELETE ======================================================================================================= */

    /**
     * Delete the shape at the given index.
     * @param state
     * @param index
     */
    deleteShapeAtIndex(state, index) {
      Vue.delete(state.model, index);
    },

    /**
     * Delete the property with the given ID from the given shape.
     * @param state
     * @param args
     *            shape the shape from which the property should be removed..
     *            propertyID the ID of the property that should be removed.
     */
    deletePropertyFromShape(state, args) {
      const { shape, propertyID } = args;
      const properties =
        shape["https://2019.summerofcode.be/unshacled#property"];
      for (const p in properties) {
        if (properties[p]["@id"] === propertyID) Vue.delete(properties, p);
      }
      Vue.set(
        shape,
        "https://2019.summerofcode.be/unshacled#property",
        properties
      );
    },

    /**
     * TODO
     * @param store
     * @param args
     */
    deleteConstraintFromShape(state, args) {
      const { shape, constraint } = args;
      Vue.delete(shape, constraint);
    },

    /* MODALS ======================================================================================================= */

    /**
     * TODO
     * @param state
     */
    toggleValidationReport(state) {
      event.preventDefault();
      state.dataModule.showValidationReportModal = !state.dataModule
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
     * Takes two keys from nodeshapes and uses them to add a relationship to the state
     * @param state
     * @param keys contains two keys, which can be queried using keys.one and keys.two.
     */
    /*
    addRelationship(state, keys) {
      Vue.set(state.relationships, keys.one + keys.two, {
        "@id": keys.one + keys.two,
        one: keys.one,
        two: keys.two,
        coords: [
          state.coordinates[keys.two].x,
          state.coordinates[keys.two].y,
          state.coordinates[keys.one].y,
          state.coordinates[keys.one].x
        ]
      });
    },
     */

    /**
     * Load in some example data.
     */
    loadExample() {
      console.log("Loading example...");
      this.commit("clear"); // Clear the existing data first.

      const example = EXAMPLE.model[0];
      const newModel = [];
      for (const element of example) {
        newModel.push(clone(element)); // Deep copy
      }
      this.commit("setModel", newModel);
    }
  },
  getters: {
    /**
     * Returns the Json Internal model.
     * @param state
     * @returns {*}
     */
    internalModelToJson: state => {
      return state.model;
    },

    /**
     * Returns the internal model in ttl format.
     * @param state
     * @returns {any}
     */
    internalModelToTurtle: state => {
      return TranslatorManager.translateToLanguage(state.model, state.format);
    },

    /**
     * TODO
     * @returns {function(*): string[]}
     */
    predicates: () => type => {
      return possiblePredicates(ShaclDictionary.TERM[type]);
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
