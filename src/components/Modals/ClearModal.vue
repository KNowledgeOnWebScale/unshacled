<template>
  <div>
    <sui-modal v-model="$store.state.showClearModal">
      <sui-modal-header>
        Clear page?
      </sui-modal-header>
      <sui-modal-content>
        All your unsaved changes will be lost.
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button tab-index="0" @click="cancel">
          Cancel
        </sui-button>
        <sui-button
          id="clear"
          tab-index="0"
          type="submit"
          negative
          @click="confirm"
        >
          Clear
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
export default {
  name: "ClearModal",
  mounted() {
    /* Focus the clear button when the modal is called. */
    const self = this;
    this.$store.watch(
      () => self.$store.state.showClearModal,
      () => {
        if (self.$store.state.showClearModal)
          document.getElementById("clear").focus();
      }
    );
  },
  methods: {
    /**
     * Confirm the modal. This will clear the editor and close the modal.
     */
    confirm() {
      this.$store.commit("clearModel");
      this.$store.commit("clearData");
      this.toggleClearModal();
    },
    /**
     * Cancel the modal and close it without confirmation.
     */
    cancel() {
      this.toggleClearModal();
    },
    /**
     * Close the modal.
     */
    toggleClearModal() {
      this.$store.commit("toggleClearModal");
    }
  }
};
</script>

<style scoped></style>
