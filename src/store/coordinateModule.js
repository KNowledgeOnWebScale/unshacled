import Vue from "vue";
import { HEIGHT } from "../util/konvaConfigs";

const coordinateModule = {
  state: {
    yValues: {},
    coordinates: {},
    bottom: {}
  },
  mutations: {
    /**
     * Update the coordinates and values of the given shapeID.
     * @param state
     * @param args
     *            oldID the shapeID's old ID.
     *            newID the shapeID's new ID.
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
     * Delete the coordinates and y values of the shapeID with the given id.
     * @param state
     * @param id
     */
    deleteShapeLocations(state, id) {
      Vue.delete(state.coordinates, id);
      Vue.delete(state.yValues, id);
    },

    /**
     * Update the y values of the properties of the given shapeID.
     * @param state
     * @param args
     */
    updateYValues(state, args) {
      const { shapeID, shapes } = args;
      // Update the y values of the properties.
      Vue.set(state.yValues, shapeID, {});

      let shape;
      for (const item of shapes) {
        if (item["@id"] === shapeID) shape = item;
      }

      // The other properties.
      const ignored = ["@id", "@type"];

      // Get the IDs of all the constraints and the number of values for each constraint.
      const constraints = {};
      for (const c in shape) {
        if (!ignored.includes(c)) constraints[c] = shape[c].length;
      }

      // Calculate their y values.
      let i = 1;
      for (const con of Object.keys(constraints)) {
        Vue.set(state.yValues[shapeID], con, i * HEIGHT);
        if (con.includes("property")) {
          i += 2; // The properties will be listed on a single line.
        } else {
          i += 1 + constraints[con]; // Every entry on a seperate line.
        }
      }

      // Set the bottom right coordinate.
      state.bottom[shapeID] = i * HEIGHT;
    },

    /**
     * Update the coordinates of the given shapeID.
     * @param state
     * @param args
     *    shapeID: the ID of the shapeID whose location should be updated.
     *    x: the new x coordinate.
     *    y: the new y coordinate.
     */
    updateCoordinates(state, args) {
      const { shapeID, x, y } = args;
      Vue.set(state.coordinates, shapeID, { x, y });
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
  getters: {
    /**
     * Get the bottom right coordinate of the shapeID with the given ID.
     * @param state
     * @returns {function(*): {x: *, y: *}}
     */
    bottomLeft: state => shapeID => {
      return {
        x: state.coordinates[shapeID].x,
        y: state.bottom[shapeID]
      };
    },

    /**
     * Get the bottom right coordinates of all the shapes.
     * @param state
     * @param getters
     */
    allbottomLefts: (state, getters) => {
      const output = {};
      for (const key of Object.keys(state.coordinates)) {
        output[key] = getters.bottomLeft(key);
      }
      return output;
    }
  }
};

export { coordinateModule as default };
