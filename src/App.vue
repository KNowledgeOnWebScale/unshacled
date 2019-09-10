<template>
  <div id="app">
    <portal-target name="semantic-ui-vue"></portal-target>
    <nav-bar></nav-bar>
    <multipane id="multipane" layout="vertical">
      <div id="dataTextView" class="text-panel">
        <data-text-view :height="getHeight()"></data-text-view>
      </div>
      <multipane-resizer id="resizer" @drag="handleResize"></multipane-resizer>
      <div id="editorContainer">
        <editor></editor>
      </div>
    </multipane>
  </div>
</template>

<script>
import Vue from "vue";
import PortalVue from "portal-vue";
import { Multipane, MultipaneResizer } from "vue-multipane";
import NavBar from "./components/NavBar.vue";
import Editor from "./components/Editor.vue";
import DataTextView from "./components/DataTextView.vue";
import { MARGIN_TOP } from "./config/konvaConfigs";

Vue.use(PortalVue);

export default {
  name: "App",
  components: {
    NavBar,
    Editor,
    Multipane,
    MultipaneResizer,
    DataTextView
  },
  mounted() {
    window.addEventListener("resize", this.handleResize); // React to window resizing.
    this.handleResize();
  },
  methods: {
    handleResize() {
      document.getElementById("resizer").style.paddingBottom = (
        window.innerHeight - MARGIN_TOP
      ).toString();
      document.getElementById("resizer").style.height = (
        window.innerHeight - MARGIN_TOP
      ).toString();
    },
    getHeight() {
      return window.innerHeight - MARGIN_TOP;
    }
  }
};

/*
TODO enable this again
window.onbeforeunload = function() {
  return "Are you sure you want to quit without saving? Any unsaved progress will be lost.";
};
)/
 */
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.text-panel {
  width: 100px;
  min-width: 100px;
  max-width: 50%;
}

#resizer {
  width: 5px;
  height: 30px;
  padding-bottom: 200px;
  margin-right: 20px;
  background: black;
}
#editorContainer {
  min-width: 100px;
  width: 100%;
}
</style>
