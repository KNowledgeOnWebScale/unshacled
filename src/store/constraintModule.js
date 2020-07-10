import { clone } from "ramda";
import Vue from "vue";
import { TERM } from "../translation/terminology";
import { prefixToUri } from "../util/urlParser";
import getValueType, {
  getValueTypeFromConstraint,
  ValueTypes
} from "../util/enums/ValueType";
import { IGNORED_PROPERTIES, INFO_PROPERTIES } from "../util/constants";
import predicateModalModule from "./modals/predicateModalModule";

/**
 * This module contains everything to change the shape constraints.
 * @type {{mutations: {setConstraintValue(*, {shape: Object, constraintID: string, value: Object}): void, deleteConstraintFromShape(*, {shape: Object, constraintID?: *}): void}, state: {constraintIndex: number}, getters: {shapeConstraints: (function(*, *, *, *): Function), shapeInfo: (function(*, *, *, *): Function), shapeProperties: (function(*, *, *): function(*): []), shapeIDConstraints: (function(*, *, *, *): function(*=))}, actions: {startConstraintEdit({state: *, commit: *}, {shapeID: string, shapeType: string, constraintID: string, index: number, value: string}): void, updateConstraint({rootGetters: *, commit: *}, {shapeID: string, constraintID: string, newValue: Object}): void, addPredicate({state: *, getters: *, commit: *, dispatch: *, rootState: *}, {shapeID: string, predicate: string, valueType: string, input: string, object: string, language: string}): void, deleteConstraintValueWithIndex({getters: *, commit: *, rootState: *}, {shapeID: string, constraintID: string, valueIndex: number}): void, stopConstraintEdit({state: *, rootGetters: *}, {shapeID: string, predicate: string, object: string, valueType: string, input: string}): void, deleteConstraintValue({getters: *, commit: *, rootState: *}, {shapeID: string, constraintID: string, value: string}): void, deleteConstraintFromShapeWithID({getters: *, commit: *, rootState: *}, {shapeID: string, constraintID: *}): void}, modules: {mModal: *}}}
 */
const constraintModule = {
  state: {
    constraintIndex: 0
  },
  modules: {
    mModal: predicateModalModule
  },

  mutations: {
    /**
     * Set the value of the constraint with the given ID to the given value.
     * @param state
     * @param {object} shape the shape object that has to be updated.
     * @param {string} constraintID the ID of the constraint that should be updated.
     * @param {object} value the new value of the given constraint.
     */
    setConstraintValue(state, { shape, constraintID, value }) {
      Vue.set(shape, constraintID, value);
    },

    /**
     * Delete the given constraint from the given shape object.
     * @param state
     * @param {object} shape the shape object that should be updated.
     * @param {string} constraint the ID of the constraint that should be deleted.
     */
    deleteConstraintFromShape(state, { shape, constraintID }) {
      Vue.delete(shape, constraintID);
    }
  },

  actions: {
    /* ADD ========================================================================================================== */

    /**
     * Add a constraint with the given values to the given shape.
     * @param state
     * @param getters
     * @param commit
     * @param dispatch
     * @param rootState
     * @param {string} shapeID the IRI of the shape we want to add the predicate to.
     * @param {string} predicate the predicate we want to add.
     * @param {string} valueType the value type of this predicate.
     * @param {string} input the desired value of this constraint.
     * @param {string} inputType the type of the input.
     * @param {string} language the language tag of the input value.
     */
    addPredicate(
      { state, getters, commit, dispatch, rootState },
      { shapeID, predicate, valueType, input, inputType, language }
    ) {
      const shape = getters.shapeWithID(shapeID);
      const isID = valueType.includes(ValueTypes.ID);
      const isList = valueType.includes(ValueTypes.LIST);
      let duplicate = false;

      if (shape[predicate]) {
        const iter = isList ? shape[predicate][0]["@list"] : shape[predicate];
        /* Check if this new value is a duplicate. */
        const key = isID ? "@id" : "@value";
        for (const j in iter) {
          if (iter[j][key] === input) duplicate = true;
        }
      } else {
        /* Create an empty list to add to if necessary. */
        shape[predicate] = [];
        if (isList) shape[predicate].push({ "@list": [] });
      }

      /* Don't add the value if it is a duplicate. */
      if (!duplicate) {
        /* Create the object we want to add. */
        let value = isID
          ? { "@id": input }
          : { "@type": inputType, "@value": input };
        if (language) {
          value["@language"] = language;
          Vue.delete(value, "@type");
        }

        /* Add a property shape if needed. */
        if (predicate === TERM.property && !getters.shapeWithID(input)) {
          dispatch("addPropertyShape", { path: input });
          value = rootState.mShape.model[rootState.mShape.model.length - 1]; // Update the constraint value.
        }

        // TODO take multiple languages into account
        if (valueType === "type") {
          /* If there can only be one value, replace the existing value. */
          Vue.set(shape[predicate], 0, value);
        } else {
          /* Otherwise, determine which list we want to add the predicate to. */
          const list = isList ? shape[predicate][0]["@list"] : shape[predicate];
          list.push(value);
        }

        /* Add the predicate to the shape. */
        commit("updateShape", {
          shapeID,
          value: rootState.mShape.model[shapeID]
        });

        /* Update the y values. */
        commit(
          "updateYValues",
          { shapeID, shapes: rootState.mShape.model },
          { root: true }
        );
      }

      /* Close the predicate modal if needed. */
      if (state.mModal.show) commit("togglePredicateModal", {});
    },

    /* EDIT ========================================================================================================= */

    /**
     * Prepare and toggle the predicate modal.
     * @param state
     * @param commit
     * @param {string} shapeID the ID of the shape we want to update.
     * @param {string} shapeType the type of the shape we want to update.
     * @param {string} constraintID the ID of the constraint we want to edit.
     * @param {number} index the index of the constraint value we want to edit.
     * @param {string} value the current value of the constraint value.
     */
    startConstraintEdit(
      { state, commit },
      { shapeID, shapeType, constraintID, index, value }
    ) {
      state.constraintIndex = index;
      commit("togglePredicateModal", {
        shapeID,
        shapeType,
        editing: true,
        input: value,
        onExit: "stopConstraintEdit",
        selected: constraintID
      });
    },

    /**
     * Get the values from the predicate model and execute the edit.
     * @param state
     * @param commit
     * @param dispatch
     * @param rootGetters
     * @param {string} shapeID the ID of the shape we are editing.
     * @param {string} constraintID the ID of the constraint we are editing.
     * @param {string} valueType the value type of the constraint.
     * @param {string} input the input entered by the user.
     * @param {string} inputType the type of the input
     */
    stopConstraintEdit(
      { state, dispatch, rootGetters },
      { shapeID, predicate: constraintID, valueType, input, inputType }
    ) {
      /* Update the modal state. */
      Vue.set(state.mModal, "show", false);
      Vue.set(state.mModal, "editing", false);
      const i = state.constraintIndex;
      if (typeof input === "boolean") input = input.toString();

      /* Clone the original constraint and get the value we want to update. */
      const updated = clone(rootGetters.shapeWithID(shapeID)[constraintID]);
      const iter = valueType.includes(ValueTypes.LIST)
        ? updated[0]["@list"]
        : updated;

      /* Create a new value object. */
      let newValue;
      let name;
      if (constraintID === TERM.path) {
        newValue = { "@id": input };
      } else if (valueType.includes(ValueTypes.ID)) {
        newValue = {
          "@id": prefixToUri(rootGetters.namespaces, input)
        };
      } else {
        newValue = {
          "@type": inputType,
          "@value": prefixToUri(rootGetters.namespaces, input)
        };
      }

      /* Check if this new value is a duplicate. */
      let duplicate = false;
      const key = valueType.includes(ValueTypes.ID) ? "@id" : "@value";
      for (let j in iter) {
        j = Number(j);
        if (i !== j && iter[j][key] === name) duplicate = true;
      }

      /* Update this value in the original constraint object. */
      // `iter` is a reference to the array we have to modify.
      if (duplicate) {
        /* Delete the duplicate if there is one. */
        iter.splice(i, 1);
      } else {
        iter[i] = newValue;
      }

      /* Dispatch the action to update the constraint with the updated value. */
      const args = {
        shapeID,
        constraintID,
        newValue: updated
      };
      dispatch("updateConstraint", args);
    },

    /**
     * Update the constraint value of the given shape.
     * @param rootGetters
     * @param commit
     * @param rootState
     * @param {string} shapeID the ID of the shape.
     * @param {string} constraintID the ID of the constraint we want to update.
     * @param {object} newValue the new value of the given constraint.
     */
    updateConstraint(
      { rootGetters, commit },
      { shapeID, constraintID, newValue }
    ) {
      commit("setConstraintValue", {
        shape: rootGetters.shapeWithID(shapeID),
        constraintID,
        value: newValue
      });
    },

    /* DELETE ======================================================================================================= */

    /**
     * Delete the given constraint from the given shape.
     * @param store
     * @param {string} shapeID the ID of the shape from which the constraint should be removed.
     * @param {string} constraint the ID of the constraint that should be removed.
     */
    deleteConstraintFromShapeWithID(
      { getters, commit, rootState },
      { shapeID, constraintID }
    ) {
      const shape = getters.shapeWithID(shapeID);
      commit("deleteConstraintFromShape", { shape, constraintID });
      commit("updateYValues", { shapeID, shapes: rootState.mShape.model });
    },

    /**
     * Delete the constraint value at the given index.
     * If the constraint value has a '@list' object,
     *   the constraint with the given index will be removed from that object.
     * @param getters
     * @param commit
     * @param rootState
     * @param {string} shapeID the ID of the shape we want to update.
     * @param {string} constraintID the ID of the constraint we want to edit.
     * @param {number} valueIndex the index of the constraint value we want to delete.
     */
    deleteConstraintValueWithIndex(
      { getters, commit, rootState },
      { shapeID, constraintID, valueIndex }
    ) {
      const constraint = getters.shapeWithID(shapeID)[constraintID];

      /* If the value is a list, then remove from that list instead of directly from the constraint. */
      const iter = getValueType(constraintID).includes(ValueTypes.LIST)
        ? constraint[0]["@list"]
        : constraint;

      commit("removeElementFromList", { list: iter, index: valueIndex });

      /* Delete the constraint from the shape if there are no values left. */
      if (iter.length === 0) {
        // Updating the y values should happen last, so insert this mutation on the second to last place.
        const shape = getters.shapeWithID(shapeID);
        commit("deleteConstraintFromShape", { shape, constraintID });
        commit("updateYValues", { shapeID, shapes: rootState.mShape.model });
      }

      /* Execute the updating of the y values. */
      commit("updateYValues", { shapeID, shapes: rootState.mShape.model });
    },

    /**
     * Delete the given constraint.
     * If the constraint value has a '@list' object,
     *   the constraint with the given index will be removed from that object.
     * @param getters
     * @param commit
     * @param rootState
     * @param {string} shapeID the ID of the shape we want to edit.
     * @param {string} constraintID the ID of the constraint we want to edit.
     * @param {string} value the constraint value we want to delete.
     */
    deleteConstraintValue(
      { getters, commit, rootState },
      { shapeID, constraintID, value }
    ) {
      const constraint = getters.shapeWithID(shapeID)[constraintID];

      /* If the value is a list, then remove from that list instead of directly. */
      const iter = getValueType(constraintID).includes(ValueTypes.LIST)
        ? constraint[0]["@list"]
        : constraint;

      /* Check every value of the list. */
      for (const i in iter) {
        const val = iter[i];
        if (val["@id"] === value || val["@value"] === value || val === value) {
          /* Delete this value from the list if it is the value we want to remove. */
          commit("removeElementFromList", { list: iter, index: i });
        }
      }

      /* Delete the constraint from the shape if there are no values left. */
      if (iter.length === 0) {
        const shape = getters.shapeWithID(shapeID);
        commit("deleteConstraintFromShape", { shape, constraintID });
        commit("updateYValues", { shapeID, shapes: rootState.mShape.model });
      }

      /* Update the y values. */
      commit("updateYValues", { shapeID, shapes: rootState.mShape.model });
    }
  },

  getters: {
    /**
     * Get a list of property ID's for the shape with the given ID.
     * ShapeID {string} the ID of the shape whose properties we want to get.
     * @param state
     * @param getters
     * @returns {function}
     */
    shapeProperties: (state, getters) => shapeID => {
      const shape = getters.shapeWithID(shapeID);
      const propertyObjects = shape[TERM.property];
      const properties = [];

      if (propertyObjects) {
        /* Get the references to property shapes. */
        for (const p of propertyObjects) {
          properties.push(p["@id"]);
        }
        /* Get the other properties. */
        const ignored = ["@id", "@type", TERM.property, TERM.targetNode];
        for (const p in shape) {
          if (!ignored.includes(p)) properties.push(p[0]["@id"]);
        }
      }
      return properties;
    },

    /**
     * Get a map of the constraints of the shape with the given ID.
     * ShapeID {string} the ID of the shape whose constraints we want to get.
     * @param _state
     * @param _getters
     * @param _rootState
     * @param rootGetters
     * @returns {function}
     */
    shapeConstraints: (
      _state,
      _getters,
      _rootState,
      rootGetters
    ) => shapeID => {
      const constraints = {};
      const shape = rootGetters.shapeWithID(shapeID);

      if (shape) {
        for (const prop in shape) {
          /* Only handle the constraints that are not ignored. */
          if (!IGNORED_PROPERTIES.includes(prop)) {
            if (shape[prop].length > 1) {
              /* Get the ID of every element in the list. */
              const properties = [];
              Object.values(shape[prop]).map(p => properties.push(p["@id"]));
              constraints[prop] = properties;
            } else {
              constraints[prop] = shape[prop];
            }
          }
        }
        return constraints;
      } else {
        return undefined;
      }
    },

    /**
     * Get the amount of constraints of the shape with the given ID.
     * ShapeID {string} the ID of the shape whose constraints we want to get.
     * @param _state
     * @param _getters
     * @param _rootState
     * @param rootGetters
     * @returns {function}
     */
    getConstraintAmount: (
      _state,
      _getters,
      _rootState,
      rootGetters
    ) => shapeID => {
      let i = 0;
      const shape = rootGetters.shapeWithID(shapeID);

      if (shape) {
        for (const prop in shape) {
          if (!IGNORED_PROPERTIES.includes(prop)) i += 1
        }
        return i;
      } else {
        return undefined;
      }
    },

    /**
     * Get a map of the information constraints of the shape with the given ID.
     * ShapeID {string} the ID of the shape whose constraints we want to get.
     * @param _state
     * @param _getters
     * @param _rootState
     * @param rootGetters
     * @returns {function}
     */
    shapeInfo: (
      _state,
      _getters,
      _rootState,
      rootGetters
    ) => shapeID => {
      const constraints = {};
      const shape = rootGetters.shapeWithID(shapeID);

      if (shape) {
        for (const prop in shape) {
          /* Only handle the constraints that are not ignored. */
          if (INFO_PROPERTIES.includes(prop)) {
            if (shape[prop].length > 1) {
              if(prop === "@id"){
                if ( shape[prop][0] !== "_" ){
                  constraints[prop] = shape[prop];
                }
              } else {
                /* Get the ID of every element in the list. */
                const properties = [];
                Object.values(shape[prop]).map(p => properties.push(p["@id"]));
                constraints[prop] = properties;
              }
            } else {
              constraints[prop] = shape[prop];
            }
          }
        }
        return constraints;
      } else {
        return undefined;
      }
    },

    /**
     * Get the amount of information properties of the shape with the given ID.
     * ShapeID {string} the ID of the shape whose constraints we want to get.
     * @param _state
     * @param _getters
     * @param _rootState
     * @param rootGetters
     * @returns {function}
     */
    getInfoAmount: (
      _state,
      _getters,
      _rootState,
      rootGetters
    ) => shapeID => {
      let i = 0;
      const shape = rootGetters.shapeWithID(shapeID);
      
      if (shape) {
        for (const prop in shape) {
          if (INFO_PROPERTIES.includes(prop)) i += 1
        }
        const iri = shape["@id"];
        if ( iri ){
          if ( iri[0] === "_" ) i -= 1;
        }
        return i;
      } else {
        return undefined;
      }
    },

    /**
     * Get the constraints that have existing shape IDs as values.
     * This will return a dictionary that maps every constraint IDs to a list of shape IDs.
     * ShapeID {string} the ID of the shape whose ID constraints we want to get.
     * @param _state
     * @param getters
     * @param _rootState
     * @param rootGetters
     * @returns {function}
     */
    shapeIDConstraints: (
      _state,
      getters,
      _rootState,
      rootGetters
    ) => shapeID => {
      const output = {};

      /* Check every constraint of the given shape. */
      const constraints = getters.shapeConstraints(shapeID);
      for (const c of Object.keys(constraints)) {
        const vt = getValueType(c)
          ? getValueType(c)
          : getValueTypeFromConstraint(constraints[c]);
        if (vt && vt.includes(ValueTypes.ID)) {
          const values = [];
          const iter =
            constraints[c].length > 1
              ? constraints[c]
              : vt.includes(ValueTypes.LIST)
              ? constraints[c][0]["@list"]
              : constraints[c];

          /* Check every constraint value. */
          for (const value of iter) {
            const id = value["@id"] ? value["@id"] : value;
            /* Check if the value is an existing shape ID. */
            if (rootGetters.shapeIDs.includes(id)) values.push(id);
          }
          /* Only push the constraints that do have some values. */
          if (values.length > 0) output[c] = values;
        }
      }
      return output;
    }
  }
};

export { constraintModule as default };
