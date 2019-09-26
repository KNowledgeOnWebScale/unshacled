import Vue from "vue";
import Vuex from "vuex";
import SuiVue from "semantic-ui-vue";
import VueKonva from "vue-konva";
import PortalVue from "portal-vue";

import App from "./App.vue";
import store from "./store/store";
import undoRedoMixin from "./store/undoRedoMixin";
import "semantic-ui-css/semantic.min.css";

Vue.config.productionTip = false;
Vue.use(SuiVue);
Vue.use(VueKonva);
Vue.use(Vuex);
Vue.use(PortalVue);
/* Ignore all mutations except the dedicated `saveState`-mutation. */

new Vue({
  store,
  mixins: [undoRedoMixin],
  render: h => h(App)
}).$mount("#app");
