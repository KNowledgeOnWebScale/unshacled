import Vue from "vue";
import constraintModule from "./constraintModule";
import { extractUrl, urlToName } from "../parsing/urlParser";
import { getNonOverlappingCoordinates } from "../util";
import coordinateModule from "./coordinateModule";
import { EXAMPLE_URI, SHACL_URI } from "../util/constants";
import { shaclToInternal } from "../parsing/internalParser";
import { TERM } from "../translation/terminology";

/**
 * This module contains everything to change the shapes.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const shapeModule = {
  state: {
    model: []
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
      console.log("Clear!");
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
        ? shaclToInternal(model)
        : model;

      // Update y values and set coordinates to zero
      for (const shape of state.model) {
        this.commit("updateYValues", {
          shapeID: shape["@id"],
          shapes: state.model
        });
        const { x, y } = getNonOverlappingCoordinates({
          coordinates: state.mCoordinate.coordinates,
          bottomLefts: getters.allbottomLefts
        });
        this.commit("updateCoordinates", { shapeID: shape["@id"], x, y });
      }
    },

    /* ADD ========================================================================================================== */

    /**
     * Add the given shape to the state and set its coordinates to zero.
     * @param state
     * @param args
     */
    addShape(state, args) {
      const { object, bottomLefts } = args;
      state.model.push(object);
      const { x, y } = getNonOverlappingCoordinates({
        coordinates: state.mCoordinate.coordinates,
        bottomLefts
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
      const { index, newID } = args;
      Vue.set(state.model[index], "@id", newID);
    },

    /**
     * Update the given property shape's ID.
     * @param state
     * @param args
     *            shape the property shapeI that should be updated,
     *            newID the shape's new ID.
     */
    updatePropertyShapeID(state, args) {
      const { shape, newID } = args;
      Vue.set(shape, "@id", newID);

      // Update the path with the new ID.
      const name = urlToName(newID);
      shape[TERM.path][0]["@id"] = `${EXAMPLE_URI}${name}`;
    },

    /**
     * Set the value of the constraint with the given ID to the given value.
     * @param state
     * @param args
     *            shape the shape object that has to be updated.
     *            constraintID the ID of the constraint that should be updated.
     *            value the new value of the given constraint.
     */
    setConstraintValue(state, args) {
      const { shape, constraintID, value } = args;
      console.log("setConstraintValue", JSON.stringify(args.value, null, 2));
      Vue.set(shape, constraintID, value);
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
    },

    /**
     * Delete the given constraint from the given shape object.
     * @param state
     * @param args
     *            shape the shape object that should be updated.
     *            constraint the ID of the constraint that should be deleted.
     */
    deleteConstraintFromShape(state, args) {
      const { shape, constraintID } = args;
      Vue.delete(shape, constraintID);
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

      commit("addShape", { object, bottomLefts: getters.allbottomLefts });
    },

    /**
     * Add a property shape with the given id.
     * @param store
     * @param id
     */
    addPropertyShape({ commit, getters }, id) {
      // Only do so if there is no property shape with this ID yet.
      if (getters.shapeWithID(id)) {
        console.log(`Property shape with id ${id} already exists.`);
      } else {
        const object = { "@id": id };
        object[TERM.path] = [{ "@id": `${EXAMPLE_URI}${id}` }];
        commit("addShape", { object, bottomLefts: getters.allbottomLefts });
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
      const { oldID, newID } = args;
      const newURL = extractUrl(oldID) + newID;

      // If the ID has changed
      if (oldID !== newURL) {
        // Update the shape's ID and locations
        const index = getters.indexWithID(oldID);
        commit("updateShapeID", { index, newID: newURL });
        commit("updateLocations", { oldID, newID: newURL });
      }
    },

    /**
     * Edit the ID of a property shape.
     * This will update the property list of every node shape that contains this property shape.
     * @param store
     * @param args
     */
    editPropertyShape({ state, getters, commit }, args) {
      const { oldID, newID } = args;
      if (oldID !== newID) {
        commit("updateLocations", { oldID, newID });

        // Update the state's shapes.
        const shape = getters.shapeWithID(oldID);
        commit("updatePropertyShapeID", { shape, newID });
        for (const shape of state.model) {
          if (getters.shapeProperties(shape["@id"]).includes(oldID)) {
            this.dispatch("addPredicate", {
              shapeID: shape["@id"],
              predicate: TERM.property,
              valueType: "id",
              input: newID
            });
            commit("deletePropertyFromShape", { shape, propertyID: oldID });
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
     * Get the shape object with the given ID.
     * @param state
     * @returns {null}
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
     * @returns {string|number}
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
