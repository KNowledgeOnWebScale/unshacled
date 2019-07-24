<template>
  <div>
    <sui-menu ref="navbar" attached="top" inverted>
      <sui-dropdown item icon="file alternate" simple>
        <sui-dropdown-menu>
          <sui-dropdown-item @click="$refs.importShapes.click()">
            <label for="file">Import Shapes...</label>
            <input
              id="file"
              ref="importShapes"
              type="file"
              style="display: none"
              @change="readTextFile()"
            />
          </sui-dropdown-item>
          <sui-dropdown-item @click="$refs.importData.click()">
            <label for="dataFile">Import Data...</label>
            <input
              id="dataFile"
              ref="importData"
              type="file"
              style="display: none"
              @change="uploadDataFile()"
            />
          </sui-dropdown-item>
          <sui-dropdown-item>Export Shapes</sui-dropdown-item>
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
      <sui-menu-item class="clickable" icon="check" @click="validate">
        Validate
      </sui-menu-item>
      <sui-menu-item
        class="clickable"
        icon="trash"
        @click="toggleClearModal"
      ></sui-menu-item>
      <sui-menu-menu position="right">
        <sui-menu-item class="clickable" icon="user"></sui-menu-item>
      </sui-menu-menu>
    </sui-menu>
    <node-shape-modal
      :is-property-shape-modal="createPropertyShape"
    ></node-shape-modal>
    <clear-modal></clear-modal>
    <validation-report-modal></validation-report-modal>
    <add-predicate-modal
      :id="this.$store.state.predicateModal.id"
      :type="this.$store.state.predicateModal.type"
    ></add-predicate-modal>
  </div>
</template>

<script>
import SuiDropdown from "semantic-ui-vue/dist/commonjs/modules/Dropdown/Dropdown";
import SuiDropdownDivider from "semantic-ui-vue/dist/commonjs/modules/Dropdown/DropdownDivider";
import ClearModal from "./Modals/ClearModal.vue";
import NodeShapeModal from "./Modals/NodeShapeModal.vue";
import ValidationReportModal from "./Modals/ValidationReportModal.vue";
import AddPredicateModal from "./Modals/AddPredicateModal.vue";

export default {
  name: "NavBar",
  components: {
    ClearModal,
    NodeShapeModal,
    SuiDropdownDivider,
    SuiDropdown,
    ValidationReportModal,
    AddPredicateModal
  },
  data() {
    return {
      createPropertyShape: false
    };
  },
  methods: {
    loadExample() {
      this.$store.commit("loadExample");
    },
    toggleShapeModal() {
      this.createPropertyShape = false;
      this.$store.commit("toggleShapeModal");
    },
    toggleClearModal() {
      this.$store.commit("toggleClearModal");
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
