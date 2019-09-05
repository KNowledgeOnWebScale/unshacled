import Vue from "vue";
import ValueType, {
  getValueTypeFromConstraint,
  ValueTypes
} from "../util/enums/ValueType";
import { urlToName } from "../util/urlParser";
import { HEIGHT } from "../config/konvaConfigs";
import { IGNORED_PROPERTIES, SINGLE_ENTRY } from "../util/constants";

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

      // Get the IDs of all the constraints and the number of values for each constraint.
      const constraints = {};
      for (const c in shape) {
        if (!IGNORED_PROPERTIES.includes(c)) {
          const vt = ValueType(c)
            ? ValueType(c)
            : getValueTypeFromConstraint(shape[c]);
          constraints[c] =
            shape[c].length > 1
              ? shape[c].length
              : vt.includes(ValueTypes.LIST)
              ? shape[c][0]["@list"].length
              : shape[c].length;
        }
      }

      // Calculate their y values.
      let i = 1;
      for (const con of Object.keys(constraints)) {
        Vue.set(state.yValues[shapeID], con, i * HEIGHT);
        // Determine if every value has to be on a separate line.
        i += SINGLE_ENTRY.includes(urlToName(con)) ? 2 : 1 + constraints[con];
      }

      // Set the bottom coordinate.
      Vue.set(state.heights, shapeID, i * HEIGHT);
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
