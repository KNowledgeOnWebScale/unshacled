import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nodeShapes: {},
    properties: {}
  },
  mutations: {
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

    addNodeShape(state, name) {
      Vue.set(state.nodeShapes, name, {
        "@id": name,
        "@type:": null,
        properties: []
      });
      console.log("NodeShapes:", state.nodeShapes);
    },

    addPropertyShape(state, name) {
      Vue.set(state.properties, name, {});
      console.log("Properties:", state.properties);
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
