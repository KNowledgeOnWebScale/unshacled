import Vue from "vue";
import SuiVue from "semantic-ui-vue";
import VueKonva from "vue-konva";
import App from "./App.vue";
import store from "./store";
import "semantic-ui-css/semantic.min.css";

Vue.config.productionTip = false;
Vue.use(SuiVue);
Vue.use(VueKonva);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
