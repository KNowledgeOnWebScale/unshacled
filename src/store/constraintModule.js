import { TERM } from "../translation/terminology";

/**
 * This module contains everything to change the shape constraints.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const constraintModule = {
  state: {},
  mutations: {},
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
      commit("togglePredicateModal", undefined, { root: true });
    },

    /* EDIT ========================================================================================================= */

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
      const { shapeID, constraintID, value } = args;
      commit("setConstraintValue", {
        shape: rootGetters.shapeWithID(shapeID),
        constraintID,
        value
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
      const { shapeID, constraint } = args;
      const shape = getters.shapeWithID(shapeID);
      commit(
        "deleteConstraintFromShape",
        { shape, constraint },
        { root: true }
      );

      // Update the y values
      commit(
        "updateYValues",
        { shape, shapes: rootState.mShape.model },
        { root: true }
      );
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
          if (ignored.indexOf(prop) < 0) {
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
