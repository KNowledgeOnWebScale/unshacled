import Vue from "vue";
import { HEIGHT } from "../util/konvaConfigs";

const coordinateModule = {
  state: {
    yValues: {},
    coordinates: {}
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
      const { nodeID, shapes } = args;
      // Update the y values of the properties.
      Vue.set(state.yValues, nodeID, {});

      let node;
      for (const item of shapes) {
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
  actions: {},
  getters: {}
};

export { coordinateModule as default };
