import Vue from "vue";
import SuiVue from "semantic-ui-vue";
import VueKonva from "vue-konva";
import Vuex from "vuex";
import App from "./App.vue";
import store from "./store";
import "semantic-ui-css/semantic.min.css";

Vue.config.productionTip = false;
Vue.use(SuiVue);
Vue.use(VueKonva);
Vue.use(Vuex);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
