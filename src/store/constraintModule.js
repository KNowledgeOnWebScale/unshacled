import Vue from "vue";
import { clone } from "ramda";
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

      Vue.set(state.predicateModal, "show", !state.predicateModal.show);
      Vue.set(state.predicateModal, "shapeID", args.shapeID);
      Vue.set(state.predicateModal, "shapeType", args.shapeType);
      Vue.set(state.predicateModal, "editing", args.editing);
      Vue.set(state.predicateModal, "onExit", args.onExit);
    }
  },
  actions: {
    /* ADD ========================================================================================================== */

    addPredicate({ getters, commit, dispatch, rootState }, args) {
      const { shapeID, predicate, valueType, input, object } = args;
      const shape = getters.shapeWithID(shapeID);

      // Add the predicate to the shape.
      if (!shape[predicate]) shape[predicate] = [];
      const value =
        valueType === "id" || valueType === "lists"
          ? { "@id": input }
          : { "@type": object, "@value": input };
      shape[predicate].push(value);
      commit("setConstraintValue", {
        shape,
        constraintID: predicate,
        value: shape[predicate]
      });

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
        onExit: "stopConstraintEdit"
      });
    },

    // eslint-disable-next-line no-unused-vars
    stopConstraintEdit({ state, rootGetters }, args) {
      // Update the modal state.
      state.predicateModal.show = false;
      state.predicateModal.editing = false;

      const {
        shapeID,
        predicate: constraintID,
        input,
        object,
        valueType
      } = args;
      const i = state.constraintIndex;

      // Clone the original constraint and get the value we want to update.
      const updated = clone(rootGetters.shapeWithID(shapeID)[constraintID]);
      const original = updated[0]["@list"]
        ? updated[0]["@list"][i]
        : updated[i];

      // Create a new value object.
      let newValue;
      if (valueType === "id" || valueType === "lists") {
        newValue = {
          "@id": `${extractUrl(original["@id"])}${urlToName(input)}`
        };
      } else {
        newValue = {
          "@type": object,
          "@value": `${extractUrl(original["@value"])}${urlToName(input)}`
        };
      }

      // Update this value in the original constraint object.
      if (updated[0]["@list"]) {
        updated[0]["@list"][i] = newValue;
      } else {
        updated[i] = newValue;
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
