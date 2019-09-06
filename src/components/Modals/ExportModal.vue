<template>
  <div>
    <sui-modal v-model="$store.state.showExportModal">
      <sui-modal-header>
        Export Shapes as {{ $store.state.exportType }}
      </sui-modal-header>
      <sui-modal-content>
        <sui-form @submit.prevent="confirm">
          <sui-form-field inline>
            <label>Filename</label>
            <input v-model="filename" @keyup="handleKeyPress" id="filename" />
            .
            <select
              v-model="extension"
              class="field ui fluid dropdown"
              @keyup="handleKeyPress"
            >
              <option>json</option>
              <option>ttl</option>
            </select>
          </sui-form-field>
        </sui-form>

        <sui-segment v-if="error" color="red">
          Please enter a valid filename.
        </sui-segment>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button tab-index="0" @click="cancel">Cancel</sui-button>
        <sui-button tab-index="0" positive @click.native="confirm">
          Export
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import {ENTER} from "../../util/constants";

export default {
  name: "ExportModal",
  data() {
    return {
      filename: "",
      extension: "json",
      error: false
    };
  },
  mounted() {
    // Focus the input field when the modal is called.
    const self = this;
    this.$store.watch(
      () => self.$store.state.showExportModal,
      () => {
        if (self.$store.state.showExportModal)
          document.getElementById("filename").focus();
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
     * Check if the entered filename is valid.
     * If so, export the file and close the modal.
     * Otherwise, show an error message.
     */
    confirm() {
      const output = `${this.filename}.${this.extension}`;
      if (this.checkFilename(output)) {
        this.$store.dispatch("exportFileWithName", {
          filename: output,
          extension: this.extension
        });
        this.closeExportModal();
      }
    },

    cancel() {
      this.closeExportModal();
    },

    /**
     * Clear the field and close the modal.
     */
    closeExportModal() {
      this.$store.commit("toggleExportModal", "");
      this.filename = "";
      this.extension = "json";
    },

    /**
     * Check if the filename is valid.
     * Toggle the error message if needed.
     * @param filename
     * @returns {*} boolean, indicates if the filename is valid.
     */
    checkFilename(filename) {
      const bool = filename.match(/^[\w,\s-]+\.[A-Za-z]+/);
      this.error = !bool;
      return bool;
    }
  }
};
</script>

<style scoped></style>
