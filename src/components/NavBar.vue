<template>
  <sui-menu ref="navbar" attached="top" inverted>
    <sui-dropdown item icon="file alternate" simple>
      <sui-dropdown-menu>
        <sui-dropdown-item>Import</sui-dropdown-item>
        <sui-dropdown-item>Export</sui-dropdown-item>
        <sui-dropdown-divider></sui-dropdown-divider>
        <sui-dropdown-item @click="loadExample">
          Load Example
        </sui-dropdown-item>
      </sui-dropdown-menu>
    </sui-dropdown>
    <sui-menu-item class="clickable" icon="add">Shape</sui-menu-item>
    <sui-menu-item
      class="clickable"
      icon="trash"
      @click="clear"
    ></sui-menu-item>
    <sui-menu-menu position="right">
      <sui-menu-item class="clickable" icon="user"></sui-menu-item>
    </sui-menu-menu>
  </sui-menu>
</template>

<script>
import SuiDropdown from "semantic-ui-vue/dist/commonjs/modules/Dropdown/Dropdown";
import SuiDropdownDivider from "semantic-ui-vue/dist/commonjs/modules/Dropdown/DropdownDivider";

export default {
  name: "NavBar",
  components: { SuiDropdownDivider, SuiDropdown },
  methods: {
    clear() {
      this.$store.commit("clear");
    },
    loadExample() {
      this.$store.commit("loadExample");
    }
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
