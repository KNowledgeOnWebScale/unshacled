<template>
  <div>
    <sui-modal v-model="this.$store.state.showPathModal">
      <sui-modal-header>
        New Property Shape
      </sui-modal-header>
      <sui-modal-content>
        <sui-form>
          <sui-form-field>
            <label for="path">Path</label>
            <input id="path" v-model="path" />
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
import { iriRegex } from "../../util/constants";

export default {
  name: "PathModal",
  data() {
    return {
      uuid: require("uuid/v4"),
      path: ""
    };
  },
  methods: {
    cancel() {
      this.$store.commit("togglePathModal");
    },
    confirm() {
      if (!this.error()) {
        this.$store.dispatch("addPropertyShape", {
          id: this.uuid(),
          path: this.path
        });
        this.$store.commit("togglePathModal");
      }
    },
    error() {
      return !iriRegex.test(this.path);
    }
  }
};
</script>

<style scoped></style>
