<template>
  <div>
    <sui-modal
      v-model="this.$store.state.dataModule.showValidationReportModal"
      @submit.prevent="confirmNodeShape"
    >
      <sui-modal-header>
        Validation report
      </sui-modal-header>
      <sui-modal-content>
        {{ this.$store.state.validationReport }}
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button negative @click="toggleModal">Cancel</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
export default {
  name: "ValidationReportModal",
  methods: {
    toggleModal() {
      this.$store.commit("toggleValidationReport");
    }
  }
};
</script>

<style scoped></style>
