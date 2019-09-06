<template>
  <div id="namespaceTable">
    <div ref="form" class="ui transparent form">
      <sui-form-field>
        <input
          ref="inputField"
          class="ui transparent input"
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
              </sui-table-row>
            </sui-table-header>
          </sui-table>
        </td>
      </tr>
      <tr>
        <td>
          <div class="table-body">
            <sui-table>
              <sui-table-body>
                <sui-table-row
                  v-for="(uri, prefix) of getNamespaces()"
                  :key="prefix"
                >
                  <sui-table-cell
                    class="prefix"
                    @click="startEditing(prefix, 'prefix', prefix)"
                  >
                    <div :id="prefix + 'prefix'"></div>
                    <div v-if="!editingThis(prefix, 'prefix')">
                      {{ prefix }}
                    </div>
                  </sui-table-cell>

                  <sui-table-cell
                    class="uri"
                    @click="startEditing(prefix, 'uri', uri)"
                  >
                    <div :id="prefix + 'uri'"></div>
                    <div v-if="!editingThis(prefix, 'uri')">
                      {{ uri }}
                    </div>
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
  },
  methods: {
    /**
     * Get a dictionary mapping the prefixes to their namespaces.
     * `namespaces` cannot be referenced directly in the HTML.
     * @returns {{schema, xsd, skos, tourism, rdfs, muto, ost, oslo, combust, regorg, dcterms, oh, tio, locn, prov, foaf, csvw, acco, "dbpedia-owl", adms, org, vcard, gr, ex, rdf, person, time}}
     */
    getNamespaces() {
      return namespaces;
    },

    /**
     * Stop editing when the enter key is pressed.
     */
    handleKeyUp(e) {
      if (e.keyCode === ENTER) this.stopEditing();
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
      this.$refs.inputField.value = currentValue;
      document.getElementById(row + field).appendChild(this.$refs.form);
      this.$refs.inputField.focus();
    },

    /**
     * Stop editing the current row.
     * Set the value of the given row and field to the entered data.
     */
    stopEditing() {
      const { editRow, editField } = this.$props.tableProperties;
      this.input = this.$refs.inputField.value;
      // TODO checks, input validation
      console.log("stopEditing", this.input);
      this.$store.dispatch("stopEditingNamespace", { input: this.input });
      document.getElementById(editRow + editField).removeChild(this.$refs.form);
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

.prefix {
  width: 20%;
}
.uri {
  width: 80%;
}
</style>
