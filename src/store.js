import Vue from "vue";
import Vuex from "vuex";
import { format } from "./util/enums/format";
import { getConstraints } from "./util/constraintSelector";
import { HEIGHT } from "./util/konvaConfigs";
import EXAMPLE from "./util/examples";
import urlToName from "./util/nameParser";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: null,
    model: [],
    format: format.SHACL,
    // nodeShapes: {}, // TODO remove this
    // propertyShapes: {}, // TODO remove this
    // relationships: {}, // TODO remove this
    yValues: {},
    coordinates: {},
    showNodeShapeModal: false,
    file: null
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

      const example = EXAMPLE.model[0];
      state.model = Vue.util.extend([], example); // Deep copy

      // Update y values and set coordinates to zero
      for (const shape of state.model) {
        this.commit("updateYValues", shape["@id"]);
        Vue.set(state.coordinates, shape["@id"], { x: 0, y: 0 }); // TODO change default coordinates
      }
    },

    /* ADD ========================================================================================================== */

    /**
     * Add an empty node shape with the given id.
     * @param state
     * @param id
     */
    addNodeShape(state, id) {
      state.model.push({
        "@id": id,
        "@type:": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [],
        "https://2019.summerofcode.be/unshacled#targetNode": []
      });
      Vue.set(state.coordinates, id, { x: 0, y: 0 });
    },

    /**
     * Add a property shape with the given id.
     * @param state
     * @param id
     */
    addPropertyShape(state, id) {
      state.model.push({
        "@id": id,
        "https://2019.summerofcode.be/unshacled#path": [
          `http://example.org/ns#${id}`
        ]
      });
      Vue.set(state.coordinates, id, { x: 0, y: 0 });
    },

    /**
     * Add a property with the given id and value to the node with the given id.
     * @param state
     * @param args
     *              nodeID id of the node
     *              propertyID id of the property we want to add
     *              propertyValue object with the value of the property we want to add
     */
    addPropertyToNode(state, args) {
      const { nodeID, propertyID, propertyValue } = args;
      // FIXME should not be put in list if it is a list already
      Vue.set(state.model[nodeID], propertyID, [propertyValue]);
      // TODO complete this
      this.commit("updateYValues", nodeID);
    },

    /**
     * Takes two keys from nodeshapes and uses them to add a relationship to the state
     * @param state
     * @param keys contains two keys, which can be queried using keys.one and keys.two.
     */
    /*
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
     */

    /* EDIT ========================================================================================================= */

    /**
     * Edit the id of the given node shape.
     * @param state
     * @param args
     *    oldID: the old ID we want to change.
     *    newID: the new ID for the node shape.
     */
    editNodeShape(state, args) {
      const { oldID, newID } = args;

      // Update the shape's ID
      const index = state.getters.indexWithID(oldID);
      Vue.set(state.model[index], "@id", newID);

      // Update Relationships
      /*
      for (let prop in state.relationships) {
        if (state.relationships[prop].one === oldID)
          state.relationships[prop].one = newID;
        if (state.relationships[prop].two === oldID)
          state.relationships[prop].two = newID;
        prop = state.relationships[prop].one + state.relationships[prop].two;
      }
       */

      // Update coordinates
      Vue.set(state.coordinates, newID, state.coordinates[oldID]);
      Vue.delete(state.coordinates, oldID);

      // Update yValues
      Vue.set(state.yValues, newID, state.yValues[oldID]);
      Vue.delete(state.yValues, oldID);
    },

    /**
     * Edit the given property in the given node shape.
     * If the new property ID already exists, this will make a copy
     * @param state
     * @param args
     */
    editPropertyInNode(state, args) {
      const { node, oldID, newID } = args;

      // Check if the new property name is already an existing PropertyShape.
      if (!state.getters.propertyShapes[newID]) {
        // If not, create a new PropertyShape that is a copy of the original one.
        const copied = Vue.util.extend({}, state.getters.propertyShapes[oldID]);
        copied["@id"] = newID;

        const name = urlToName(newID);
        copied["https://2019.summerofcode.be/unshacled#path"][0][
          "@id"
        ] = `http://example.org/ns#${name}`;
        // TODO dromedarisCaseOrSomething

        state.model.push(copied);
        Vue.set(state.coordinates, newID, { x: 0, y: 0 });
      }

      // Put the new value in the list of shape properties
      // FIXME this assumes properties, not constraints or targetNodes or sth
      state.getters
        .shapeWithID(node)
        ["https://2019.summerofcode.be/unshacled#property"].push({
          "@id": newID
        });

      // Remove the old value from the list of shape properties.
      const properties = state.getters.shapeWithID(node)[
        "https://2019.summerofcode.be/unshacled#property"
      ];
      for (const p in properties) {
        if (properties[p]["@id"] === oldID) Vue.delete(properties, p);
      }

      // Update the y values
      this.commit("updateYValues", node);
    },

    /**
     * Edit the ID of a property shape.
     * This will update the property list of every node shape that contains this property shape.
     * @param state
     * @param args
     */
    editPropertyShape(state, args) {
      const { oldID, newID } = args;

      // Update the state's shapes.
      const shape = state.getters.shapeWithID(oldID);
      Vue.set(shape, "@id", newID);
      // Update the path with the new ID
      const name = urlToName(newID);
      shape["https://2019.summerofcode.be/unshacled#path"][0][
        "@id"
      ] = `http://example.org/ns#${name}`;

      // Update the property name in every node shape.
      for (const shape of state.model) {
        const properties =
          shape["https://2019.summerofcode.be/unshacled#property"];
        for (const p in properties) {
          if (properties[p]["@id"] === oldID)
            Vue.set(properties[p], "@id", newID);
        }
      }

      // Update the coordinates.
      Vue.set(state.coordinates, newID, state.coordinates[oldID]);
      Vue.delete(state.coordinates, oldID);

      // Update the y values of the properties.
      for (const n in state.nodeShapes) {
        this.commit("updateYValues", n);
      }
    },

    /* DELETE ======================================================================================================= */

    deleteShapeAtIndex(state, index) {
      Vue.delete(state.model, index);
    },

    deleteShapeLocations(state, id) {
      Vue.delete(state.coordinates, id);
      Vue.delete(state.yValues, id);
    },

    /* HELPERS ====================================================================================================== */

    /**
     * Update the y values of the properties of the given node.
     * @param state
     * @param nodeID
     */
    updateYValues(state, nodeID) {
      // Update the y values of the properties.
      Vue.set(state.yValues, nodeID, {});

      let node;
      for (const item of state.model) {
        if (item["@id"] === nodeID) node = item;
      }

      // FIXME code duplication, find a way to use `nodeProperties` >.<
      const propertyObjects =
        node["https://2019.summerofcode.be/unshacled#property"];

      // Get the references to property shapes
      const properties = [];
      if (propertyObjects) {
        for (const p of propertyObjects) properties.push(p["@id"]);
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

      let i = 1;
      for (const prop of properties) {
        Vue.set(state.yValues[nodeID], prop, i * HEIGHT);
        i += 1;
      }
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
      state.model = [];
      state.coordinates = {};
      state.yValues = {};
    }
  },
  actions: {
    /**
     * Delete the node shape with the given id.
     * @param state
     * @param id
     */
    deleteNodeShape(state, id) {
      this.commit("deleteShapeAtIndex", state.getters.indexWithID(id));
      this.commit("deleteShapeLocations", id);
    },

    /**
     * Delete the property shape with the given id.
     * @param state
     * @param id
     */
    deletePropertyShape(state, id) {
      // Check every nodeShape if it contains the given property.
      for (const shape of state.model) {
        const properties =
          shape["https://2019.summerofcode.be/unshacled#property"];

        for (const p in properties) {
          if (properties[p]["@id"]) {
            // Delete the property from the node and update the y values.
            properties.splice(p, 1);
            this.commit("updateYValues", shape["@id"]);
          }
        }
      }
      // Remove the property from the state
      this.commit("deleteShapeAtIndex", state.getters.indexWithID(id));
      this.commit("deleteShapeLocations", id);
    },

    /**
     * Delete the given property from the given node shape.
     * @param state
     * @param args
     *            node the id of the node shape
     *            prop the id of the property that should be removed from the shape
     */
    deletePropFromNode(state, args) {
      const { node, prop } = args;

      const shape = state.getters.shapeWithID(node);
      const properties =
        shape["https://2019.summerofcode.be/unshacled#property"];

      for (const p in properties) {
        if (properties[p]["@id"] === prop) {
          // Delete the property from the node and update the y values.
          properties.splice(p, 1);
        }
      }

      // Update the y values
      this.commit("updateYValues", node);
    }
  },
  getters: {
    /**
     * TODO
     * @param state
     * @returns {null}
     */
    validators: state => {
      return getConstraints(state.format);
    },

    /**
     * TODO
     * @param state
     * @param id
     * @returns {null}
     */
    shapeWithID: state => id => {
      for (const item of state.model) {
        if (item["@id"] === id) return item;
      }
      return null;
    },

    /**
     * TODO
     * @param state
     * @param id
     * @returns {string|number}
     */
    indexWithID: state => id => {
      for (const i in state.model) {
        if (state.model[i]["@id"] === id) return i;
      }
      return -1;
    },

    /**
     * TODO
     * @param state
     */
    nodeShapes: state => {
      const nodeShapes = {};
      for (const item of state.model) {
        if (item["@type"]) {
          nodeShapes[item["@id"]] = item;
        }
      }
      return nodeShapes;
    },

    /**
     * TODO
     * @param state
     */
    propertyShapes: state => {
      const propertyShapes = {};
      for (const item of state.model) {
        if (!item["@type"]) {
          propertyShapes[item["@id"]] = item;
        }
      }
      return propertyShapes;
    },

    /**
     * TODO
     * @param state
     * @returns {function(*): Array}
     */
    nodeProperties: state => nodeID => {
      let node;
      for (const item of state.model) {
        if (item["@id"] === nodeID) {
          node = item;
        }
      }

      const propertyObjects =
        node["https://2019.summerofcode.be/unshacled#property"];

      // Get the references to property shapes
      const properties = [];
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
      return properties;
    }
  }
});
