<template>
  <div>
    <sui-modal v-model="$store.state.showClearModal">
      <sui-modal-header>
        Clear page?
      </sui-modal-header>
      <sui-modal-content>
        <sui-form>
          <sui-form-field>
            <sui-checkbox
              v-model="model"
              label="Clear Model"
              :disabled="isCleared('model')"
            ></sui-checkbox>
          </sui-form-field>
          <sui-form-field>
            <sui-checkbox
              v-model="data"
              label="Clear Data"
              :disabled="isCleared('data')"
            ></sui-checkbox>
          </sui-form-field>
        </sui-form>

        <sui-message error icon="exclamation triangle">
          All your unsaved changes will be lost.
        </sui-message>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button id="cancel" tab-index="0" @click="toggleClearModal">
          Cancel
        </sui-button>
        <sui-button
          tab-index="0"
          type="submit"
          negative
          :disabled="!(data || model)"
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
  data() {
    return {
      data: false,
      model: false
    };
  },
  mounted() {
    /* Focus the clear button when the modal is called. */
    const self = this;
    this.$store.watch(
      () => self.$store.state.showClearModal,
      () => {
        if (self.$store.state.showClearModal)
          document.getElementById("cancel").focus();
      }
    );
  },
  methods: {
    /**
     * Select the given option to clear.
     * @param {string} option the part we want to clear.
     */
    select(option) {
      if (option === "data" && !this.isCleared("data")) {
        this.data = true;
        this.model = false;
      } else if (option === "model" && !this.isCleared("model")) {
        this.data = false;
        this.model = true;
      }
    },

    /**
     * Confirm the modal. This will clear the editor and close the modal.
     */
    confirm() {
      if (this.model) this.$store.commit("clearModel");
      if (this.data) this.$store.commit("clearData");
      this.toggleClearModal();
      /* Save the executed operation. */
      this.$store.commit("saveOperation", {
        state: this.$store.state,
        action: { type: "clear" }
      });
    },
    /**
     * Close the modal.
     */
    toggleClearModal() {
      this.$store.commit("toggleClearModal");
      this.data = false;
      this.model = false;
    },

    /**
     * Check if the wanted option is cleared already.
     * @param {string} option "model" or "data".
     * @returns {boolean} indicates if the chosen option is cleared already.
     */
    isCleared(option) {
      if (option === "model")
        return this.$store.state.mShape.model.length === 0;
      if (option === "data")
        return this.$store.state.mData.dataText.length === 0;
    }
  }
};
</script>

<style scoped></style>
