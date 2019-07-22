<template>
  <div>
    <sui-menu ref="navbar" attached="top" inverted>
      <sui-dropdown item icon="file alternate" simple>
        <sui-dropdown-menu>
          <sui-dropdown-item
            ><input id="file" type="file" @change="readTextFile()"
          /></sui-dropdown-item>
          <sui-dropdown-item>Export</sui-dropdown-item>
          <sui-dropdown-divider></sui-dropdown-divider>
          <sui-dropdown-item @click="loadExample">
            Load Example
          </sui-dropdown-item>
        </sui-dropdown-menu>
      </sui-dropdown>
      <sui-menu-item class="clickable" icon="add" @click="toggleShapeModal">
        Shape
      </sui-menu-item>
      <sui-menu-item class="clickable" icon="add" @click="togglePropertyModal">
        Property
      </sui-menu-item>
      <sui-menu-item class="clickable">
        <div>
          <label for="dataFile" style="cursor: pointer" icon="add" class="btn"
            >Upload data</label
          >
          <input
            id="dataFile"
            style="display: none;"
            type="file"
            @change="uploadDataFile()"
          />
        </div>
      </sui-menu-item>
      <sui-menu-item class="clickable" icon="check" @click="validate">
        Validate
      </sui-menu-item>
      <sui-menu-item
        class="clickable"
        icon="trash"
        @click="clear"
      ></sui-menu-item>
      <sui-menu-menu position="right">
        <sui-menu-item class="clickable" icon="user"></sui-menu-item>
      </sui-menu-menu>
    </sui-menu>
    <node-shape-modal
      :is-property-shape-modal="createPropertyShape"
    ></node-shape-modal>
    <validation-report-modal></validation-report-modal>
  </div>
</template>

<script>
import SuiDropdown from "semantic-ui-vue/dist/commonjs/modules/Dropdown/Dropdown";
import SuiDropdownDivider from "semantic-ui-vue/dist/commonjs/modules/Dropdown/DropdownDivider";
import NodeShapeModal from "./NodeShapeModal.vue";
import ValidationReportModal from "./ValidationReportModal.vue";

export default {
  name: "NavBar",
  components: {
    NodeShapeModal,
    SuiDropdownDivider,
    SuiDropdown,
    ValidationReportModal
  },
  data() {
    return {
      createPropertyShape: false
    };
  },
  methods: {
    clear() {
      this.$store.commit("clear");
    },
    loadExample() {
      this.$store.commit("loadExample");
    },
    toggleShapeModal() {
      this.createPropertyShape = false;
      this.$store.commit("toggleShapeModal");
    },
    togglePropertyModal() {
      this.createPropertyShape = true;
      this.$store.commit("toggleShapeModal");
    },
    readTextFile() {
      const file = document.getElementById("file").files[0];
      this.$store.commit("uploadSchemaFile", file);
    },
    uploadDataFile() {
      const file = document.getElementById("dataFile").files[0];
      this.$store.commit("uploadDataFile", file);
    },
    validate() {
      this.$store.commit("validate");
    }
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
