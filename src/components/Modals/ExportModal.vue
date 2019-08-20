<template>
  <div>
    <sui-modal v-model="this.$store.state.showExportModal">
      <sui-modal-header>
        Export Shapes as {{ $store.state.exportType }}
      </sui-modal-header>
      <sui-modal-content>
        <sui-form>
          <sui-form-field inline>
            <label>Filename</label>
            <input v-model="filename" />
            .
            <select v-model="extension" class="field ui fluid dropdown">
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
        <sui-button @click="cancel">Cancel</sui-button>
        <sui-button positive @click.native="confirm">Export</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import { ETF } from "../../util/enums/extensionToFormat";

export default {
  name: "ExportModal",
  data() {
    return {
      filename: "",
      extension: "json",
      error: false
    };
  },
  methods: {
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
        this.toggleExportModal();
      }
    },

    cancel() {
      this.toggleExportModal();
    },

    /**
     * Clear the field and close the modal.
     */
    toggleExportModal() {
      this.filename = "";
      this.extension = "json";
      this.$store.commit("toggleExportModal", "");
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
