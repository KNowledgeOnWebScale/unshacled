import Vue from "vue";
import constraintModule from "./constraintModule";
import { extractUrl } from "../util/nameParser";
import { HEIGHT } from "../util/konvaConfigs";

/**
 * This module contains everything to change the shapes.
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const shapeModule = {
  state: {
    yValues: {},
    coordinates: {}
  },
  modules: {
    constraint: constraintModule
  },
  mutations: {
    /**
     * Update the coordinates and values of the given shape.
     * @param state
     * @param args
     *            oldID the shape's old ID.
     *            newID the shape's new ID.
     */
    updateLocations(state, args) {
      const { oldID, newID } = args;

      // Update coordinates
      Vue.set(state.coordinates, newID, state.coordinates[oldID]);
      if (oldID !== newID) Vue.delete(state.coordinates, oldID);

      // Update yValues
      Vue.set(state.yValues, newID, state.yValues[oldID]);
      if (oldID !== newID) Vue.delete(state.yValues, oldID);
    },

    /**
     * Delete the coordinates and y values of the shape with the given id.
     * @param state
     * @param id
     */
    deleteShapeLocations(state, id) {
      Vue.delete(state.coordinates, id);
      Vue.delete(state.yValues, id);
    },

    /**
     * Update the y values of the properties of the given node.
     * @param state
     * @param args
     */
    updateYValues(state, args) {
      const { model, nodeID } = args;
      // Update the y values of the properties.
      Vue.set(state.yValues, nodeID, {});

      let node;
      for (const item of model) {
        if (item["@id"] === nodeID) node = item;
      }

      // FIXME code duplication, find a way to use `shapeProperties` >.<
      const propertyObjects =
        node["https://2019.summerofcode.be/unshacled#property"];

      // Get the references to property shapes.
      const properties = [];
      if (propertyObjects) {
        for (const p of propertyObjects) properties.push(p["@id"]);
      }

      // The other properties.
      const ignored = [
        "@id",
        "@type",
        "https://2019.summerofcode.be/unshacled#property"
      ];

      // Get the IDs form all the constraints.
      const constraints = [];
      for (const c in node) {
        if (!ignored.includes(c)) constraints.push(c);
      }

      // Get the IDs from all the properties.
      for (const p in node) {
        if (!ignored.includes(p)) properties.push(p[0]["@id"]);
      }

      // Calculate their y values.
      let i = 1;
      for (const con of constraints) {
        Vue.set(state.yValues[nodeID], con, i * HEIGHT);
        i += 2; // Constraints need twice the height.
      }
      for (const prop of properties) {
        Vue.set(state.yValues[nodeID], prop, i * HEIGHT);
        i += 1;
      }
      // Add y values for the add button.
    },

    /**
     * Update the coordinates of the given shape.
     * @param state
     * @param args
     *    node: the ID of the node shape whose location should be updated.
     *    x: the new x coordinate.
     *    y: the new y coordinate.
     */
    updateCoordinates(state, args) {
      const { node, x, y } = args;
      const coords = { x, y };
      Vue.set(state.coordinates, node, coords);

      /*
      for (const prop in state.relationships) {
        if (prop.includes(node)) {
          const changedKey = node;
          const otherKey = prop.replace(changedKey, "");
          state.relationships[prop].coords = [
            state.coordinates[otherKey].x,
            state.coordinates[otherKey].y,
            state.coordinates[changedKey].x,
            state.coordinates[changedKey].y
          ];
        }
      }
       */
    },

    /**
     * TODO
     * @param state
     */
    clearLocations(state) {
      state.coordinates = {};
      state.yValues = {};
    }
  },
  actions: {
    /* ADD ========================================================================================================== */

    /**
     * Add an empty node shape with the given id.
     * @param store
     * @param id
     */
    addNodeShape({ commit }, id) {
      commit(
        "addShape",
        {
          "@id": id,
          "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
          "https://2019.summerofcode.be/unshacled#property": [],
          "https://2019.summerofcode.be/unshacled#targetNode": []
        },
        { root: true }
      );
    },

    /**
     * Add a property shape with the given id.
     * @param store
     * @param id
     */
    addPropertyShape({ commit }, id) {
      commit(
        "addShape",
        {
          "@id": id,
          "https://2019.summerofcode.be/unshacled#path": [
            `http://example.org/ns#${id}`
          ]
        },
        { root: true }
      );
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
        // Update the shape's ID
        const index = getters.indexWithID(oldID);
        commit("updateShapeID", { index, newID: newURL }, { root: true });

        // Update Relationships TODO
        /*
        for (let prop in state.relationships) {
          if (state.relationships[prop].one === oldID)
            state.relationships[prop].one = newID;
          if (state.relationships[prop].two === oldID)
            state.relationships[prop].two = newID;
          prop = state.relationships[prop].one + state.relationships[prop].two;
        }
         */

        // Update the coordinates and y values.
        commit("updateLocations", { oldID, newID: newURL }, { root: true });
      }
    },

    /**
     * Edit the ID of a property shape.
     * This will update the property list of every node shape that contains this property shape.
     * @param store
     * @param args
     */
    editPropertyShape({ getters, commit, rootState }, args) {
      const { oldID, newID } = args;

      // Update the state's shapes.
      const shape = getters.shapeWithID(oldID);
      commit("updatePropertyShapeID", { shape, newID }, { root: true });
      for (const node of rootState.model) {
        if (getters.shapeProperties(node["@id"]).indexOf(oldID) !== -1) {
          commit(
            "deletePropertyFromShape",
            { shape: node, propertyID: oldID },
            { root: true }
          );
          commit(
            "addPropertyIDToShape",
            { shape: node, propertyID: newID },
            { root: true }
          );
          commit(
            "deletePropertyFromShape",
            { shape: node, propertyID: oldID },
            { root: true }
          );
        }
      }
      commit("updateLocations", { oldID, newID }, { root: true });
      // Update the y values of the properties.
      for (const node of rootState.model) {
        commit(
          "updateYValues",
          { nodeID: node["@id"], model: rootState.model },
          { root: true }
        );
      }
    },

    /* DELETE ======================================================================================================= */

    /**
     * Delete the node shape with the given id.
     * @param store
     * @param id
     */
    deleteNodeShape({ getters, commit }, id) {
      commit("deleteShapeAtIndex", getters.indexWithID(id), { root: true });
      commit("deleteShapeLocations", id, { root: true });
    },

    /**
     * Delete the property shape with the given id.
     * @param store
     * @param id
     */
    deletePropertyShape({ getters, commit, rootState }, id) {
      // Check every nodeShape if it contains the given property.
      for (const shape of rootState.model) {
        const properties =
          shape["https://2019.summerofcode.be/unshacled#property"];

        for (const p in properties) {
          if (properties[p]["@id"] === id) {
            // Delete the property from the node and update the y values.
            properties.splice(p, 1);
            commit(
              "updateYValues",
              { nodeID: shape["@id"], model: rootState.model },
              { root: true }
            );
          }
        }
      }
      // Remove the property from the state
      commit("deleteShapeAtIndex", getters.indexWithID(id), { root: true });
      commit("deleteShapeLocations", id, { root: true });
    }
  },
  getters: {
    /**
     * Returns a map of the shape ID's to their respective objects.
     * @param state
     * @param getters
     * @param rootState
     */
    shapes(state, getters, rootState) {
      const shapes = {};
      for (const item of rootState.model) {
        shapes[item["@id"]] = item;
      }
      return shapes;
    },

    /**
     * Get a dictionary mapping ID's to the respective node shape objects.
     * @param state
     * @param getters
     * @param rootState
     */
    nodeShapes(state, getters, rootState) {
      const nodeShapes = {};
      for (const item of rootState.model) {
        if (item["@type"]) {
          nodeShapes[item["@id"]] = item;
        }
      }
      return nodeShapes;
    },

    /**
     * Get a dictionary mapping ID's to the respective property shape objects.
     * @param state
     * @param getters
     * @param rootState
     */
    propertyShapes(state, getters, rootState) {
      const propertyShapes = {};
      for (const item of rootState.model) {
        if (!item["@type"]) {
          propertyShapes[item["@id"]] = item;
        }
      }
      return propertyShapes;
    },

    /**
     * Get the shape object with the given ID.
     * @param state
     * @param getters
     * @param rootState
     * @returns {null}
     */
    shapeWithID: (state, getters, rootState) => id => {
      for (const item of rootState.model) {
        if (item["@id"] === id) return item;
      }
      return null;
    },

    /**
     * Get the index of the shape object with the given ID.
     * @param state
     * @param getters
     * @param rootState
     * @returns {string|number}
     */
    indexWithID: (state, getters, rootState) => id => {
      for (const i in rootState.model) {
        if (rootState.model[i]["@id"] === id) return i;
      }
      return -1;
    }
  }
};

export { shapeModule as default };
