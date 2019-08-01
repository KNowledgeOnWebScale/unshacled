<template>
  <sui-modal v-model="this.$store.state.predicateModal.show">
    <sui-modal-header> Add Predicate</sui-modal-header>
    <sui-modal-content @submit.prevent="confirmNodeShape">
      <sui-form>
        <sui-form-field>
          <label for="selectCategory">Category</label>
          <select
            v-if="categories"
            id="selectCategory"
            v-model="category"
            @change="predicate = ''"
          >
            <option v-for="c in categories" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </sui-form-field>

        <sui-form-field v-if="category">
          <label for="selectPreds">Predicate</label>
          <select id="selectPreds" v-model="predicate" @change="selectObject()">
            <option v-for="p in predicates" :key="p" :value="p">
              {{ p }}
            </option>
          </select>
        </sui-form-field>

        <sui-form-field v-if="predicate" class="field">
          <label for="valueInput">Value</label>
          <input id="valueInput" v-model="input" list="datalist" />
          <datalist v-if="predicate === 'property'" id="datalist" type="text">
            <option
              v-for="key in getOptions()"
              :key="getOptionID(key)"
              :value="getOptionID(key)"
            ></option>
          </datalist>
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
  customConstraintsByType
} from "../../util/shaclConstraints";

export default {
  name: "AddPredicateModal",
  props: ["type", "id"],
  data() {
    return {
      category: "",
      predicate: "",
      urls: {},
      input: "",
      object: "",
      error: false
    };
  },
  computed: {
    categories() {
      return Object.keys(constraintsByTypes);
    },

    predicates() {
      const predsWithoutUrl = [];

      if (this.type) {
        const preds = this.$store.getters.predicates(this.type);
        const byCategory = customConstraintsByType()[this.category];
        if (preds)
          preds.forEach(pred => {
            if (byCategory.indexOf(pred) !== -1) {
              const value = pred.split("#")[1];
              Vue.set(this.urls, value, pred.split("#")[0]);
              predsWithoutUrl.push(value);
            }
          });
      }
      return predsWithoutUrl;
    }
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
      return `${this.urls[this.predicate]}#${this.predicate}`;
    },

    /**
     * Select the object given the selected predicate, assuming that there's only one possible object.
     */
    selectObject() {
      this.object = this.$store.getters.objects(this.predicateUrl())[0];
    },

    /**
     * Add the predicate that's been filled out in the modal.
     */
    addPredicate() {
      const predicate = this.predicateUrl();
      const valueType = ValueType(predicate);
      this.error = valueType === undefined;

      const args = {
        predicate,
        valueType,
        shapeID: this.id,
        input: this.input,
        object: this.object
      };

      if (!this.error) {
        this.$store.dispatch("addPredicate", args);
        this.reset();
      }
    },

    /**
     * Reset the data from the modal.
     */
    reset() {
      this.category = "";
      this.predicate = "";
      this.urls = {};
      this.input = "";
      this.object = "";
      this.error = false;
    },

    /**
     * Get the possible options for the datalist object.
     * @returns {getters.propertyShapes}
     */
    getOptions() {
      return this.$store.getters.propertyShapes;
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
