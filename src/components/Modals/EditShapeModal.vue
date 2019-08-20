<template>
  <div>
    <sui-modal v-model="this.$store.state.mShape.shapeModal.show">
      <sui-modal-header>
        Edit Shape
      </sui-modal-header>
      <sui-modal-content @submit.prevent="cancel">
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
            <label for="label">Label</label>
            <input id="label" v-model="values.label" />
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
  RDFS_URI,
  XML_DATATYPES
} from "../../util/constants";
import { ValueTypes } from "../../util/enums/ValueType";

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
        label: ""
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
    confirm() {
      const oldID = this.$props.modalProperties.id;
      const newID = this.values.id;
      const op = this.$props.modalProperties.nodeShape
        ? "editNodeShape"
        : "editPropertyShape";
      // Update the shape ID.
      this.$store.dispatch(op, {
        index: this.$store.getters.indexWithID(oldID),
        oldID,
        newID,
        newLabel: this.values.label
      });

      // Check if the user has filled in a label.
      const { label } = this.values;
      if (label && label !== "") {
        // Update or add the label accordingly.
        const shape = this.$store.getters.shapeWithID(newID);
        if (shape[LABEL]) {
          // Update the value of the existing label constraint.
          this.$store.dispatch("updateConstraint", {
            shapeID: newID,
            constraintID: LABEL,
            newValue: [{ "@type": XML_DATATYPES.string, "@value": label }]
          });
        } else {
          // Add the label predicate to the shape.
          this.$store.dispatch("addPredicate", {
            shapeID: newID,
            predicate: LABEL,
            valueType: ValueTypes.VALUE,
            input: label,
            object: XML_DATATYPES.string
          });
        }
      } else {
        // Delete the label.
        this.$store.dispatch("deleteConstraintFromShapeWithID", {
          shapeID: newID,
          constraintID: LABEL
        });
      }
      this.$store.commit("toggleEditShapeModal");
    },
    cancel() {
      this.$store.commit("toggleEditShapeModal");
    },
    updateValues() {
      const { id, label } = this.$store.state.mShape.shapeModal;
      this.values = { id, label };
    },
    error() {
      return !(
        IRI_REGEX.test(this.values.id) || BLANK_REGEX.test(this.values.id)
      );
    },
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
