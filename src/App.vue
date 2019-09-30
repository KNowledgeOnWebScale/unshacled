<template>
  <div id="app">
    <portal-target name="semantic-ui-vue"></portal-target>
    <nav-bar></nav-bar>

    <multipane id="multipane" layout="vertical">
      <div id="dataTextView" class="text-panel">
        <data-text-view :height="getHeight()"></data-text-view>
      </div>
      <multipane-resizer id="resizer"></multipane-resizer>
      <div id="editorContainer" class="fill-height">
        <editor></editor>
      </div>
    </multipane>
  </div>
</template>
<script>
import { Multipane, MultipaneResizer } from "vue-multipane";
import NavBar from "./components/NavBar.vue";
import Editor from "./components/Editor.vue";
import DataTextView from "./components/DataTextView.vue";
import { MARGIN_TOP } from "./config/konvaConfigs";

export default {
  name: "App",
  components: {
    NavBar,
    Editor,
    Multipane,
    MultipaneResizer,
    DataTextView
  },
  methods: {
    /**
     * Determine the available height for the data text view.
     * @returns {number} the available height.
     */
    getHeight() {
      return window.innerHeight - MARGIN_TOP;
    }
  }
};

/* Require approval before closing the page. */
// TODO enable this again
// window.onbeforeunload = function() {
//   return "Are you sure you want to quit without saving? Any unsaved progress will be lost.";
// };
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#resizer {
  width: 3px;
  min-width: 3px;
  height: 100%;
  padding-bottom: 95vh;
  margin-left: -5px;
  margin-right: 5px;
  background: black;
}
#editorContainer {
  min-width: 100px;
}

.text-panel {
  width: 30vw;
  min-width: 250px;
  max-width: 70vw;
}
.fill-height {
  height: 100%;
}
</style>
