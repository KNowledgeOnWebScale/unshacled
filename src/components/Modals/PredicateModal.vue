<template>
  <sui-modal v-model="$store.state.mShape.mConstraint.predicateModal.show">
    <sui-modal-header> Add Predicate</sui-modal-header>
    <sui-modal-content @submit.prevent="confirmNodeShape">
      <sui-form>
        <sui-form-field>
          <label for="selectCategory">Category</label>
          <select
            v-if="categories"
            id="selectCategory"
            v-model="values.category"
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
            @change="selectObject()"
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
          <input v-if="showShapes()" v-model="values.input" list="datalist" />
          <datalist v-if="showShapes()" id="datalist" type="text">
            <option
              v-for="key in getOptions()"
              :key="getOptionID(key)"
              :value="getOptionID(key)"
            ></option>
          </datalist>
          <input v-if="showOther()" v-model="values.input" />
        </sui-form-field>
      </sui-form>

      <sui-segment v-if="error" color="red">
        Some constraints aren't supported yet by the internal model.
      </sui-segment>
    </sui-modal-content>
    <sui-modal-actions>
      <sui-button positive @click="addPredicate">Add</sui-button>
      <sui-button negative @click="toggleModal">Cancel</sui-button>
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
import { urlToName } from "../../parsing/urlParser";

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
    // Get the values passed on by the parent.
    const { category, predicate, input, object, constraintType } = this.$props;
    this.values = {
      ...this.values,
      category,
      predicate,
      input,
      object,
      constraintType
    };
  },
  methods: {
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
      return this.values.constraintType === "boolean";
    },
    showInteger() {
      return this.values.constraintType === "integer";
    },
    showString() {
      return this.values.constraintType === "string";
    },
    showShapes() {
      const possibilities = ["Property", "PropertyShape", "NodeShape", "Shape"];
      return (
        possibilities.includes(this.values.constraintType) ||
        this.values.predicate === "property"
      );
    },
    showOther() {
      return !(
        this.showCheckbox() ||
        this.showInteger() ||
        this.showString() ||
        this.showShapes()
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

    /**
     * Add the predicate that's been filled out in the modal.
     * TODO check if this is correct, cfr @value/@id/@list n stuff
     */
    addPredicate() {
      const { input, object } = this.values;
      const predicate = this.predicateUrl();
      const valueType = ValueType(predicate);
      this.error = valueType === undefined;

      if (!this.error) {
        const args = {
          predicate,
          valueType,
          shapeID: this.$props.modalProperties.shapeID,
          input,
          object
        };

        this.$store.dispatch("addPredicate", args);
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

    /**
     * Get the possible options for the datalist object.
     * @returns {*}
     */
    getOptions() {
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
    }
  }
};
</script>

<style scoped></style>
