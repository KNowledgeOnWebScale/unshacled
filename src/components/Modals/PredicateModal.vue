<template>
  <sui-modal v-model="$store.state.mShape.mConstraint.predicateModal.show">
    <sui-modal-header>
      {{ $props.modalProperties.editing ? "Edit Predicate" : "Add Predicate" }}
    </sui-modal-header>
    <sui-modal-content @submit.prevent="toggleModal">
      <sui-form>
        <sui-form-field>
          <label for="selectPreds">Predicate</label>
          <input
            id="selectPreds"
            v-model="values.predicate"
            class="ui fluid search dropdown"
            list="predicates"
            :disabled="$props.modalProperties.editing"
            @input="selectObject"
          />
          <sui-label
            v-if="
              values.predicate !== '' && !$store.getters.objects(predicateUrl())
            "
            basic
            pointing
            color="red"
          >
            Please enter a valid predicate
          </sui-label>
          <datalist id="predicates">
            <option v-for="p in predicates" :key="p" :value="p">{{ p }}</option>
          </datalist>
        </sui-form-field>

        <sui-form-field>
          <label for="selectCategory">Category</label>
          <select
            v-if="categories"
            id="selectCategory"
            v-model="values.category"
            :disabled="$props.modalProperties.editing"
            @change="values.predicate = ''"
          >
            <option :value="''">All categories</option>
            <option v-for="c in categories" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </sui-form-field>

        <sui-form-field
          v-if="$store.getters.objects(predicateUrl())"
          class="field"
        >
          <label>Value</label>
          <input
            v-if="showString()"
            v-model="values.inputWithoutUrl"
            type="text"
          />
          <input
            v-if="showCheckbox()"
            v-model="values.inputBool"
            type="checkbox"
          />
          <input v-if="showInteger()" v-model="values.input" type="number" />

          <input v-if="showShapes()" v-model="values.input" list="shapeList" />
          <datalist v-if="showShapes()" id="shapeList" type="text">
            <option
              v-for="key in getShapeOptions()"
              :key="getOptionID(key)"
              :value="getOptionID(key)"
            ></option>
          </datalist>

          <input
            v-if="showPaths()"
            v-model="values.inputWithoutUrl"
            list="pathList"
          />
          <datalist v-if="showPaths()" id="pathList" type="text">
            <option v-for="key in getPathOptions()" :key="key" :value="key">
              {{ getName(key) }}
            </option>
          </datalist>

          <select v-if="showDataTypes()" v-model="values.input">
            <option v-for="key in getDataTypes()" :key="key" :value="key">
              {{ getName(key) }}
            </option>
          </select>

          <input v-if="showOther()" v-model="values.inputWithoutUrl" />
        </sui-form-field>
      </sui-form>

      <sui-segment v-if="error" color="red">
        Some constraints aren't supported yet by the internal model.
      </sui-segment>
    </sui-modal-content>
    <sui-modal-actions>
      <sui-button @click="toggleModal">Cancel</sui-button>
      <sui-button positive @click="exit">
        {{ $props.modalProperties.editing ? "Confirm" : "Add" }}
      </sui-button>
    </sui-modal-actions>
  </sui-modal>
</template>

<script>
import Vue from "vue";
import ValueType from "../../util/enums/ValueType";
import {
  constraintsByTypes,
  customConstraintsByCategory,
  getConstraintValueType
} from "../../util/shaclConstraints";
import { extractUrl, isUrl, urlToName } from "../../util/urlParser";
import { TERM } from "../../translation/terminology";
import { SCHEMA_URI, XML_DATATYPES } from "../../util/constants";

export default {
  name: "PredicateModal",
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
        constraintType: ""
      },
      error: false
    };
  },
  computed: {
    categories() {
      return Object.keys(constraintsByTypes);
    },

    predicates() {
      const predsWithoutUrl = [];

      if (this.$props.modalProperties.shapeType) {
        const preds = this.$store.getters.predicates(
          this.$props.modalProperties.shapeType
        );
        const iter =
          this.values.category === ""
            ? Object.values(customConstraintsByCategory()).flat()
            : customConstraintsByCategory()[this.values.category];

        if (preds)
          preds.forEach(pred => {
            if (iter.includes(pred)) {
              const value = pred.split("#")[1];
              Vue.set(this.values.urls, value, pred.split("#")[0]);
              predsWithoutUrl.push(value);
            }
          });
      }
      return predsWithoutUrl;
    }
  },
  mounted() {
    /*
    The reason this watch is implemented is that this modal cannot work with `v-model="$props.something`.
    A component should not edit his properties directly, since a re-render in the parent component causes them
    to update (and override) their values. That's why this component keeps a copy of his properties, which he actually
    can modify directly. With every update of his properties (in `mConstraint.predicateModal`), he copies these values
    to his own state.
     */
    const self = this;
    this.$store.watch(
      () => self.$store.state.mShape.mConstraint.predicateModal,
      () => self.updateValues()
    );
  },
  methods: {
    /**
     * Get the values passed on by the parent.
     */
    updateValues() {
      const {
        category,
        predicate,
        input,
        constraintType
      } = this.$props.modalProperties;

      this.values = {
        ...this.values,
        category,
        predicate,
        input,
        inputBool: input === "true",
        inputWithoutUrl: urlToName(input),
        constraintType
      };
    },

    /**
     * Toggle the visibility of the modal.
     */
    toggleModal() {
      this.reset(); // Reset modal values
      this.$store.commit("togglePredicateModal");
    },

    /**
     * Select the given predicate.
     */
    predicateUrl() {
      const { urls, predicate } = this.values;
      return `${urls[predicate]}#${predicate}`;
    },

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
        (possibilities.includes(this.values.constraintType) ||
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

    /**
     * Select the object given the selected predicate, assuming that there's only one possible object.
     */
    selectObject() {
      // Reset the constraintType and input values.
      this.values = {
        ...this.values,
        input: "",
        constraintType: ""
      };

      if (this.values.predicate) {
        const object = this.$store.getters.objects(this.predicateUrl());
        if (object) {
          this.values.object = object[0];
          const typeUrl = getConstraintValueType(this.predicateUrl());
          if (typeUrl) this.values.constraintType = urlToName(typeUrl);
        } else {
          this.values.object = "";
        }
      } else {
        this.values.object = "";
      }
    },

    exit() {
      const predicate = this.predicateUrl();
      const valueType = ValueType(predicate);
      this.error = valueType === undefined;

      // Add the `schema` url to the path input if necessary.
      if (this.values.category.includes("Property Pair")) {
        if (!isUrl(this.values.input))
          this.values.input = `${SCHEMA_URI}${this.values.input}`;
      }

      if (this.showCheckbox()) {
        // Set the input to the value of the checkbox, as a string.
        this.values.input = this.values.inputBool.toString();
      } else if (this.showString() || this.showPaths() || this.showOther()) {
        // Add the base URL back to the input.
        const url = extractUrl(this.values.input);
        this.values.input = `${url}${urlToName(this.values.inputWithoutUrl)}`;
      }

      if (!this.error) {
        this.$store.dispatch(this.$props.modalProperties.onExit, {
          predicate,
          valueType,
          shapeID: this.$props.modalProperties.shapeID,
          input: this.values.input,
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
        constraintType: ""
      };
      this.error = false;
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
      return urlToName(key);
    },

    /**
     * Get the possible XML datatypes.
     * Used in the HTML since `XML_DATATYPES` cannot be used directly.
     * @returns {*[]}
     */
    getDataTypes() {
      return XML_DATATYPES;
    }
  }
};
</script>

<style scoped></style>
