import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    shapes: {}
  },
  mutations: {
    loadExample(state) {
      console.log("Loading example...");
      state.shapes = {
        "ex:Alice": {
          "@id": "ex:Alice",
          "@type": "ex:Person",
          property: {
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
          }
        }
      };
      for (const obj of state.shapes) {
        console.log(obj);
      }
    },
    clear(state) {
      console.log("Clear!");
      state.shapes = {};
    }
  },
  actions: {}
});
