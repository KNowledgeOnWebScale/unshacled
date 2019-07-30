import Vue from "vue";
import { urlToName } from "../util/nameParser";

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
          const property = {
            "@id": propertyID,
            "https://2019.summerofcode.be/unshacled#path": [
              { "@id": `http://example.org/ns#${propertyID}` }
            ]
          };

          // Add the shape to the state.
          commit("addShape", property, { root: true }); // this works as intended
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
     * Edit the given property in the given node shape.
     * If the new property ID already exists, this will make a copy
     * @param store
     * @param args
     */
    editPropertyInNode({ getters, commit, rootState }, args) {
      const { nodeID, oldID, newID } = args;

      // Check if the new property name is already an existing PropertyShape.
      if (!getters.propertyShapes[newID]) {
        // If not, create a new PropertyShape that is a copy of the original one.
        const copied = Vue.util.extend({}, getters.propertyShapes[oldID]);
        copied["@id"] = newID;

        const name = urlToName(newID);
        copied["https://2019.summerofcode.be/unshacled#path"][0][
          "@id"
        ] = `http://example.org/ns#${name}`; // TODO dromedarisCaseOrSomething

        // Add the shape to the state.
        commit("addShape", copied, { root: true });
      }

      const shape = getters.shapeWithID(nodeID);
      // Put the new value in the list of shape properties
      commit(
        "addPropertyIDToShape",
        { propertyID: newID, shape },
        { root: true }
      );
      // Remove the old value from the list of shape properties.
      commit(
        "deletePropertyFromShape",
        { shape, propertyID: oldID },
        { root: true }
      );
      // Update the y values
      commit(
        "updateYValues",
        { nodeID, shapes: rootState.mShape.model },
        { root: true }
      );
    },

    /* DELETE ======================================================================================================= */

    /**
     * Delete the given property from the given node shape.
     * @param store
     * @param args
     *            node the id of the node shape
     *            prop the id of the property that should be removed from the shape
     */
    deletePropFromNode({ getters, commit, rootState }, args) {
      const { node, prop } = args;

      const shape = getters.shapeWithID(node);
      const properties =
        shape["https://2019.summerofcode.be/unshacled#property"];

      for (const p in properties) {
        if (properties[p]["@id"] === prop) {
          // Delete the property from the node and update the y values.
          properties.splice(p, 1);
        }
      }

      // Update the y values
      commit(
        "updateYValues",
        { nodeID: node, shapes: rootState.mShape.model },
        { root: true }
      );
    },

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

      const propertyObjects =
        node["https://2019.summerofcode.be/unshacled#property"];
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
          "https://2019.summerofcode.be/unshacled#property",
          "https://2019.summerofcode.be/unshacled#targetNode"
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

      const ignored = [
        "@id",
        "@type",
        "https://2019.summerofcode.be/unshacled#property"
      ];
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
