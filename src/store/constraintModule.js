import { clone } from "ramda";
import Vue from "vue";
import { TERM } from "../translation/terminology";
import {
  getConstraintCategory,
  getConstraintValueType
} from "../util/shaclConstraints";
import { extractUrl, urlToName } from "../parsing/urlParser";

/**
 * This module contains everything to change the shape constraints.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const constraintModule = {
  state: {
    predicateModal: {
      show: false,
      shapeID: "",
      shapeType: "",
      category: "",
      predicate: "",
      urls: {},
      input: "",
      object: "",
      constraintType: "",
      editing: false,
      onExit: undefined
    },
    constraintIndex: 0
  },
  mutations: {
    /* PREDICATE MODAL ============================================================================================== */

    /**
     * Toggle the visibility of the predicate modal.
     * @param state
     * @param args
     */
    togglePredicateModal(state, args) {
      if (!args)
        args = { shapeID: "", shapeType: "", onExit: "", editing: false };

      state.predicateModal = {
        ...state.predicateModal,
        show: !state.predicateModal.show,
        shapeID: args.shapeID,
        shapeType: args.shapeType,
        editing: args.editing,
        onExit: args.onExit
      };
    },

    /**
     * Reset the properties of the predicate modal.
     * @param state
     */
    resetPredicateModal(state) {
      state.predicateModal = {
        show: false,
        shapeID: "",
        shapeType: "",
        category: "",
        predicate: "",
        urls: {},
        input: "",
        object: "",
        constraintType: "",
        editing: false,
        onExit: undefined
      };
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
      Vue.set(shape, constraintID, value);
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

    addPredicate({ getters, commit, dispatch, rootState }, args) {
      const { shapeID, predicate, valueType, input, object } = args;
      const shape = getters.shapeWithID(shapeID);

      // Create an empty list to add to if necessary.
      if (!shape[predicate]) {
        shape[predicate] = [];
        if (valueType.includes("List")) shape[predicate].push({ "@list": [] });
      }

      // Create the object we want to add.
      const value = valueType.includes("id")
        ? { "@id": input }
        : { "@type": object, "@value": input };

      // Determine which list we want to add the predicate to.
      const list = valueType.includes("List")
        ? shape[predicate][0]["@list"]
        : shape[predicate];
      list.push(value);

      // Add the predicate to the shape.
      commit("setConstraintValue", {
        shape,
        constraintID: predicate,
        value: shape[predicate]
      });

      // Add a property shape if needed.
      if (predicate.includes("property")) {
        dispatch("addPropertyShape", input);
      }

      // Update the y values.
      commit(
        "updateYValues",
        { shapeID, shapes: rootState.mShape.model },
        { root: true }
      );
      // Toggle the predicate modal.
      if (rootState.mShape.mConstraint.predicateModal.show)
        commit("togglePredicateModal", undefined, { root: true });
    },

    /* EDIT ========================================================================================================= */

    /**
     * TODO
     * @param state
     * @param args
     */
    startConstraintEdit({ state }, args) {
      const { shapeID, shapeType, constraintID, index, value } = args;

      state.constraintIndex = index;
      state.predicateModal = {
        ...state.predicateModal,
        shapeID,
        shapeType,
        category: getConstraintCategory(constraintID),
        predicate: urlToName(constraintID),
        input: value,
        constraintType: getConstraintValueType(constraintID),
        editing: true
      };
      this.commit("togglePredicateModal", {
        shapeID,
        shapeType,
        onExit: "stopConstraintEdit",
        editing: true
      });
    },

    /**
     * TODO
     * @param state
     * @param rootGetters
     * @param args
     */
    stopConstraintEdit({ state, rootGetters }, args) {
      // Update the modal state.
      state.predicateModal.show = false;
      state.predicateModal.editing = false;

      const { shapeID, predicate: constraintID, object, valueType } = args;
      const i = state.constraintIndex;

      let { input } = args;
      if (typeof input === "boolean") input = input.toString();

      // Clone the original constraint and get the value we want to update.
      const updated = clone(rootGetters.shapeWithID(shapeID)[constraintID]);
      const iter = valueType.includes("List") ? updated[0]["@list"] : updated;
      const original = iter[i];

      // Create a new value object.
      let newValue;
      let name;
      if (valueType.includes("id")) {
        name = `${extractUrl(original["@id"])}${urlToName(input)}`;
        newValue = { "@id": name };
      } else {
        name = `${extractUrl(original["@value"])}${urlToName(input)}`;
        newValue = { "@type": object, "@value": name };
      }

      // Check if this new value is a duplicate.
      let duplicate = false;
      const field = valueType.includes("id") ? "@id" : "@value";
      for (const j in iter) {
        if (i !== j && iter[j][field] === name) duplicate = true;
      }

      // Update this value in the original constraint object.
      // `iter` is a reference to the array we have to modify.
      if (duplicate) {
        // Delete the duplicate.
        iter.splice(i, 1);
      } else {
        iter[i] = newValue;
      }

      this.dispatch("updateConstraint", {
        shapeID,
        constraintID,
        newValue: updated
      });
    },

    /**
     * Update the constraint value of the given shape.
     * @param rootGetters
     * @param commit
     * @param args
     *            shapeID the ID of the shape.
     *            constraintID the ID of the constraint we want to update.
     *            value the new value of the given constraint.
     */
    updateConstraint({ rootGetters, commit }, args) {
      const { shapeID, constraintID, newValue } = args;

      commit("setConstraintValue", {
        shape: rootGetters.shapeWithID(shapeID),
        constraintID,
        value: newValue
      });
    },

    /* DELETE ======================================================================================================= */

    /**
     * Delete the given constraint from the given shape.
     * @param store
     * @param args
     *            shapeID the ID of the shape from which the constraint should be removed.
     *            constraint the ID of the constraint that should be removed.
     */
    deleteConstraintFromShapeWithID({ getters, commit, rootState }, args) {
      const { shapeID, constraintID } = args;
      const shape = getters.shapeWithID(shapeID);
      commit(
        "deleteConstraintFromShape",
        { shape, constraintID },
        { root: true }
      );

      // Update the y values
      commit(
        "updateYValues",
        { shapeID, shapes: rootState.mShape.model },
        { root: true }
      );
    },

    /**
     * Delete the constraint value at the given index.
     * If the constraint value has a '@list' object,
     *   the constraint with the given index will be removed from that object.
     * @param getters
     * @param args
     */
    deleteConstraintValueWithIndex({ getters }, args) {
      const { shapeID, constraintID, valueIndex } = args;
      const shape = getters.shapeWithID(shapeID);

      // If the value is a list, then remove from that list instead of directly.
      if (shape[constraintID].length > 0 && shape[constraintID][0]["@list"]) {
        shape[constraintID][0]["@list"].splice(valueIndex, 1);
      } else {
        shape[constraintID].splice(valueIndex, 1);
      }

      // Delete the constraint from the shape if there are no values left.
      if (shape[constraintID].length === 0) {
        this.dispatch("deleteConstraintFromShapeWithID", {
          shapeID,
          constraintID
        });
      }
    }
  },
  getters: {
    /**
     * Get a list of property ID's for the shape with the given ID.
     * @param state
     * @param getters
     * @param rootState
     * @returns {function(*): Array}
     */
    shapeProperties: (state, getters, rootState) => shapeID => {
      let shape;
      for (const s of rootState.mShape.model) {
        if (s["@id"] === shapeID) {
          shape = s;
        }
      }

      const propertyObjects = shape[TERM.property];
      const properties = [];

      if (propertyObjects) {
        // Get the references to property shapes
        for (const p of propertyObjects) {
          properties.push(p["@id"]);
        }
        // Get the other properties
        const ignored = ["@id", "@type", TERM.property, TERM.targetNode];
        for (const p in shape) {
          if (!ignored.includes(p)) properties.push(p[0]["@id"]);
        }
      }
      return properties;
    },

    /**
     * Get a map of the constraints of the shape with the given ID.
     * @param _state
     * @param _getters
     * @param _rootState
     * @param rootGetters
     * @returns {Function}
     */
    shapeConstraints: (
      _state,
      _getters,
      _rootState,
      rootGetters
    ) => shapeID => {
      const constraints = {};
      const shape = rootGetters.shapeWithID(shapeID);

      if (shape) {
        const ignored = ["@id", "@type"];
        for (const prop in shape) {
          // Only handle the constraints that are not ignored
          if (!ignored.includes(prop)) {
            if (shape[prop].length > 1) {
              // Get the ID of every element in the list
              const properties = [];
              for (const p of shape[prop]) {
                properties.push(p["@id"]);
              }
              constraints[prop] = properties;
            } else {
              constraints[prop] = shape[prop];
            }
          }
        }
        return constraints;
      } else {
        return undefined;
      }
    }
  }
};

export { constraintModule as default };
