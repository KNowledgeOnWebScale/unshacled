import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nodeShapes: {},
    properties: {},
    showNodeShapeModal: false
  },
  mutations: {
    /**
     * Load in some example data
     * @param state
     */
    loadExample(state) {
      console.log("Loading example...");

      state.nodeShapes = {
        "ex:Alice": {
          "@id": "ex:Alice",
          "@type": "ex:Person",
          properties: ["foaf:firstName", "foaf:lastName"]
        }
      };

      state.properties = {
        "foaf:firstName": {
          path: "foaf:firstName",
          maxCount: 1,
          minCount: 1,
          datatype: "xsd:string"
        },
        "foaf:lastName": {
          path: "foaf:lastName",
          maxCount: 1,
          minCount: 1,
          datatype: "xsd:string"
        }
      };
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
     * Delete the node shape with the given id.
     * @param state
     * @param id
     */
    deleteNodeShape(state, id) {
      Vue.delete(state.nodeShapes, id);
    },

    /**
     * Add a property shape with the given id.
     * @param state
     * @param id
     */
    addPropertyShape(state, id) {
      Vue.set(state.properties, id, {});
    },

    /**
     * Delete the property shape with the given id.
     * @param state
     * @param id
     */
    deletePropertyShape(state, id) {
      Vue.delete(state.properties, id);
    },

    /**
     * Toggle the visibility of the node shape modal.
     * @param state
     */
    toggleNodeShapeModal(state) {
      state.showNodeShapeModal = !state.showNodeShapeModal;
    },

    /**
     * Clear all shapes and properties from the current state.
     * @param state the current state
     */
    clear(state) {
      console.log("Clear!");
      state.nodeShapes = {};
      state.properties = {};
    }
  },
  actions: {}
});
