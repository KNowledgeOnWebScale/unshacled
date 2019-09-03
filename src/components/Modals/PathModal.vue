<template>
  <div>
    <sui-modal v-model="$store.state.showPathModal">
      <sui-modal-header>
        New Property Shape
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
import { IRI_REGEX } from "../../util/constants";

export default {
  name: "PathModal",
  data() {
    return {
      uuid: require("uuid/v4"),
      path: ""
    };
  },
  methods: {
    /**
     * Confirm on enter press.
     * @param e key press event
     */
    handleKeyPress(e) {
      if (e.keyCode === 13) this.confirm();
    },

    /**
     * Cancel the modal.
     */
    cancel() {
      this.$store.commit("togglePathModal");
    },

    /**
     * Check if the entered value is valid and confirm the modal if so.
     * Otherwise, show an error message.
     */
    confirm() {
      if (!this.error()) {
        this.$store.dispatch("addPropertyShape", {
          id: this.uuid(),
          path: this.path
        });
        this.$store.commit("togglePathModal");
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
