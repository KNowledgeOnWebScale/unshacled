<template>
  <div id="app">
    <nav-bar></nav-bar>
    <editor></editor>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Editor from "./components/Editor.vue";

export default {
  name: "App",
  components: {
    NavBar,
    Editor
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
