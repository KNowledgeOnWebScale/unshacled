<template>
  <div>
    <sui-modal v-model="this.$store.state.showValidationReportModal">
      <sui-modal-header>
        Validation report
      </sui-modal-header>
      <sui-modal-content>
        {{ this.$store.state.validationReport }}
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button positive>Import as turtle</sui-button>
        <sui-button @click="toggleModal" negative>Cancel</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
export default {
  name: "ValidationReportModal",
  data() {
    return {};
  },
  mounted() {
    console.log("Validation report was mounted");
  },
  methods: {
    toggleModal() {
      this.$store.commit("toggleValidationReport");
    },
    exportTurtleFile() {
      return this.$store.getters.getValidationReport();
    }
  }
};
</script>

<style scoped></style>
