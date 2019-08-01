<template>
  <div>
    <sui-modal v-model="this.$store.state.showExportModal">
      <sui-modal-header> Export Shapes as {{ $store.state.exportType }} </sui-modal-header>
      <sui-modal-content>
        <!-- TODO add filename input field -->
        <sui-form>
          <sui-form-field>
            <label>Filename</label>
            <input v-model="filename" />
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
export default {
  name: "ExportModal",
  data() {
    return {
      filename: "",
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
      if (this.checkFilename(this.filename)) {
        this.$store.dispatch("exportFileWithName", this.filename);
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
      this.$store.commit("toggleExportModal", "");
    },

    /**
     * Check if the filename is valid.
     * Toggle the error message if needed.
     * @returns {*} boolean, indicates if the filename is valid.
     */
    checkFilename() {
      const bool = this.filename.match(/^[\w,\s-]+\.[A-Za-z]+$/);
      this.error = !bool;
      return bool;
    }
  }
};
</script>

<style scoped></style>
