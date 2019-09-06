<template>
  <sui-modal v-model="$store.state.mShape.mConstraint.mModal.show">
    <sui-modal-header>
      {{ $props.modalProperties.editing ? "Edit Predicate" : "Add Predicate" }}
    </sui-modal-header>
    <sui-modal-content scrolling>
      <sui-form @submit.prevent="() => {}">
        <sui-form-field v-if="!$props.modalProperties.editing">
          <label for="search">Search</label>
          <input id="search" v-model="values.search" />
        </sui-form-field>

        <predicate-table
          :contents="table()"
          :filter="values.search"
          :selected="$props.modalProperties.selected"
          :editing="$props.modalProperties.editing"
          :sorting="$store.state.mShape.mConstraint.mModal.sorting"
        ></predicate-table>

        <br />
        <sui-form-field
          v-if="$store.getters.objects($props.modalProperties.selected)"
          class="field"
          :inline="true"
        >
          <label>Value</label>
          <input
            v-if="!showDataTypes()"
            id="field"
            v-model="values[getModel()]"
            :list="getDataList()"
            :type="getType()"
            @keyup="handleKeyPress"
          />

          <datalist v-if="showPaths()" id="pathList" :type="getType()">
            <option v-for="key in getPathOptions()" :key="key" :value="key">
              {{ getName(key) }}
            </option>
          </datalist>
          <datalist v-if="showShapes()" id="shapeList" :type="getType()">
            <option
              v-for="key in getShapeOptions()"
              :key="getOptionID(key)"
              :value="getOptionID(key)"
            ></option>
          </datalist>

          <select
            v-if="showDataTypes()"
            id="dataTypes"
            v-model="values[getModel()]"
            :type="getType()"
            @keyup="handleKeyPress"
          >
            <option v-for="key in getDataTypes()" :key="key" :value="key">
              {{ getName(key) }}
            </option>
          </select>
        </sui-form-field>
      </sui-form>

      <sui-segment v-if="error" color="red">
        Some constraints aren't supported yet by the internal model.
      </sui-segment>
    </sui-modal-content>
    <sui-modal-actions>
      <sui-button tab-index="0" @click="toggleModal">Cancel</sui-button>
      <sui-button
        tab-index="0"
        positive
        :disabled="$props.modalProperties.selected === ''"
        @click="exit"
      >
        {{ $props.modalProperties.editing ? "Confirm" : "Add" }}
      </sui-button>
    </sui-modal-actions>
  </sui-modal>
</template>

<script>
import ValueType from "../../util/enums/ValueType";
import {
  getConstraintCategory,
  getConstraintValueType,
  tableContents
} from "../../util/shacl/shaclConstraints";
import {
  extractUrl,
  isUrl,
  uriToPrefix,
  urlToName
} from "../../util/urlParser";
import { TERM } from "../../translation/terminology";
import { ENTER, SCHEMA_URI } from "../../util/constants";
import { XML_DATATYPES } from "../../util";
import PredicateTable from "../FormElements/PredicateTable.vue";

export default {
  name: "PredicateModal",
  components: { PredicateTable },
  props: {
    modalProperties: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      values: {
        urls: {},
        category: "",
        predicate: "",
        input: "",
        inputBool: false,
        object: "",
        constraintType: "",
        search: ""
      },
      error: false
    };
  },
  mounted() {
    /*
    The reason this watch is implemented is that this modal cannot work with `v-model="$props.something`.
    A component should not edit his properties directly, since a re-render in the parent component causes them
    to update (and override) their values. That's why this component keeps a copy of his properties, which he actually
    can modify directly. With every update of his properties (in `mConstraint.mModal`), he copies these values
    to his own state.
     */
    const self = this;
    this.$store.watch(
      () => self.$store.state.mShape.mConstraint.mModal.selected,
      () => {
        self.updateValues();
        const id = self.showPaths()
          ? "pathList"
          : self.showShapes()
          ? "shapeList"
          : self.showDataTypes()
          ? "dataTypes"
          : "field";
        const field = document.getElementById(id);
        if (field) field.focus();
      }
    );

    // Focus the input field when the modal is called.
    this.$store.watch(
      () => self.$store.state.mShape.mConstraint.mModal.show,
      () => {
        if (self.$store.state.mShape.mConstraint.mModal.show) {
          const field = document.getElementById("search");
          if (field) field.focus();
        }
      }
    );
  },
  methods: {
    /**
     * Get the values passed on by the parent.
     */
    updateValues() {
      const { selected, input } = this.$props.modalProperties;
      const s = selected && selected !== "";
      this.values = {
        ...this.values,
        category: s ? getConstraintCategory(selected) : "",
        predicate: selected,
        input,
        inputBool: input === "true",
        inputWithoutUrl: uriToPrefix(
          this.$store.state.mConfig.namespaces,
          input
        ),
        constraintType: s ? getConstraintValueType(selected) : ""
      };
    },

    /**
     * Toggle the visibility of the modal.
     */
    toggleModal() {
      this.$store.commit("togglePredicateModal");
      this.reset(); // Reset modal values
    },

    /**
     * Returns the contents of the table.
     * This method exists since `tableContents()` cannot be called directly from the HTML above.
     */
    table() {
      return tableContents(this.$store.state.mConfig.namespaces);
    },

    /**
     * Execute the changes.
     * Close the modal.
     */
    exit() {
      const {
        predicate,
        category,
        input,
        inputBool,
        inputWithoutUrl
      } = this.values;
      let finalInput = input;
      const valueType = ValueType(predicate);
      this.error = valueType === undefined;

      // Add the `schema` url to the path input if necessary.
      if (category.includes("Property Pair")) {
        if (!isUrl(input)) {
          finalInput = `${SCHEMA_URI}${input}`;
        }
      }

      if (this.showCheckbox()) {
        // Set the input to the value of the checkbox, as a string.
        finalInput = inputBool.toString();
      } else if (this.showString() || this.showPaths() || this.showOther()) {
        // Add the base URL back to the input.
        const url = extractUrl(input);
        finalInput = `${url}${urlToName(inputWithoutUrl)}`;
      }
      if (this.values.constraintType.includes("integer") && input === "")
        finalInput = "0";

      if (!this.error) {
        this.$store.dispatch(this.$props.modalProperties.onExit, {
          predicate,
          valueType,
          shapeID: this.$props.modalProperties.shapeID,
          input: finalInput,
          object: this.$store.getters.objects(predicate)[0]
        });
        this.reset();
      }
    },

    /**
     * Reset the data from the modal.
     */
    reset() {
      this.values = {
        urls: {},
        category: "",
        predicate: "",
        input: "",
        object: "",
        constraintType: "",
        search: ""
      };
      this.error = false;
      // Deselect the selected row.
      this.$store.commit("selectRow", { key: "" });
    },

    /* INPUT FIELD HELPERS ========================================================================================== */

    /**
     * Get the wanted model.
     */
    getModel() {
      return this.showCheckbox()
        ? "inputBool"
        : this.showString() || this.showPaths() || this.showOther()
        ? "inputWithoutUrl"
        : "input";
    },

    /**
     * Get the wanted input type.
     */
    getType() {
      return this.showCheckbox()
        ? "checkbox"
        : this.showInteger()
        ? "number"
        : "text";
    },

    /**
     * Get the wanted data list.
     */
    getDataList() {
      return this.showPaths()
        ? "pathList"
        : this.showShapes()
        ? "shapeList"
        : "";
    },

    /**
     * Confirm on enter press.
     * @param e key press event
     */
    handleKeyPress(e) {
      if (e.keyCode === ENTER) this.exit();
    },

    /* SHOW VALUE INPUT FIELD ======================================================================================= */

    showCheckbox() {
      return this.values.constraintType.includes("boolean");
    },
    showInteger() {
      return this.values.constraintType.includes("integer");
    },
    showString() {
      return this.values.constraintType.includes("string");
    },
    showPaths() {
      return this.values.category.includes("Property Pair");
    },
    showDataTypes() {
      return urlToName(this.values.predicate).includes("datatype");
    },
    showShapes() {
      const possibilities = ["Property", "PropertyShape", "NodeShape", "Shape"];
      return (
        !this.showPaths() &&
        (possibilities.includes(urlToName(this.values.constraintType)) ||
          this.values.predicate === "property" ||
          this.values.category.includes("Logical"))
      );
    },
    showOther() {
      return !(
        this.showCheckbox() ||
        this.showInteger() ||
        this.showString() ||
        this.showShapes() ||
        this.showPaths() ||
        this.showDataTypes()
      );
    },

    /* POPULATING =================================================================================================== */

    /**
     * Get the possible options for the datalist object.
     * @returns {*}
     */
    getShapeOptions() {
      const ct = this.values.constraintType.toLocaleLowerCase();
      if (ct.includes("property") || this.values.category.includes("Logical"))
        return this.$store.getters.propertyShapes;
      if (ct.includes("node")) return this.$store.getters.nodeShapes;
      if (ct.includes("shape")) return this.$store.getters.shapes;
      return [];
    },

    /**
     * Get the ID of the given option.
     * @param key
     * @returns {*}
     */
    getOptionID(key) {
      return key["@id"];
    },

    /**
     * Get the different options for choosing an existing path.
     * The path of the current shape is not an option.
     * @returns {[]}
     */
    getPathOptions() {
      const { propertyShapes } = this.$store.getters;
      const pShape = propertyShapes[this.$props.modalProperties.shapeID];

      let thisPath;
      if (pShape) thisPath = pShape[TERM.path];

      const paths = [];
      for (const ps in propertyShapes) {
        const path = propertyShapes[ps][TERM.path];
        if (
          path && // Check if the shape has a path.
          (!thisPath || (thisPath && thisPath[0]["@id"] !== path[0]["@id"])) // Do not include the shape itself.
        ) {
          paths.push(path[0]["@id"]);
        }
      }
      return paths;
    },

    /**
     * Get the name of the path from the given url.
     * Used in the HTML since `urlToName` cannot be used directly.
     * @param key
     * @returns {*}
     */
    getName(key) {
      return uriToPrefix(this.$store.state.mConfig.namespaces, key);
    },

    /**
     * Get the possible XML datatypes.
     * Used in the HTML since `XML_DATATYPES` cannot be used directly.
     * @returns {*[]}
     */
    getDataTypes() {
      return Object.values(XML_DATATYPES);
    }
  }
};
</script>

<style scoped></style>
