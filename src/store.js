import Vue from "vue";
import Vuex from "vuex";
import { format } from "./util/enums/format";
import { getConstraints } from "./util/constraintSelector";
import { HEIGHT } from "./util/konvaConfigs";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: null,
    format: format.SHACL,
    nodeShapes: {},
    propertyShapes: {},
    relationships: {},
    yValues: {},
    coordinates: {},
    showNodeShapeModal: false,
    file: {},
    internalModel: {}
  },
  mutations: {
    setEditor(state, reference) {
      state.editor = reference;
    },

    /**
     * Load in some example data
     * @param state
     */
    loadExample(state) {
      console.log("Loading example...");
      const firstName = {
        path: "foaf:firstName",
        maxCount: 1,
        minCount: 1,
        datatype: "xsd:string"
      };
      const lastName = {
        path: "foaf:lastName",
        maxCount: 1,
        minCount: 1,
        datatype: "xsd:string"
      };

      const idAlice = "ex:Alice";
      const idBob = "ex:Bob";
      const idFirstName = "foaf:firstName";
      const idLastName = "foaf:lastName";

      const alice = {
        "@id": idAlice,
        "@type": "ex:Person",
        properties: [idFirstName, idLastName]
      };
      const bob = {
        "@id": idBob,
        "@type": "ex:Person",
        properties: [idFirstName, idLastName]
      };

      state.nodeShapes = {};
      state.nodeShapes[idBob] = bob;
      state.nodeShapes[idAlice] = alice;

      state.propertyShapes = {};
      state.propertyShapes[idFirstName] = firstName;
      state.propertyShapes[idLastName] = lastName;

      // Update the y values of the properties.
      state.yValues = {};
      const people = [alice, bob];
      for (const p in people) {
        const ys = {};
        let i = 1;
        for (const prop of people[p].properties) {
          ys[prop] = i * HEIGHT;
          i += 1;
        }
        state.yValues[people[p]["@id"]] = ys;
      }
      state.coordinates[idAlice] = { x: 0, y: 0 };
      state.coordinates[idBob] = { x: 200, y: 200 };
      state.coordinates[idFirstName] = { x: 100, y: 350 };
      state.coordinates[idLastName] = { x: 100, y: 400 };
      this.commit("addRelationship", {
        one: idAlice,
        two: idBob
      });
    },

    /**
     * Add an empty node shape with the given id.
     * @param state
     * @param id
     */
    addNodeShape(state, id) {
      Vue.set(state.nodeShapes, id, {
        "@id": id,
        "@type:": null,
        properties: []
      });
    },

    /**
     * Edit the id of the given node shape.
     * @param state
     * @param args
     *    oldID: the old ID we want to change.
     *    newID: the new ID for the node shape.
     */
    editNodeShape(state, args) {
      const { oldID, newID } = args;

      // Update nodeShapes
      Vue.set(state.nodeShapes, newID, state.nodeShapes[oldID]);
      Vue.delete(state.nodeShapes, oldID);
      state.nodeShapes[newID] = {
        ...state.nodeShapes[newID],
        "@id": newID
      };

      // Update Relationships
      for (let prop in state.relationships) {
        if (state.relationships[prop].one === oldID)
          state.relationships[prop].one = newID;
        if (state.relationships[prop].two === oldID)
          state.relationships[prop].two = newID;
        prop = state.relationships[prop].one + state.relationships[prop].two;
      }

      // Update coordinates
      Vue.set(state.coordinates, newID, state.coordinates[oldID]);
      Vue.delete(state.coordinates, oldID);
      state.coordinates[newID] = {
        ...state.coordinates[newID],
        "@id": newID
      };

      // Update yValues
      Vue.set(state.yValues, newID, state.yValues[oldID]);
      Vue.delete(state.yValues, oldID);
      state.yValues[newID] = {
        ...state.yValues[newID],
        "@id": newID
      };
    },

    /**
     * Delete the node shape with the given id.
     * @param state
     * @param id
     */
    deleteNodeShape(state, id) {
      Vue.delete(state.nodeShapes, id);
    },

    /**
     * Edit the given property in the given node shape.
     * If the new property ID already exists, this will make a copy
     * @param state
     * @param args
     */
    editProperty(state, args) {
      const { node, oldID, newID } = args;

      const index = state.nodeShapes[node].properties.indexOf(oldID);
      // Check if the new property name is already an existing PropertyShape.
      if (!state.propertyShapes[newID]) {
        // If not, create a new PropertyShape that's a copy of the original one.
        const copied = { ...state.propertyShapes[oldID] };
        Vue.set(state.propertyShapes, newID, copied);
        Vue.set(state.coordinates, newID, { x: 0, y: 0 });
      }

      // Remove the old value from the list of properties.
      state.nodeShapes[node].properties.splice(index, 1, newID);

      // Update the y values of the properties.
      Vue.set(state.yValues, node, {});
      let i = 1;
      for (const prop of state.nodeShapes[node].properties) {
        Vue.set(state.yValues[node], prop, i * HEIGHT);
        i += 1;
      }
    },

    /**
     * Edit the ID of a property shape.
     * This will update the property list of every node shape that contains this property shape.
     * @param state
     * @param args
     */
    editPropertyShape(state, args) {
      const { oldID, newID } = args;

      // Update the state's list of propertyShapes.
      Vue.set(state.propertyShapes, newID, state.propertyShapes[oldID]);
      Vue.delete(state.propertyShapes, oldID);

      // Update the coordinates.
      Vue.set(state.coordinates, newID, state.coordinates[oldID]);
      Vue.delete(state.coordinates, oldID);

      // Update the property name in every node shape.
      for (const n in state.nodeShapes) {
        const currentNode = state.nodeShapes[n];
        const index = currentNode.properties.indexOf(oldID);
        if (index !== -1) {
          state.nodeShapes[n].properties.splice(index, 1, newID);
        }
      }

      // Update the y values of the properties.
      for (const n in state.nodeShapes) {
        Vue.set(state.yValues, n, {});
        let i = 1;
        for (const prop of state.nodeShapes[n].properties) {
          Vue.set(state.yValues[n], prop, i * HEIGHT);
          i += 1;
        }
      }
    },

    /**
     * Delete the given property from the given node shape.
     * @param state
     * @param args the id of the node shape and the id of the property that should be removed from the shape.
     */
    deletePropFromNode(state, args) {
      const { node, prop } = args;
      const newProperties = state.nodeShapes[node].properties.filter(
        p => p !== prop
      );
      state.nodeShapes[node] = {
        ...state.nodeShapes[node],
        properties: newProperties
      };
      state.nodeShapes = {
        ...state.nodeShapes
      };

      // Update the y values of the properties.
      let i = 1;
      for (const prop of state.nodeShapes[node].properties) {
        Vue.set(state.yValues[node], prop, i * HEIGHT);
        i += 1;
      }
    },

    /**
     * Add a property shape with the given id.
     * @param state
     * @param id
     */
    addPropertyShape(state, id) {
      Vue.set(state.propertyShapes, id, {
        "@id": id
      });
      Vue.set(state.coordinates, id, { x: 0, y: 0 });
    },

    /**
     * Delete the property shape with the given id.
     * @param state
     * @param id
     */
    deletePropertyShape(state, id) {
      Vue.delete(state.propertyShapes, id);
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
    },

    /**
     * Takes two keys from nodeshapes and uses them to add a relationship to the state
     * @param state
     * @param keys contains two keys, which can be queried using keys.one and keys.two.
     */
    addRelationship(state, keys) {
      Vue.set(state.relationships, keys.one + keys.two, {
        "@id": keys.one + keys.two,
        one: keys.one,
        two: keys.two,
        coords: [
          state.coordinates[keys.two].x,
          state.coordinates[keys.two].y,
          state.coordinates[keys.one].y,
          state.coordinates[keys.one].x
        ]
      });
    },

    /**
     * Toggle the visibility of the node shape modal.
     * @param state
     */
    toggleShapeModal(state) {
      event.preventDefault();
      state.showNodeShapeModal = !state.showNodeShapeModal;
    },

    /**
     * Clear all shapes and properties from the current state.
     * @param state the current state
     */
    clear(state) {
      console.log("Clear!");
      state.nodeShapes = {};
      state.propertyShapes = {};
      state.relationships = {};
      state.coordinates = {};
      state.yValues = {};
    },

    createProperty() {}
  },
  actions: {},
  getters: {
    getValidators: state => {
      return getConstraints(state.format);
    }
  }
});
