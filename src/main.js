import Vue from "vue";
import SuiVue from "semantic-ui-vue";
import Vuex from "vuex";
import VueKonva from "vue-konva";
import PortalVue from "portal-vue";
import VuexUndoRedo from "vuex-undo-redo";
import App from "./App.vue";
import store from "./store/store";
import "semantic-ui-css/semantic.min.css";

Vue.config.productionTip = false;
Vue.use(SuiVue);
Vue.use(VueKonva);
Vue.use(Vuex);
Vue.use(PortalVue);
/* Ignore all mutations except the dedicated `saveState`-mutation. */
Vue.use(VuexUndoRedo, {
  ignoreMutations: [
    "addPrefix",
    "addShape",
    "clear",
    "clearLocations",
    "clearTableEdit",
    "deleteConstraintFromShape",
    "deletePrefix",
    "deletePropertyFromShape",
    "deleteShapeAtIndex",
    "deleteShapeLocations",
    "emptyState",
    "resetPredicateModal",
    "selectRow",
    "setBaseUri",
    "setConstraintValue",
    "setData",
    "setEditor",
    "setJsonData",
    "setModel",
    "sortPredicateModal",
    "startEditingNamespace",
    "toggleClearModal",
    "toggleEditShapeModal",
    "toggleExportModal",
    "toggleNamespaceModal",
    "togglePathModal",
    "togglePredicateModal",
    "toggleValidationReport",
    "updateCoordinates",
    "updateLocations",
    "updateNamespacePrefix",
    "updateNamespaceURI",
    "updateShape",
    "updateShapeID",
    "updateYValues",
    "validateWithModel"
  ]
});

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
