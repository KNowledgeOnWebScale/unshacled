import Vue from "vue";
import constraintModule from "./constraintModule";
import { extractUrl, urlToName } from "../util/urlParser";
import { getNonOverlappingCoordinates } from "../util";
import coordinateModule from "./coordinateModule";
import { LABEL, SHACL_URI } from "../util/constants";
import { TERM } from "../translation/terminology";
import getValueType from "../util/enums/ValueType";
import ShaclTranslator from "../translation/shaclTranslator";

/**
 * This module contains everything to change the shapes.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const shapeModule = {
  state: {
    model: [],
    idToLabel: {},
    shapeModal: {
      show: false,
      id: "",
      label: "",
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
     * @param state the current state
     */
    clear(state) {
      state.model = [];
      this.commit("clearLocations");
    },

    /**
     * Set the model to the given value. Parse to internal value if necessary.
     * @param state
     * @param args
     */
    setModel(state, args) {
      const { model } = args;
      const { getters } = args;

      // Parse the model if necessary.
      state.model = JSON.stringify(model).includes(SHACL_URI)
        ? ShaclTranslator.toModelSimple(model)
        : model;

      // Update y values and set coordinates to zero
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
     * @param args
     */
    toggleEditShapeModal(state, args) {
      event.preventDefault();
      if (!args) args = { id: "", label: "" };
      args.show = !state.shapeModal.show;
      args.label = args.label ? args.label : "";
      Vue.set(state, "shapeModal", args);
    },

    /* ADD ========================================================================================================== */

    /**
     * Add the given shape to the state and set its coordinates to zero.
     * @param state
     * @param args
     */
    addShape(state, args) {
      const { object, bottomYs } = args;
      state.model.push(object);
      const { x, y } = getNonOverlappingCoordinates({
        coordinates: state.mCoordinate.coordinates,
        bottomYs,
        heights: state.mCoordinate.heights
      });
      Vue.set(state.mCoordinate.coordinates, object["@id"], { x, y });
      this.commit("updateYValues", {
        shapeID: object["@id"],
        shapes: state.model
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
      const { index, oldID, newID, label } = args;
      Vue.set(state.model[index], "@id", newID);

      // Update the label dictionary.
      Vue.set(state.idToLabel, newID, label);
      if (oldID !== newID) Vue.delete(state.idToLabel, oldID);
    },

    /**
     * Update the value of the shape with the given ID to the given value.
     * @param state
     * @param args
     */
    updateShape(state, args) {
      const { shapeID, value } = args;
      Vue.set(state.model, shapeID, value);
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
     *            shape the shape object from which the property should be removed.
     *            propertyID the ID of the property that should be removed.
     */
    deletePropertyFromShape(state, args) {
      const { shape, propertyID } = args;
      const properties = shape[TERM.property];
      let index = -1;

      for (const p in properties) {
        if ([properties[p], properties[p]["@id"]].includes(propertyID))
          index = p;
      }

      if (index >= 0) {
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
     * Add an empty node shape with the given id.
     * @param store
     * @param id
     */
    addNodeShape({ commit, getters }, id) {
      const object = {
        "@id": id,
        "@type": [TERM.NodeShape]
      };

      commit("addShape", { object, bottomYs: getters.allBottomYs });
    },

    /**
     * Add a property shape with the given id.
     * @param store
     * @param args
     */
    addPropertyShape({ commit, getters }, args) {
      const { id, path } = args;
      // Only do so if there is no property shape with this ID yet.
      if (!getters.shapeWithID(id)) {
        const object = { "@id": id };
        object[TERM.path] = [{ "@id": path }];
        commit("addShape", { object, bottomYs: getters.allBottomYs });
      }
    },

    /* EDIT ========================================================================================================= */

    /**
     * Edit the id of the given node shape.
     * @param store
     * @param args
     *    oldID: the old ID we want to change.
     *    newID: the new ID for the node shape.
     */
    editNodeShape({ getters, commit }, args) {
      const { oldID, newID, newLabel } = args;
      const newURL = extractUrl(oldID) + urlToName(newID);

      // If the ID has changed
      if (oldID !== newURL) {
        // Update the shape's ID and locations
        const index = getters.indexWithID(oldID);
        commit("updateShapeID", {
          index,
          oldID,
          newID: newURL,
          label: newLabel
        });
        commit("updateLocations", { oldID, newID: newURL });
      }
    },

    /**
     * Edit the ID of a property shape.
     * This will update the property list of every node shape that contains this property shape.
     * @param store
     * @param args
     */
    editPropertyShape({ state, getters, commit, dispatch }, args) {
      const { oldID, newID, newLabel } = args;
      // Check if the new ID is differen from the old ID to avoid unexpected errors.
      if (oldID !== newID) {
        // Update the shape's locations.
        commit("updateLocations", { oldID, newID });

        // Update the state's shapes.
        const index = getters.indexWithID(oldID);
        commit("updateShapeID", {
          index,
          oldID,
          newID,
          label: newLabel
        });

        // Check if another shape has a reference to this one.
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
                  // Rename the reference.
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

        // Update the y values of the properties.
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
     * Delete the node shape with the given id.
     * @param store
     * @param id
     */
    deleteNodeShape({ getters, commit }, id) {
      commit("deleteShapeAtIndex", getters.indexWithID(id));
      commit("deleteShapeLocations", id);
    },

    /**
     * Delete the property shape with the given id.
     * @param store
     * @param id
     */
    deletePropertyShape({ state, getters, commit }, id) {
      // Check every nodeShape if it contains the given property.
      for (const shape of state.model) {
        // NOTE: This actually is a valid number of arguments.
        if (getters.shapeProperties(shape["@id"]).includes(id)) {
          commit("deletePropertyFromShape", { shape, propertyID: id });
        }
      }
      // Remove the property from the state
      commit("deleteShapeAtIndex", getters.indexWithID(id));
      commit("deleteShapeLocations", id);
    }
  },
  getters: {
    /**
     * Get the label of the shape with the given ID.
     * @param state
     * @param getters
     */
    labelForId: (state, getters) => id => {
      const output = {};
      const { shapes } = getters;
      // Get the label of every shape.
      for (const shapeID of Object.keys(shapes)) {
        const label = shapes[shapeID][LABEL];
        if (label) output[shapeID] = label[0]["@value"];
      }
      return output[id];
    },

    /**
     * Returns a map of the shape ID's to their respective objects.
     * @param state
     */
    shapes(state) {
      const shapes = {};
      for (const item of state.model) {
        shapes[item["@id"]] = item;
      }
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
        if (item["@type"]) {
          nodeShapes[item["@id"]] = item;
        }
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
        if (!item["@type"]) {
          propertyShapes[item["@id"]] = item;
        }
      }
      return propertyShapes;
    },

    /**
     * TODO
     * @param state
     * @param getters
     */
    relationships: (state, getters) => {
      const { shapes } = getters;
      const output = [];

      // Check every shape.
      for (const shapeID of Object.keys(shapes)) {
        const idConstraints = getters.shapeIDConstraints(shapeID);

        // Handle every constraint.
        for (const constraintID of Object.keys(idConstraints)) {
          for (const idValue of idConstraints[constraintID]) {
            // Create an object to represent the relationship.
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
     * @returns {Object|null}
     */
    shapeWithID: state => id => {
      for (const item of state.model) {
        if (item["@id"] === id) return item;
      }
      return null;
    },

    /**
     * Get the index of the shape object with the given ID.
     * @param state
     * @returns {number}
     */
    indexWithID: state => id => {
      for (const i in state.model) {
        if (state.model[i]["@id"] === id) return i;
      }
      return -1;
    }
  }
};

export { shapeModule as default };
