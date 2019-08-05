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
            v-model="myCategory"
            @change="myPredicate = ''"
          >
            <option v-for="c in categories" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </sui-form-field>

        <sui-form-field v-if="myCategory">
          <label for="selectPreds">Predicate</label>
          <select
            id="selectPreds"
            v-model="myPredicate"
            @change="selectObject()"
          >
            <option v-for="p in predicates" :key="p" :value="p">
              {{ p }}
            </option>
          </select>
        </sui-form-field>

        <sui-form-field v-if="myPredicate" class="field">
          <label>Value</label>
          <input v-if="showString()" v-model="myInput" type="text" />
          <input v-if="showCheckbox()" v-model="myInput" type="checkbox" />
          <input v-if="showInteger()" v-model="myInput" type="number" />
          <input v-if="showShapes()" v-model="myInput" list="datalist" />
          <datalist v-if="showShapes()" id="datalist" type="text">
            <option
              v-for="key in getOptions()"
              :key="getOptionID(key)"
              :value="getOptionID(key)"
            ></option>
          </datalist>
          <input v-if="showOther()" v-model="myInput" />
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
    shapeType: {
      type: String || null,
      required: true
    },
    shapeID: {
      type: String || null,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    predicate: {
      type: String,
      required: true
    },
    urls: {
      type: Object,
      required: true
    },
    input: {
      type: String,
      required: true
    },
    object: {
      type: String,
      required: true
    },
    constraintType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      myCategory: "",
      myPredicate: "",
      myUrls: {},
      myInput: "",
      myObject: "",
      myConstraintType: "",
      error: false
    };
  },
  computed: {
    categories() {
      return Object.keys(constraintsByTypes);
    },

    predicates() {
      const predsWithoutUrl = [];

      if (this.shapeType) {
        const preds = this.$store.getters.predicates(this.shapeType);
        const byCategory = customConstraintsByCategory()[this.myCategory];
        if (preds)
          preds.forEach(pred => {
            if (byCategory.includes(pred)) {
              const value = pred.split("#")[1];
              Vue.set(this.myUrls, value, pred.split("#")[0]);
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
      () => self.$store.state.mShape.mConstraint.predicateModal.show,
      () => self.updateValues()
    );
  },
  methods: {
    /**
     * TODO
     */
    updateValues() {
      this.myCategory = this.$props.category;
      this.myPredicate = this.$props.predicate;
      this.myUrls = this.$props.urls;
      this.myInput = this.$props.input;
      this.myObject = this.$props.object;
      this.myConstraintType = this.$props.constraintType;
      // console.log(JSON.stringify(this.$props, null, 2));
      // console.log(
      //   JSON.stringify(
      //     this.$store.state.mShape.mConstraint.predicateModal,
      //     null,
      //     2
      //   )
      // );
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
      const { myUrls, myPredicate } = this;
      return `${myUrls[myPredicate]}#${myPredicate}`;
    },

    showCheckbox() {
      return this.myConstraintType === "boolean";
    },
    showInteger() {
      return this.myConstraintType === "integer";
    },
    showString() {
      return this.myConstraintType === "string";
    },
    showShapes() {
      const possibilities = ["Property", "PropertyShape", "NodeShape", "Shape"];
      return (
        possibilities.includes(this.myConstraintType) ||
        this.myPredicate === "property"
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
      this.myConstraintType = "";
      this.myInput = "";

      if (this.myPredicate) {
        this.myObject = this.$store.getters.objects(this.predicateUrl())[0];
        const typeUrl = getConstraintValueType(this.predicateUrl());
        if (typeUrl) this.myConstraintType = urlToName(typeUrl);
      } else {
        this.myObject = "";
      }
    },

    /**
     * Add the predicate that's been filled out in the modal.
     * TODO check if this is correct, cfr @value/@id/@list n stuff
     */
    addPredicate() {
      const predicate = this.predicateUrl();
      const valueType = ValueType(predicate);
      this.error = valueType === undefined;

      const args = {
        predicate,
        valueType,
        shapeID: this.shapeID,
        input: this.myInput,
        object: this.myObject
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
      this.myCategory = "";
      this.myPredicate = "";
      this.myUrls = {};
      this.myInput = "";
      this.myObject = "";
      this.error = false;
    },

    /**
     * Get the possible options for the datalist object.
     * @returns {*}
     */
    getOptions() {
      const ct = this.myConstraintType.toLocaleLowerCase();
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
