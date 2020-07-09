import Vue from "vue";
import constraintModule from "./constraintModule";
import { generateUUID, getNonOverlappingCoordinates } from "../util";
import coordinateModule from "./coordinateModule";
import { LABEL, SHACL_URI } from "../util/constants";
import { TERM } from "../translation/terminology";
import getValueType from "../util/enums/ValueType";
import ShaclTranslator from "../translation/shaclTranslator";

/**
 * This module contains everything to modify the shapes.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const shapeModule = {
  state: {
    model: [],
    shapeModal: {
      show: false,
      id: "",
      label: "",
      labelLang: "em",
      description: "",
      descrLang: "en",
      nodeShape: false
    }
  },

  modules: {
    mConstraint: constraintModule,
    mCoordinate: coordinateModule
  },

  mutations: {
    /**
     * Clear all shapes and properties from the current state.
     * @param state
     */
    clearModel(state) {
      Vue.set(state, "model", []);
      this.commit("clearLocations");
    },

    /**
     * Set the model to the given value.
     * @param state
     * @param {object} model the model we want to set.
     * @param {object} getters the store's getters.
     * @param rootState
     */
    setModel(state, { model, getters }) {
      /* Parse the model if necessary. */
      model = JSON.stringify(model).includes(SHACL_URI)
        ? ShaclTranslator.toModelSimple(model)
        : model;
      model = JSON.parse(JSON.stringify(model));
      Vue.set(state, "model", model);

      /* Update y values and set coordinates. */
      for (const shape of state.model) {
        this.commit("updateYValues", {
          shapeID: shape["@id"],
          shapes: state.model
        });
        const { x, y } = getNonOverlappingCoordinates({
          coordinates: state.mCoordinate.coordinates,
          bottomYs: getters.allBottomYs,
          heights: state.mCoordinate.heights
        });
        this.commit("updateCoordinates", { shapeID: shape["@id"], x, y });
      }
    },

    /**
     * Toggle the visibility of the node shape modal.
     * @param state
     * @param {string} id the ID of the shape we want to edit.
     * @param {string} label the current label/name of the shape.
     * @param {string} labelLang the language of the label/name.
     * @param {string} description the current description of the shape.
     * @param {string} descrLang the language of the description.
     */
    toggleEditShapeModal(
      state,
      { id, label, labelLang, description, descrLang }
    ) {
      event.preventDefault();
      Vue.set(state, "shapeModal", {
        id: id || "",
        label: label || "",
        labelLang: labelLang || "en",
        description: description || "",
        descrLang: descrLang || "en",
        show: !state.shapeModal.show
      });
    },

    /* ADD ========================================================================================================== */

    /**
     * Add the given shape to the state and set its coordinates to zero.
     * @param state
     * @param {object} shape the shape we want to add.
     * @param {object} bottomYs all the current shape's bottom y coordinates.
     */
    addShape(state, { shape, bottomYs }) {
      state.model.push(shape);
      /* Determine the shape's coordinates. */
      const { x, y } = getNonOverlappingCoordinates({
        coordinates: state.mCoordinate.coordinates,
        bottomYs,
        heights: state.mCoordinate.heights
      });
      /* Set the shape's coordinates. */
      Vue.set(state.mCoordinate.coordinates, shape["@id"], { x, y });
      this.commit("updateYValues", {
        shapeID: shape["@id"],
        shapes: state.model
      });
    },

    /* EDIT ========================================================================================================= */

    /**
     * Update the shape's ID.
     * @param state
     * @param {number} index the index of the shape that should be updated.
     * @param {string} newID the shape's new ID.
     */
    updateShapeID(state, { index, newID }) {
      Vue.set(state.model[index], "@id", newID);
    },

    /**
     * Update the value of the shape with the given ID to the given value.
     * @param state
     * @param {string} shapeID the ID of the shape we want to update.
     * @param {object} value the new shape value.
     */
    updateShape(state, { shapeID, value }) {
      Vue.set(state.model, shapeID, value);
    },

    /* DELETE ======================================================================================================= */

    /**
     * Delete the shape at the given index.
     * @param state
     * @param {number} index the index of the shape we want to delete.
     */
    deleteShapeAtIndex(state, index) {
      Vue.delete(state.model, index);
    },

    /**
     * Delete the property with the given ID from the given shape.
     * @param state
     * @param {object} shape the shape object from which the property should be removed.
     * @param {string} propertyID the ID of the property that should be removed.
     */
    deletePropertyFromShape(state, { shape, propertyID }) {
      const properties = shape[TERM.property];
      let index = -1;

      /* Determine the index of the property in the constraint. */
      for (const p in properties) {
        if ([properties[p], properties[p]["@id"]].includes(propertyID))
          index = p;
      }

      if (index >= 0) {
        /* Delete the constraint value corresponding to the property from the shape. */
        this.dispatch("deleteConstraintValueWithIndex", {
          shapeID: shape["@id"],
          constraintID: TERM.property,
          valueIndex: index
        });
      }
    }
  },

  actions: {
    /* ADD ========================================================================================================== */

    /**
     * Add an empty node shape with a generated UUID.
     * @param store
     */
    addNodeShape({ commit, getters }) {
      const shape = {
        "@id": generateUUID(getters.baseURI),
        "@type": [TERM.NodeShape]
      };
      commit("addShape", { shape, bottomYs: getters.allBottomYs });
    },

    /**
     * Add a new property shape with a generated UUID and a given path.
     * @param store
     * @param {string} path the new shape's path.
     */
    addPropertyShape({ commit, getters }, { path }) {
      const shape = { "@id": generateUUID(getters.baseURI) };
      shape[TERM.path] = [{ "@id": path }];
      commit("addShape", { shape, bottomYs: getters.allBottomYs });
    },

    /* EDIT ========================================================================================================= */

    /**
     * Edit the ID of a shape.
     * This will update the constraint values of every node shape that contains this shape.
     * @param store
     * @param {string} oldID the original ID of the shape we want to edit.
     * @param {string} newID the new ID for this shape.
     */
    editShape({ state, getters, commit, dispatch }, { oldID, newID }) {
      /* Check if the new ID is different from the old ID to avoid unexpected errors. */
      if (oldID !== newID) {
        /* Update the shape's locations. */
        commit("updateLocations", { oldID, newID });

        /* Update the state's shapes. */
        const index = getters.indexWithID(oldID);
        commit("updateShapeID", { index, newID });

        /* Check if another shape has a reference to this one. */
        for (const shape of state.model) {
          for (const predicate of Object.keys(shape)) {
            const constraint = shape[predicate];
            const valueType = getValueType(predicate);
            if (valueType) {
              // Determine which list we have to loop.
              const iter =
                constraint.length > 1
                  ? constraint
                  : valueType.includes("List")
                  ? constraint[0]["@list"]
                  : constraint;

              // Iterate over every element.
              for (const elem of iter) {
                const key = valueType.includes("id") ? "@id" : "@value";
                if (elem[key] === oldID) {
                  /* Rename the reference if we find one. */
                  dispatch("addPredicate", {
                    shapeID: shape["@id"],
                    predicate,
                    valueType,
                    input: newID
                  });
                  dispatch("deleteConstraintValue", {
                    shapeID: shape["@id"],
                    constraintID: predicate,
                    value: oldID
                  });
                }
              }
            }
          }
        }
        /* Update the y values of the properties. */
        for (const shape of state.model) {
          commit("updateYValues", {
            shapeID: shape["@id"],
            shapes: state.model
          });
        }
      }
    },

    /* DELETE ======================================================================================================= */

    /**
     * Delete the node shape with the given ID.
     * @param store
     * @param {string} id the ID of the node shape that we want to delete.
     */
    deleteNodeShape({ getters, commit }, id) {
      commit("deleteShapeAtIndex", getters.indexWithID(id));
      commit("deleteShapeLocations", id);
    },

    /**
     * Delete the property shape with the given id.
     * @param store
     * @param {string} id the ID of the property shape we want to delete.
     */
    deletePropertyShape({ state, getters, commit }, id) {
      /* Check every nodeShape if it contains the given property. */
      for (const shape of state.model) {
        if (getters.shapeProperties(shape["@id"]).includes(id)) {
          commit("deletePropertyFromShape", { shape, propertyID: id });
        }
      }
      /* Remove the property from the state. */
      commit("deleteShapeAtIndex", getters.indexWithID(id));
      commit("deleteShapeLocations", id);
    }
  },

  getters: {
    /**
     * Get a map of the shapes' IDs to their labels.
     * @param state
     * @param getters
     */
    labelsForIds: (state, getters) => {
      const output = {};
      const { shapes } = getters;
      // Get the label of every shape.
      for (const shapeID of Object.keys(shapes)) {
        /* NodeShapes have a label. */
        const label = shapes[shapeID][LABEL];
        if (label) output[shapeID] = label[0]["@value"];

        /* PropertyShapes have a name. */
        const name = shapes[shapeID][TERM.name];
        if (name) output[shapeID] = name[0]["@value"];
      }
      return output;
    },

    /**
     * Returns a map of the shape ID's to their respective objects.
     * @param state
     */
    shapes(state) {
      const shapes = {};
      for (const item of state.model) shapes[item["@id"]] = item;
      return shapes;
    },

    /**
     * Returns a list of the shape IDs.
     * @param state
     * @param getters
     */
    shapeIDs(state, getters) {
      return Object.keys(getters.shapes);
    },

    /**
     * Get a dictionary mapping ID's to the respective node shape objects.
     * @param state
     */
    nodeShapes(state) {
      const nodeShapes = {};
      for (const item of state.model) {
        if (item["@type"]) nodeShapes[item["@id"]] = item;
      }
      return nodeShapes;
    },

    /**
     * Get a dictionary mapping ID's to the respective property shape objects.
     * @param state
     */
    propertyShapes(state) {
      const propertyShapes = {};
      for (const item of state.model) {
        if (!item["@type"]) propertyShapes[item["@id"]] = item;
      }
      return propertyShapes;
    },

    /**
     * Get a list of relationships.
     * Every relationship object has a reference to its destination and source shape,
     *   the ID of the constraint it represents
     *   and an object that indicates what it should do when the relationship arrow is clicked.
     * @param state
     * @param getters
     */
    relationships: (state, getters) => {
      const { shapes } = getters;
      const output = [];

      /* Check every shape. */
      for (const shapeID of Object.keys(shapes)) {
        const idConstraints = getters.shapeIDConstraints(shapeID);

        /* Handle every constraint. */
        for (const constraintID of Object.keys(idConstraints)) {
          for (const idValue of idConstraints[constraintID]) {
            /* Create an object to represent the relationship. */
            output.push({
              from: shapeID,
              to: idValue,
              constraintID,
              onClick: { shapeID, constraintID, value: idValue }
            });
          }
        }
      }
      return output;
    },

    /**
     * Get the shape object with the given ID.
     * @param state
     * @returns {Object|null} the shape with the given ID, if there is one.
     */
    shapeWithID: state => id => {
      for (const item of state.model) if (item["@id"] === id) return item;
      return null;
    },

    /**
     * Get the index of the shape object with the given ID.
     * @param state
     * @returns {number} the index of the shape with the given ID; -1 if there is none.
     */
    indexWithID: state => id => {
      for (const i in state.model) if (state.model[i]["@id"] === id) return i;
      return -1;
    }
  }
};

export { shapeModule as default };
