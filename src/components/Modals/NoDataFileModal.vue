<template>
  <div>
    <sui-modal v-model="$store.state.mData.showNoDataFileModal">
      <sui-modal-header>
        No data file
      </sui-modal-header>
      <sui-modal-content>
        Please load a data file.
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button @click.native="toggle">OK</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
export default {
  name: "NoDataFileModal",
  methods: {
    toggle() {
      this.$store.commit("toggleNoDataFilePopup");
    }
  }
};
</script>

<style scoped></style>
