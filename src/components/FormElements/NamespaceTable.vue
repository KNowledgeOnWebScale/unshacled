<template>
  <div id="namespaceTable">
    <div ref="form" class="ui transparent form">
      <sui-form-field>
        <sui-input
          ref="inputField"
          v-model="input"
          :focus="$props.tableProperties.editRow !== ''"
          :error="error()"
          @input="
            e => {
              input = e;
            }
          "
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
                <sui-table-header-cell class="prefix">
                  Prefix
                </sui-table-header-cell>
                <sui-table-header-cell class="uri">
                  URI
                </sui-table-header-cell>
                <sui-table-header-cell class="delete"></sui-table-header-cell>
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
                  <sui-table-cell class="prefix">
                    <div :id="prefix + 'prefix'"></div>
                    <div
                      v-if="!editingThis(prefix, 'prefix')"
                      @click="startEditing(prefix, 'prefix', prefix)"
                    >
                      {{ prefix }}
                    </div>
                  </sui-table-cell>

                  <sui-table-cell class="uri">
                    <div :id="prefix + 'uri'"></div>
                    <div
                      v-if="!editingThis(prefix, 'uri')"
                      @click="startEditing(prefix, 'uri', uri)"
                    >
                      {{ uri }}
                    </div>
                  </sui-table-cell>

                  <sui-table-cell class="delete" @click="deleteElement(prefix)">
                    <sui-icon name="x icon"></sui-icon>
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
import namespaces from "../../config/config";
import { ENTER } from "../../util/constants";
import { swapKeyValue } from "../../util";

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
      input: ""
    };
  },
  mounted() {
    // Remove the input field from the top of the table.
    document.getElementById("namespaceTable").removeChild(this.$refs.form);
    // Scroll to the top of the table.
    const body = document.getElementById("table-body");
    body.scrollTop = 0;

    // Stop editing when the modal is being closed.
    const self = this;
    this.$store.watch(
      () => self.$store.state.mConfig.namespaceModal.show,
      () => {
        const { editRow, editField } = self.$props.tableProperties;
        if (editRow !== "" && editField !== "") self.stopEditing();
      }
    );
  },
  methods: {
    /**
     * Stop editing when the enter key is pressed.
     */
    handleKeyUp(e) {
      if (e.keyCode === ENTER) this.stopEditing();
    },

    /**
     * Indicates that the entered value is invalid.
     */
    error() {
      const { editRow, editField } = this.$props.tableProperties;

      if (editField === "prefix") {
        // Check if the input is valid.
        if (/^[a-zA-Z0-9]+$/i.test(this.input)) return false;

        // Check if the prefix is unique.
        if (namespaces[this.input]) {
          console.log(namespaces[this.input], "\n", namespaces[editRow]);
          return namespaces[this.input] !== namespaces[editRow];
        } else {
          return false;
        }
      } else if (editField === "uri") {
        // Check if the input is valid.
        if (!"/#".includes(this.input.slice(-1))) return true;

        // Check if the uri is unique.
        const swap = swapKeyValue(namespaces);

        if (swap[this.input]) {
          console.log(swap[this.input], "\n", swap[namespaces[editRow]]);
          return swap[this.input] !== swap[namespaces[editRow]];
        } else {
          return false;
        }
      }

      return false;
    },

    /**
     * Are we editing the given field in the given row?
     * @returns {boolean}
     */
    editingThis(uri, field) {
      return (
        this.$props.tableProperties.editRow === uri &&
        this.$props.tableProperties.editField === field
      );
    },

    /**
     * Start editing the given row.
     * @param row {string} the prefix of the row we want to edit.
     * @param field {string} the name of the field we want to edit.
     * @param currentValue {string} the current value we want to edit.
     */
    startEditing(row, field, currentValue) {
      this.$store.commit("startEditingNamespace", {
        editRow: row,
        editField: field
      });
      this.input = currentValue;
      document.getElementById(row + field).appendChild(this.$refs.form);
    },

    /**
     * Stop editing the current row.
     * Set the value of the given row and field to the entered data.
     */
    stopEditing() {
      console.log("stopEditing");
      const { editRow, editField } = this.$props.tableProperties;
      // Check if the input is valid.
      if (!this.error()) {
        this.$store.dispatch("stopEditingNamespace", { input: this.input });
      }
      // Remove the input field from the table.
      const cell = document.getElementById(editRow + editField);
      if (cell) cell.removeChild(this.$refs.form);
    },

    /**
     * Delete the element with the given prefix from the table.
     * @param prefix
     */
    deleteElement(prefix) {
      console.log("deleteElement");
      this.$store.commit("deletePrefix", { prefix });
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

.fill {
  width: 50%;
}
.prefix {
  width: 20%;
}
.uri {
  width: 75%;
}
.delete {
  width: 5%;
  cursor: pointer;
}
</style>
