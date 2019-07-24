<template>
  <div>
    <sui-modal @submit.prevent="confirmNodeShape" v-model="this.$store.state.showValidationReportModal">
      <sui-modal-header>
        Validation report
      </sui-modal-header>
      <sui-modal-content>
        {{ this.$store.state.validationReport }}
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button @click="toggleModal" negative>Cancel</sui-button>
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
