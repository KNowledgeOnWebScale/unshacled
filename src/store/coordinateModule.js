import Vue from "vue";
import ValueType, {
  getValueTypeFromConstraint,
  ValueTypes
} from "../util/enums/ValueType";
import { urlToName } from "../util/urlParser";
import { HEIGHT } from "../config/konvaConfigs";
import { IGNORED_PROPERTIES, SINGLE_ENTRY } from "../util/constants";

/**
 * This module contains everything regarding coordinates, locations and positioning.
 * @type {{mutations: {updateYValues(*, {shapeID: string, shapes: string}): void, deleteShapeLocations(*, string): void, clearLocations(*): void, updateCoordinates(*, {shapeID: string, x: number, y: number}): void, updateLocations(*, {oldID: string, newID: string}): void}, state: {heights: {}, yValues: {}, coordinates: {}}, getters: {bottomYCoordinate: (function(*): function(*): *), allBottomYs: (function(*, *))}}}
 */
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
     * @param oldID {string} the shapeID's old ID.
     * @param newID {string} the shapeID's new ID.
     */
    updateLocations(state, { oldID, newID }) {
      /* Update the coordinates of the shapes. */
      Vue.set(state.coordinates, newID, state.coordinates[oldID]);
      if (oldID !== newID) Vue.delete(state.coordinates, oldID);

      /* Update the y values of the shapes' components. */
      Vue.set(state.yValues, newID, state.yValues[oldID]);
      if (oldID !== newID) Vue.delete(state.yValues, oldID);
    },

    /**
     * Delete the coordinates and y values of the shapeID with the given ID.
     * @param state
     * @param id {string} the ID of the shape from which we want to delete the location data.
     */
    deleteShapeLocations(state, id) {
      Vue.delete(state.coordinates, id);
      Vue.delete(state.yValues, id);
    },

    /**
     * Update the y values of the properties of the given shapeID.
     * @param state
     * @param shapeID {string} the ID of the shape we want to update the y values from.
     * @param shapes {string} the list of shapes currently in the model.
     */
    updateYValues(state, { shapeID, shapes }) {
      /* Update the y values of the properties. */
      Vue.set(state.yValues, shapeID, {});

      /* Get the shape with the given ID. */
      let shape;
      for (const item of shapes) {
        if (item["@id"] === shapeID) shape = item;
      }

      /* Get the IDs of all the constraints and the number of values for each constraint. */
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

      /* Calculate their y values. */
      let i = 1;
      for (const con of Object.keys(constraints)) {
        Vue.set(state.yValues[shapeID], con, i * HEIGHT);
        /* Determine if every value has to be on a separate line. */
        i += SINGLE_ENTRY.includes(urlToName(con)) ? 2 : 1 + constraints[con];
      }

      /* Set the bottom coordinate. */
      Vue.set(state.heights, shapeID, i * HEIGHT);
    },

    /**
     * Update the coordinates of the given shapeID.
     * @param state
     * @param shapeID {string} the ID of the shapeID whose location should be updated.
     * @param x {number} the new x coordinate.
     * @param y {number} the new y coordinate.
     */
    updateCoordinates(state, { shapeID, x, y }) {
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
  getters: {
    /**
     * Get the absolute bottom y coordinate of the shapeID with the given ID.
     * @param state
     * @returns {function} getter
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
