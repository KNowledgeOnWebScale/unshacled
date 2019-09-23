<template>
  <div id="namespaceTable">
    <div ref="form" class="ui transparent form">
      <sui-form-field :class="{ error: error() }">
        <input
          ref="inputField"
          v-model="input"
          :focus="$props.tableProperties.editRow !== ''"
          @input="e => (input = e.target.value)"
          @blur="stopEditing"
          @keyup="handleKeyUp"
        />
      </sui-form-field>
    </div>

    <table class="table">
      <tr>
        <td>
          <sui-table color="green" inverted>
            <sui-table-header>
              <sui-table-row>
                <sui-table-header-cell class="one wide">
                  <span class="unclickable">Base URI</span>
                </sui-table-header-cell>
                <sui-table-header-cell class="four wide">
                  <span class="unclickable">Prefix</span>
                </sui-table-header-cell>
                <sui-table-header-cell class="twelve wide unclickable">
                  <span class="unclickable">URI</span>
                </sui-table-header-cell>
              </sui-table-row>
            </sui-table-header>
          </sui-table>
        </td>
      </tr>
      <tr>
        <td>
          <div id="table-body" class="table-body">
            <sui-table>
              <sui-table-body>
                <sui-table-row
                  v-for="(uri, prefix) of $store.getters.namespaces"
                  :key="prefix"
                >
                  <sui-table-cell class="one wide">
                    <sui-checkbox
                      :id="prefix"
                      v-model="checked[prefix]"
                      class="clickable"
                      @mouseup="e => updateBaseUri(e.target, prefix)"
                    ></sui-checkbox>
                  </sui-table-cell>

                  <sui-table-cell class="four wide">
                    <div :id="prefix + 'prefix'"></div>
                    <div
                      v-if="!editingThis(prefix, 'prefix')"
                      @click="startEditing(prefix, 'prefix', prefix)"
                    >
                      {{ prefix }}
                    </div>
                  </sui-table-cell>

                  <sui-table-cell class="eleven wide">
                    <div :id="prefix + 'uri'"></div>
                    <div
                      v-if="!editingThis(prefix, 'uri')"
                      @click="startEditing(prefix, 'uri', uri)"
                    >
                      {{ uri }}
                    </div>
                  </sui-table-cell>

                  <sui-table-cell class="one wide">
                    <sui-icon
                      v-if="!isBaseURI(prefix)"
                      class="clickable"
                      name="x icon"
                      @click="deleteElement(prefix)"
                    ></sui-icon>
                  </sui-table-cell>
                </sui-table-row>
              </sui-table-body>
            </sui-table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Vue from "vue";
import { ENTER } from "../../util/constants";

export default {
  name: "NamespaceTable",
  props: {
    tableProperties: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      input: "",
      currentBaseURI: "",
      checked: {}
    };
  },
  created() {
    /* Populate the checked dictionary. */
    const self = this;
    Object.keys(self.$store.getters.namespaces).map(prefix => {
      self.checked[prefix] = self.isBaseURI(prefix);
    });
  },
  mounted() {
    /* Remove the input field from the top of the table. */
    document.getElementById("namespaceTable").removeChild(this.$refs.form);
    /* Scroll to the top of the table. */
    const body = document.getElementById("table-body");
    body.scrollTop = 0;

    /* Stop editing when the modal is being closed. */
    const self = this;
    this.$store.watch(
      () => self.$store.state.mConfig.mModal.show,
      () => {
        const { editRow, editField } = self.$props.tableProperties;
        if (editRow !== "" && editField !== "") self.stopEditing();
      }
    );

    /* Set the value of the current base URI to match the store state. */
    this.$store.watch(
      () => self.$store.getters.baseURI,
      () => {
        this.currentBaseURI = self.$store.getters.baseURI;
      }
    );
  },
  methods: {
    /**
     * Stop editing when the enter key is pressed.
     * @param {any} e key press event.
     */
    handleKeyUp(e) {
      if (e.keyCode === ENTER) this.stopEditing();
    },

    /**
     * Indicates that the entered value is invalid.
     * A value is valid if the input is valid and unique.
     */
    error() {
      const { editRow, editField } = this.$props.tableProperties;

      if (editField === "prefix") {
        // Check if the input is valid.
        if (!/^[a-zA-Z0-9]+$/i.test(this.input)) return true;

        const newPrefix = this.$store.getters.prefixByURI(this.input);
        const oldPrefix = this.$store.getters.prefixByURI(editRow);

        // Check if the prefix is unique.
        if (newPrefix) return newPrefix !== oldPrefix;
      } else if (editField === "uri") {
        // Check if the input is valid.
        if (!"/#".includes(this.input.slice(-1))) return true;

        // Check if the uri is unique.
        const newPrefix = this.$store.getters.uriByPrefix(this.input);
        if (newPrefix) return newPrefix !== editRow;
      }

      return false; // Default: no errors.
    },

    /**
     * Update the base URI to the URI corresponding to the given prefix.
     */
    updateBaseUri(target, prefix) {
      const { namespaces, uriByPrefix } = this.$store.getters;
      const uri = namespaces[prefix];
      const { baseURI } = this.$store.state.mConfig;
      const currentPrefix = uriByPrefix(this.currentBaseURI);

      if (uri === baseURI) {
        // Uncheck the prefix if it was previously checked.
        target.checked = false;
      } else {
        target.checked = true;
        if (currentPrefix && currentPrefix !== "") {
          // Uncheck the old one.
          this.checked[currentPrefix] = false;
          document.getElementById(currentPrefix).children[0].checked = false;
        }
      }
      this.$store.commit("setBaseUri", { uri: uri === baseURI ? "" : uri });
    },

    /**
     * Are we editing the given field in the given row?
     * @returns {boolean} `true` if we are currently editing the given field in the given row.
     */
    editingThis(uri, field) {
      return (
        this.$props.tableProperties.editRow === uri &&
        this.$props.tableProperties.editField === field
      );
    },

    /**
     * Start editing the given row.
     * @param {string} row the prefix of the row we want to edit.
     * @param {string} field the name of the field we want to edit.
     * @param {string} currentValue the current value we want to edit.
     */
    startEditing(row, field, currentValue) {
      this.$store.commit("startEditingNamespace", {
        editRow: row,
        editField: field
      });
      /* Set the initial value. */
      this.input = currentValue;
      /* Add the input field in the right place. */
      document.getElementById(row + field).appendChild(this.$refs.form);
      /* Focus on the input field so the user can start typing immediately. */
      this.$refs.inputField.focus();
    },

    /**
     * Stop editing the current row.
     * Set the value of the given row and field to the entered data.
     */
    stopEditing() {
      const { editRow, editField } = this.$props.tableProperties;
      /* Check if the input is valid. */
      if (this.error()) {
        this.$store.commit("clearTableEdit");
      } else {
        /* Update the internal checked value. */
        this.checked[this.input] = this.checked[editRow];
        Vue.delete(this.checked, editRow);
        this.$store.dispatch("stopEditingNamespace", { input: this.input });
      }
      /* Remove the input field from the table. */
      const cell = document.getElementById(editRow + editField);
      if (cell && this.$refs.form) cell.removeChild(this.$refs.form);
    },

    /**
     * Delete the element with the given prefix from the table.
     * @param {string} prefix the prefix we want to remove.
     */
    deleteElement(prefix) {
      this.$store.commit("deletePrefix", { prefix });
    },

    /**
     * Check if the given prefix is the current base URI.
     * @param {string} prefix the prefix of the namespace we want to check.
     * @returns {boolean} `true` if the corresponding URI of the given prefix is the current base URI.
     */
    isBaseURI(prefix) {
      const { baseURI, prefixByURI } = this.$store.getters;
      return baseURI === prefixByURI(prefix);
    },

    /**
     * Get the full URI for the given prefix.
     * @param {string} prefix the prefix we want to get the URI from.
     * @returns {string} the URI associated to the given prefix.
     */
    getURI(prefix) {
      const { namespaces } = this.$store.getters;
      return namespaces[prefix];
    }
  }
};
</script>

<style scoped>
.table {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
}

.table-body {
  height: 35vh;
  min-height: 20vh;
  max-height: 35vh;
  overflow: auto;
}

.clickable {
  cursor: pointer;
}

.unclickable {
  cursor: default;
}
</style>
