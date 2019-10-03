<template>
  <div style="height: 96%;">
    <sui-segment basic style="padding-bottom: 0;">
      <sui-grid :columns="3">
        <sui-grid-column :width="4">
          <sui-header id="header">Data</sui-header>
        </sui-grid-column>
        <sui-grid-column v-if="dataText !== ''" :width="12" text-align="right">
          <sui-label v-if="invalidData()" basic color="red" pointing="right">
            Invalid JSON
          </sui-label>
          <sui-button
            :disabled="invalidData() || !dataHasChanged()"
            color="green"
            @click="updateData"
          >
            Update
          </sui-button>
          <sui-button
            :disabled="!dataHasChanged()"
            color="red"
            @click="updateText"
          >
            Reset
          </sui-button>
        </sui-grid-column>
      </sui-grid>
    </sui-segment>

    <sui-divider style="margin-bottom: 0;" />

    <div id="textContainer" style="height: 95%">
      <textarea v-if="dataText !== ''" v-model="dataText"></textarea>
      <sui-segment v-if="dataText === ''" basic>
        No data loaded.
      </sui-segment>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataTextView",
  props: {
    height: {
      type: Number,
      required: true
    }
  },
  /**
   * DataText {string} the current (possibly edited) data in JSON text format.
   * @returns {{dataText: string}}
   */
  data() {
    return {
      dataText: ""
    };
  },
  mounted() {
    /* Update the shown text whenever the store state is updated. */
    const self = this;
    this.$store.watch(
      () => self.$store.state.mData.dataText,
      () => self.updateText()
    );
  },
  methods: {
    /**
     * Update the shown text depending on the store state.
     */
    updateText() {
      const { dataText } = this.$store.state.mData;
      this.dataText = dataText || "";
    },
    /**
     * Update the data in the store using the data in the text field.
     */
    updateData() {
      this.$store.dispatch("updateData", { dataText: this.dataText });
      /* Save the state to undo later. */
      this.$store.commit("saveOperation", {
        state: this.$store.state,
        action: {
          type: "updateData",
          args: { dataText: this.dataText }
        }
      });
    },
    /**
     * Check if the data in the text field has changed in comparison to the data in the store.
     * @returns {boolean} indicates if the data has changed.
     */
    dataHasChanged() {
      return this.dataText !== this.$store.state.mData.dataText;
    },
    /**
     * Check if the data is invalid.
     * This will try to parse the data in the text field and return `true` if this is invalid JSON.
     * @returns {boolean} indicates if the data is invalid.
     */
    invalidData() {
      try {
        JSON.parse(this.dataText);
        return false;
      } catch (e) {
        return true; // Something went wrong while parsing.
      }
    }
  }
};
</script>

<style scoped>
#header {
  margin: 1vh;
  text-align: left;
}
textarea {
  border-color: white;
  border-width: 0;
  padding: 0 0 0 2vh;
  font-family: monospace;
  resize: none;
  height: 100%;
  width: 100%;
}
</style>
