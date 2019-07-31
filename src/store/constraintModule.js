import { CUSTOM_URI, EXAMPLE_URI } from "../util/constants";

/**
 * This module contains everything to change the shape constraints.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const constraintModule = {
  state: {},
  mutations: {},
  actions: {
    /* ADD ========================================================================================================== */

    /**
     * Add a property with the given id and value to the node with the given id.
     * @param store
     * @param args
     *              nodeID id of the node
     *              propertyID id of the property we want to add
     *              propertyValue object with the value of the property we want to add
     */
    addPropertyToNode({ getters, commit, rootState }, args) {
      const { nodeID, propertyID } = args;

      if (propertyID !== "") {
        // Check if the new property name is already an existing PropertyShape.
        if (!getters.propertyShapes[propertyID]) {
          // If not, create a new PropertyShape that is a copy of the original one.
          const property = { "@id": propertyID };
          property[`${CUSTOM_URI}path`] = [
            { "@id": `${EXAMPLE_URI}${propertyID}` }
          ];

          // Add the shape to the state.
          commit(
            "addShape",
            { object: property, bottomLefts: getters.allbottomLefts },
            { root: true }
          ); // this works as intended
        }

        const shape = getters.shapeWithID(nodeID);
        // Put the new value in the list of shape properties
        commit("addPropertyIDToShape", { propertyID, shape }, { root: true });
        // Update the y values
        commit(
          "updateYValues",
          { nodeID, shapes: rootState.mShape.model },
          { root: true }
        );
      }
    },

    addPredicate({ getters, commit, rootState }, args) {
      const { shapeID, predicate, valueType } = args;
      console.log("valueType", valueType);
      // TODO if the value type is a list, then create a list if necessary and add the value to the list

      if (predicate.includes("property")) {
        const argument = { nodeID: shapeID, propertyID: args.input };
        this.dispatch("addPropertyToNode", argument);
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
        { nodeID: shapeID, shapes: rootState.mShape.model },
        { root: true }
      );
      // Toggle the predicate modal.
      commit("togglePredicateModal", undefined, { root: true });
    },

    /* EDIT ========================================================================================================= */

    /**
     * Update the constraint value of the given node.
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
        { nodeID: shapeID, shapes: rootState.mShape.model },
        { root: true }
      );
    }
  },
  getters: {
    /**
     * Get a list of property ID's for the node with the given ID.
     * @param state
     * @param getters
     * @param rootState
     * @returns {function(*): Array}
     */
    shapeProperties: (state, getters, rootState) => shapeID => {
      let node;
      for (const shape of rootState.mShape.model) {
        if (shape["@id"] === shapeID) {
          node = shape;
        }
      }

      const propertyObjects = node[`${CUSTOM_URI}property`];
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
        for (const p in node) {
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
      let node;
      for (const shape of rootState.mShape.model) {
        if (shape["@id"] === shapeID) {
          node = shape;
        }
      }

      const ignored = ["@id", "@type"];
      for (const prop in node) {
        // Only handle the constraints that are not ignored
        if (ignored.indexOf(prop) < 0) {
          if (node[prop].length > 1) {
            // Get the ID of every element in the list
            const properties = [];
            for (const p of node[prop]) {
              properties.push(p["@id"]);
            }
            constraints[prop] = properties;
          } else {
            constraints[prop] = node[prop];
          }
        }
      }
      return constraints;
    }
  }
};

export { constraintModule as default };
