<template>
  <div>
    <sui-modal
      v-model="this.$store.state.mShape.shapeModal.show"
      @submit.prevent="cancel"
    >
      <sui-modal-header>
        Edit Shape
      </sui-modal-header>
      <sui-modal-content>
        <sui-form>
          <sui-form-field>
            <label for="id">IRI</label>
            <input id="id" v-model="values.id" />
            <sui-label
              v-if="values.id !== '' && error()"
              basic
              pointing
              color="red"
            >
              Please enter a valid IRI
            </sui-label>
            <sui-label
              v-if="values.id !== '' && !unique()"
              basic
              pointing
              color="red"
            >
              Please enter a unique IRI
            </sui-label>
          </sui-form-field>
          <sui-form-field>
            <label v-if="this.$props.modalProperties.nodeShape" for="label">
              <!-- A node shape has a label. -->
              Label
            </label>
            <label v-if="!this.$props.modalProperties.nodeShape" for="label">
              <!-- A property shape has a name. -->
              Name
            </label>
            <input id="label" v-model="values.label" />
          </sui-form-field>
          <sui-form-field>
            <label for="description">Description</label>
            <input id="description" v-model="values.description" />
          </sui-form-field>
        </sui-form>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button @click="cancel">Cancel</sui-button>
        <sui-button positive :disabled="error()" @click="confirm">
          Confirm
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import {
  BLANK_REGEX,
  IRI_REGEX,
  LABEL,
  XML_DATATYPES
} from "../../util/constants";
import getValueType from "../../util/enums/ValueType";
import { TERM } from "../../translation/terminology";

export default {
  name: "EditShapeModal",
  props: {
    modalProperties: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      values: {
        id: "",
        label: "",
        description: ""
      }
    };
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
      () => self.$store.state.mShape.shapeModal,
      () => self.updateValues()
    );
  },
  methods: {
    /**
     * Confirm the modal.
     * Update the shape ID, name/label and description accordingly.
     */
    confirm() {
      const { id, label, description } = this.values;
      const modProps = this.$props.modalProperties;

      // Close the modal.
      this.$store.commit("toggleEditShapeModal");

      // Update the shape ID.
      const op = modProps.nodeShape ? "editNodeShape" : "editPropertyShape";
      this.$store.dispatch(op, {
        oldID: modProps.id,
        newID: id
      });
      // Update the shape label/name and description.
      this.handleConstraint(modProps.nodeShape ? TERM.name : LABEL, label);
      this.handleConstraint(TERM.description, description);
    },

    /**
     * Handle the update of the given constraint.
     * @param constraintID the key of the constraint.
     * @param value the value of the constraint.
     */
    handleConstraint(constraintID, value) {
      const shapeID = this.values.id;

      // Check if the user has filled in a value.
      if (value && value !== "") {
        const shape = this.$store.getters.shapeWithID(shapeID);

        // Update or add the value accordingly.
        if (shape[constraintID]) {
          // Update the value of the existing constraint.
          this.$store.dispatch("updateConstraint", {
            shapeID,
            constraintID,
            newValue: [{ "@type": XML_DATATYPES.string, "@value": value }]
          });
        } else {
          // Add the predicate to the shape.
          this.$store.dispatch("addPredicate", {
            shapeID,
            predicate: constraintID,
            valueType: getValueType(constraintID),
            input: value,
            object: XML_DATATYPES.string
          });
        }
      } else {
        // Delete the value.
        this.$store.dispatch("deleteConstraintFromShapeWithID", {
          shapeID,
          constraintID
        });
      }
    },

    /**
     * Cancel and close the modal.
     */
    cancel() {
      this.$store.commit("toggleEditShapeModal");
    },

    /**
     * Update the data values using the properties.
     */
    updateValues() {
      const { id, label, description } = this.$props.modalProperties;
      this.values = { id, label, description };
    },

    /**
     * @returns {boolean} value to indicate the validity of the entered date.
     */
    error() {
      return !(
        IRI_REGEX.test(this.values.id) || BLANK_REGEX.test(this.values.id)
      );
    },

    /**
     * @returns {boolean} value to indicate if the entered id is unique.
     */
    unique() {
      return (
        this.values.id === this.$props.modalProperties.id ||
        !Object.keys(this.$store.getters.shapes).includes(this.values.id)
      );
    }
  }
};
</script>

<style scoped></style>
