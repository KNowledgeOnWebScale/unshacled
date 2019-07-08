<template>
  <sui-menu attached="top" inverted="true">
    <sui-dropdown-menu>
      <sui-dropdown item icon="file alternate" simple>
        <sui-dropdown-menu>
          <sui-dropdown-item>Import</sui-dropdown-item>
          <sui-dropdown-item>Export</sui-dropdown-item>
          <sui-dropdown-divider></sui-dropdown-divider>
          <sui-dropdown-item>Load Example</sui-dropdown-item>
        </sui-dropdown-menu>
      </sui-dropdown>
    </sui-dropdown-menu>
    <sui-menu-item icon="add">Shape</sui-menu-item>
    <sui-menu-menu position="right">
      <sui-menu-item icon="user"></sui-menu-item>
    </sui-menu-menu>
  </sui-menu>
</template>

<script>
import SuiDropdown from "semantic-ui-vue/dist/commonjs/modules/Dropdown/Dropdown";
import SuiDropdownDivider from "semantic-ui-vue/dist/commonjs/modules/Dropdown/DropdownDivider";

export default {
  name: "NavBar",
  components: { SuiDropdownDivider, SuiDropdown }
};
</script>

<style scoped></style>
