import { CUSTOM_URI } from "../util/constants";

/**
 * This module contains everything to change the shape constraints.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const constraintModule = {
  state: {},
  mutations: {},
  actions: {
    /* ADD ========================================================================================================== */

    addPredicate({ getters, commit, rootState }, args) {
      const { shapeID, predicate, valueType } = args;
      console.log("valueType", valueType);
      // TODO if the value type is a list, then create a list if necessary and add the value to the list

      if (predicate.includes("property")) {
        this.dispatch("addPropertyToShape", {
          shapeID,
          propertyID: args.input
        });
      }
      const obj = getters.shapeWithID(shapeID);

      if (valueType === "id" || valueType === "lists") {
        obj[predicate] = [{ "@id": args.input }];
      }
      if (valueType === "type") {
        obj[predicate] = [{ "@type": args.object, "@value": args.input }];
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
     * TODO
     * @param store
     * @param args
     */
    deleteConstraintFromShape({ getters, commit, rootState }, args) {
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
        { shapeID, shapes: rootState.mShape.model },
        { root: true }
      );
    }
  },
  getters: {
    /**
     * Get a list of property ID's for the sahpe with the given ID.
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

      const propertyObjects = shape[`${CUSTOM_URI}property`];
      const properties = [];

      if (propertyObjects) {
        // Get the references to property shapes
        for (const p of propertyObjects) {
          properties.push(p["@id"]);
        }
        // Get the other properties
        const ignored = [
          "@id",
          "@type",
          `${CUSTOM_URI}property`,
          `${CUSTOM_URI}targetNode`
        ];
        for (const p in shape) {
          if (!ignored.includes(p)) properties.push(p[0]["@id"]);
        }
      }
      return properties;
    },

    /**
     * Get a map of the constraints of the shape with the given ID.
     * @param state
     * @param getters
     * @param rootState
     * @returns {Function}
     */
    shapeConstraints: (state, getters, rootState) => shapeID => {
      const constraints = {};
      let shape;
      for (const s of rootState.mShape.model) {
        if (s["@id"] === shapeID) {
          shape = s;
        }
      }

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
    }
  }
};

export { constraintModule as default };
