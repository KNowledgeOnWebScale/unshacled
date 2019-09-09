<template>
  <div>
    <sui-modal v-model="$store.state.pathModal.show">
      <sui-modal-header>
        {{ $props.editing ? "Edit" : "New" }} Property Shape
      </sui-modal-header>
      <sui-modal-content>
        <sui-form @submit.prevent="error">
          <sui-form-field>
            <label for="path">Path</label>
            <input id="path" v-model="path" @keyup="handleKeyPress" />
            <sui-label v-if="path !== '' && error()" basic pointing color="red">
              Please enter a valid IRI
            </sui-label>
          </sui-form-field>
        </sui-form>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button @click="cancel">Cancel</sui-button>
        <sui-button
          positive
          :disabled="path === '' || error()"
          @click="confirm"
        >
          Confirm
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import { ENTER, IRI_REGEX } from "../../util/constants";
import { TERM } from "../../translation/terminology";
import ValueType from "../../util/enums/ValueType";
import { prefixToUri } from "../../util/urlParser";

export default {
  name: "PathModal",
  props: {
    editing: {
      type: Boolean,
      required: true
    },
    shapeID: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      path: ""
    };
  },
  mounted() {
    // Update the path value if the modal is called to edit.
    const self = this;
    this.$store.watch(
      () => self.$store.state.pathModal.editing,
      () => {
        if (self.$store.state.pathModal.editing) {
          const shape = self.$store.getters.shapeWithID(self.$props.shapeID);
          self.path = shape[TERM.path][0]["@id"];
        }
      }
    );

    // Focus the input field when the modal is called.
    this.$store.watch(
      () => self.$store.state.pathModal.show,
      () => {
        if (self.$store.state.pathModal.show)
          document.getElementById("path").focus();
      }
    );
  },
  methods: {
    /**
     * Confirm on enter press.
     * @param e key press event
     */
    handleKeyPress(e) {
      if (e.keyCode === ENTER) this.confirm();
    },

    /**
     * Cancel the modal.
     */
    cancel() {
      this.$store.commit("togglePathModal", {});
      this.path = "";
    },

    /**
     * Check if the entered value is valid and confirm the modal if so.
     * Otherwise, show an error message.
     */
    confirm() {
      if (!this.error()) {
        if (this.$props.editing) {
          // Edit the path.
          const { shapeID } = this.$props;
          const p = TERM.path;
          this.$store.dispatch("stopConstraintEdit", {
            shapeID,
            predicate: p,
            object: this.$store.getters.objects(p)[0],
            valueType: ValueType(p),
            input: prefixToUri(this.$store.state.mConfig.namespaces, this.path)
          });
        } else {
          // Create a new property shape.
          this.$store.dispatch("addPropertyShape", {
            path: this.path
          });
        }
        this.$store.commit("togglePathModal", {});
        this.path = "";
      }
    },

    /**
     * Check if the entered values passes the regex test.
     * @returns {boolean} value that indicates if the entered value is not valid.
     */
    error() {
      return !IRI_REGEX.test(this.path);
    }
  }
};
</script>

<style scoped></style>
