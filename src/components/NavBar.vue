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

          <sui-dropdown-item @click="exportFile(shacl)">
            Export as SHACL
          </sui-dropdown-item>

          <sui-dropdown-divider></sui-dropdown-divider>

          <sui-dropdown-item @click="loadExample">
            Load Example
          </sui-dropdown-item>

          <sui-dropdown-divider></sui-dropdown-divider>

          <sui-dropdown-item @click="toggleNamespaceModal">
            Namespaces...
          </sui-dropdown-item>
        </sui-dropdown-menu>
      </sui-dropdown>
      <sui-menu-item class="clickable" icon="add" @click="createNodeShape">
        Shape
      </sui-menu-item>
      <sui-menu-item class="clickable" icon="add" @click="createPropertyShape">
        Property
      </sui-menu-item>

      <sui-menu-item
        class="clickable"
        icon="check"
        :disabled="!dataFileUploaded()"
        @click="validate"
      >
        Validate
        <sui-label v-if="!dataFileUploaded()" color="red">
          No data file uploaded
        </sui-label>
        <sui-label v-if="dataFileUploaded()" color="green">
          {{ $store.state.mData.dataFileName }}
        </sui-label>
      </sui-menu-item>

      <sui-menu-item
        class="clickable"
        icon="trash"
        @click="toggleClearModal"
      ></sui-menu-item>

      <!--
      <sui-menu-menu position="right">
        <sui-menu-item class="clickable" icon="user"></sui-menu-item>
      </sui-menu-menu>
      -->
    </sui-menu>

    <clear-modal></clear-modal>
    <export-modal></export-modal>
    <namespace-modal></namespace-modal>

    <path-modal
      :editing="$store.state.pathModal.editing"
      :shape-i-d="$store.state.pathModal.shapeID"
    ></path-modal>
    <validation-report-modal
      :report="this.$store.state.mData.validationReport"
    ></validation-report-modal>

    <predicate-modal
      :modal-properties="$store.state.mShape.mConstraint.mModal"
    ></predicate-modal>
    <edit-shape-modal
      :modal-properties="$store.state.mShape.shapeModal"
    ></edit-shape-modal>
  </div>
</template>

<script>
import SuiDropdown from "semantic-ui-vue/dist/commonjs/modules/Dropdown/Dropdown";
import SuiDropdownDivider from "semantic-ui-vue/dist/commonjs/modules/Dropdown/DropdownDivider";
import languages from "../util/enums/languages";

// Modals
import ClearModal from "./Modals/ClearModal.vue";
import ValidationReportModal from "./Modals/ValidationReportModal.vue";
import PredicateModal from "./Modals/PredicateModal.vue";
import ExportModal from "./Modals/ExportModal.vue";
import PathModal from "./Modals/PathModal.vue";
import EditShapeModal from "./Modals/EditShapeModal.vue";
import NamespaceModal from "./Modals/NamespaceModal.vue";

export default {
  name: "NavBar",
  components: {
    NamespaceModal,
    EditShapeModal,
    PathModal,
    ExportModal,
    ClearModal,
    SuiDropdownDivider,
    SuiDropdown,
    ValidationReportModal,
    PredicateModal
  },
  data() {
    return {
      shacl: languages.SHACL,
      shex: languages.SHEX
    };
  },
  methods: {
    toggleClearModal() {
      this.$store.commit("toggleClearModal");
    },
    toggleNamespaceModal() {
      this.$store.commit("toggleNamespaceModal");
    },
    createNodeShape() {
      this.$store.dispatch("addNodeShape");
    },
    createPropertyShape() {
      this.$store.commit("togglePathModal", {});
    },

    loadExample() {
      this.$store.dispatch("loadExample");
    },

    readTextFile() {
      const file = document.getElementById("file").files[0];
      this.$store.dispatch("uploadSchemaFile", file);
    },
    exportFile(type) {
      this.$store.commit("toggleExportModal", type);
    },
    uploadDataFile() {
      const file = document.getElementById("dataFile").files[0];
      this.$store.dispatch("uploadDataFile", file);
    },
    dataFileUploaded() {
      return this.$store.state.mData.dataFile.length > 0;
    },
    validate() {
      this.$store.dispatch("validate");
    }
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
