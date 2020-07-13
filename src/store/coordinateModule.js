import Vue from "vue";
import ValueType, {
  getValueTypeFromConstraint,
  ValueTypes
} from "../util/enums/ValueType";
import { urlToName } from "../util/urlParser";
import { HEIGHT } from "../config/konvaConfigs";
import { IGNORED_PROPERTIES, SINGLE_ENTRY, INFO_PROPERTIES, RELATIONSHIP_PROPERTIES } from "../util/constants";

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
     * @param {string} oldID the shapeID's old ID.
     * @param {string} newID the shapeID's new ID.
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
     * @param {string} id the ID of the shape from which we want to delete the location data.
     */
    deleteShapeLocations(state, id) {
      Vue.delete(state.coordinates, id);
      Vue.delete(state.yValues, id);
    },

    /**
     * Update the y values of the properties of the given shapeID.
     * @param state
     * @param {string} shapeID the ID of the shape we want to update the y values from.
     * @param {string} shapes the list of shapes currently in the model.
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
      const info = {};
      for (const c in shape) {
        if (INFO_PROPERTIES.includes(c)) {
          if ( !(c === "@id" && shape[c][0] === "_") ){
            const vt = ValueType(c)
              ? ValueType(c)
              : getValueTypeFromConstraint(shape[c]);
            info[c] =
              shape[c].length > 1
                ? shape[c].length
                : vt.includes(ValueTypes.LIST)
                ? shape[c][0]["@list"].length
                : shape[c].length;
          }
        } else if ( !IGNORED_PROPERTIES.includes(c)  && !RELATIONSHIP_PROPERTIES.includes(c)){
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
      for (const con of Object.keys(info)) {
        Vue.set(state.yValues[shapeID], con, i * HEIGHT + 10);
        i += 1;
      }
      if (i === 1){
        i += 1
      }
      for (const con of Object.keys(constraints)) {
        Vue.set(state.yValues[shapeID], con, i * HEIGHT + 10);
        i += 1;
      }
      /* Set the bottom coordinate. */
      Vue.set(state.heights, shapeID, i * HEIGHT + 10);
    },

    /**
     * Update the coordinates of the given shapeID.
     * @param state
     * @param s{string} hapeID the ID of the shapeID whose location should be updated.
     * @param {number} x the new x coordinate.
     * @param {number} y the new y coordinate.
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
