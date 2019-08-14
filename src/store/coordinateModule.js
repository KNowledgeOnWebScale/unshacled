import Vue from "vue";
import { HEIGHT } from "../util/konvaConfigs";
import ValueType from "../util/enums/ValueType";
import {SINGLE_ENTRY} from "../util/constants";
import {urlToName} from "../util/urlParser";

const coordinateModule = {
  state: {
    yValues: {},
    coordinates: {},
    heights: {}
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

      // Get the shape with the given ID.
      let shape;
      for (const item of shapes) {
        if (item["@id"] === shapeID) shape = item;
      }

      // The other properties.
      const ignored = ["@id", "@type"];

      // Get the IDs of all the constraints and the number of values for each constraint.
      const constraints = {};
      for (const c in shape) {
        if (!ignored.includes(c))
          constraints[c] = ValueType(c).includes("List")
            ? shape[c][0]["@list"].length
            : shape[c].length;
      }

      // Calculate their y values.
      let i = 1;
      for (const con of Object.keys(constraints)) {
        Vue.set(state.yValues[shapeID], con, i * HEIGHT);
        if (SINGLE_ENTRY.includes(urlToName(con))) {
          i += 2; // The properties will be listed on a single line.
        } else {
          i += 1 + constraints[con]; // Every entry on a seperate line.
        }
      }

      // Set the bottom coordinate.
      state.heights[shapeID] = i * HEIGHT;
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
     * Clear all the coordinates and y values.
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
     * Get the absolute bottom y coordinate of the shapeID with the given ID.
     * @param state
     * @returns {function(*): {x: *, y: *}}
     */
    bottomYCoordinate: state => shapeID => {
      return state.heights[shapeID] + state.coordinates[shapeID].y;
    },

    /**
     * Get the absolute bottom y coordinates of all the shapes.
     * @param state
     * @param getters
     */
    allBottomYs: (state, getters) => {
      const output = {};
      for (const key of Object.keys(state.coordinates)) {
        output[key] = getters.bottomYCoordinate(key);
      }
      return output;
    }
  }
};

export { coordinateModule as default };
