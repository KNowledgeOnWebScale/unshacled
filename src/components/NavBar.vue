<template>
  <div>
    <sui-menu id="navbar" ref="navbar" attached="top" inverted>
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

      <sui-menu-item
        class="clickable"
        icon="undo alterate"
        :disabled="!$root.canUndo()"
        @click="undoAction"
      ></sui-menu-item>
      <!--
      TODO implement redo functionality.
      <sui-menu-item
        class="clickable"
        icon="redo alternate"
        :disabled="!$root.canRedo()"
        @click="redoAction"
      ></sui-menu-item>
      -->

      <!--
      <sui-menu-menu position="right">
        <sui-menu-item class="clickable" icon="user"></sui-menu-item>
      </sui-menu-menu>
      -->
      <sui-menu-menu position="right">
        <a href="https://github.com/oSoc19/unshacled/" target="_blank">
          <sui-menu-item class="clickable" icon="github"></sui-menu-item>
        </a>
      </sui-menu-menu>
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
  /**
   * Get the string representations of the given languages.
   * Used because the values from `languages` cannot be referenced directly from the HTML.
   * @returns {{shacl: *, shex: *}}
   */
  data() {
    return {
      shacl: languages.SHACL,
      shex: languages.SHEX
    };
  },
  methods: {
    /** Toggle the visibility of the clear modal. */
    toggleClearModal() {
      this.$store.commit("toggleClearModal");
    },
    /** Toggle the visibility of the namespace modal. */
    toggleNamespaceModal() {
      this.$store.commit("toggleNamespaceModal");
    },

    /** Create a new node shape. */
    createNodeShape() {
      this.$store.dispatch("addNodeShape");
    },
    /** Toggle the visibility of the path modal to add a new property. */
    createPropertyShape() {
      this.$store.commit("togglePathModal", {});
    },

    /** Load the example. */
    loadExample() {
      const self = this;
      this.$store.dispatch("loadExample").then(
        () => {
          /* Save the state to undo later. */
          self.$store.commit("saveOperation", {
            state: self.$store.state,
            action: { type: "loadExample" }
          });
        },
        err => console.log(err)
      );
    },

    /** Read the entered text file and upload it as the new model. */
    readTextFile() {
      const file = document.getElementById("file").files[0];
      this.$store.dispatch("uploadSchemaFile", file);
    },
    /** Toggle the export modal using the given file type. */
    exportFile(type) {
      this.$store.commit("toggleExportModal", type);
    },
    /** Read the entered data file and upload it as the new data. */
    uploadDataFile() {
      const file = document.getElementById("dataFile").files[0];
      this.$store.dispatch("uploadDataFile", file);
    },
    /**
     * Check if there is a data file loaded.
     * @returns {boolean} `true` if there is at least one data file loaded.
     */
    dataFileUploaded() {
      return this.$store.state.mData.dataFile.length > 0;
    },

    undoAction() {
      if (this.$root.canUndo()) this.$root.undo();
    },
    redoAction() {
      if (this.$root.canRedo()) this.$root.redo();
    },

    /** Validate the data using the current model. */
    validate() {
      this.$store.dispatch("validateWithCurrentModel");
    }
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
