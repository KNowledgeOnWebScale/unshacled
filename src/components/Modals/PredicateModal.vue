<template>
  <sui-modal v-model="$store.state.mShape.mConstraint.predicateModal.show">
    <sui-modal-header>
      {{ $props.modalProperties.editing ? "Edit Predicate" : "Add Predicate" }}
    </sui-modal-header>
    <sui-modal-content @submit.prevent="confirmNodeShape">
      <sui-form>
        <sui-form-field>
          <label for="selectCategory">Category</label>
          <select
            v-if="categories"
            id="selectCategory"
            v-model="values.category"
            :disabled="$props.modalProperties.editing"
            @change="values.predicate = ''"
          >
            <option v-for="c in categories" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </sui-form-field>

        <sui-form-field v-if="values.category">
          <label for="selectPreds">Predicate</label>
          <select
            id="selectPreds"
            v-model="values.predicate"
            :disabled="$props.modalProperties.editing"
            @change="selectObject"
          >
            <option v-for="p in predicates" :key="p" :value="p">
              {{ p }}
            </option>
          </select>
        </sui-form-field>

        <sui-form-field v-if="values.predicate" class="field">
          <label>Value</label>
          <input v-if="showString()" v-model="values.input" type="text" />
          <input v-if="showCheckbox()" v-model="values.input" type="checkbox" />
          <input v-if="showInteger()" v-model="values.input" type="number" />
          <input v-if="showShapes()" v-model="values.input" list="shapeList" />

          <datalist v-if="showShapes()" id="shapeList" type="text">
            <option
              v-for="key in getShapeOptions()"
              :key="getOptionID(key)"
              :value="getOptionID(key)"
            ></option>
          </datalist>

          <input v-if="showPaths()" v-model="values.input" list="pathList" />
          <datalist v-if="showPaths()" id="pathList" type="text">
            <option v-for="key in getPathOptions()" :key="key" :value="key">
              {{ getName(key) }}
            </option>
          </datalist>

          <select v-if="showDataTypes" v-model="values.input">
            <option v-for="key in getDataTypes()" :key="key" :value="key">
              {{ getName(key) }}
            </option>
          </select>

          <input v-if="showOther()" v-model="values.input" />
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
import { isUrl, urlToName } from "../../parsing/urlParser";
import { TERM } from "../../translation/terminology";
import { SCHEMA_URL, XML_DATATYPES } from "../../util/constants";

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
        const byCategory = customConstraintsByCategory()[this.values.category];
        if (preds)
          preds.forEach(pred => {
            if (byCategory.includes(pred)) {
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
        constraintType
      };
      console.log(JSON.stringify(this.values, null, 2));
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
      return this.values.category === "Property Pair Constraints";
    },
    showDataTypes() {
      return urlToName(this.values.predicate).includes("datatype");
    },
    showShapes() {
      const possibilities = ["Property", "PropertyShape", "NodeShape", "Shape"];
      return (
        !this.showPaths() &&
        (possibilities.includes(this.values.constraintType) ||
          this.values.predicate === "property")
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
        this.values.object = this.$store.getters.objects(
          this.predicateUrl()
        )[0];
        const typeUrl = getConstraintValueType(this.predicateUrl());
        if (typeUrl) this.values.constraintType = urlToName(typeUrl);
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
          this.values.input = `${SCHEMA_URL}${this.values.input}`;
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
      if (ct.includes("property")) return this.$store.getters.propertyShapes;
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
      const thisPath =
        propertyShapes[this.$props.modalProperties.shapeID][TERM.path];

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
