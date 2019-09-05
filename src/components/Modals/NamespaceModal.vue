<template>
  <sui-modal v-model="$store.state.namespaceModal.show">
    <sui-modal-header>Namespaces</sui-modal-header>
    <sui-modal-content>
      <namespace-table></namespace-table>
    </sui-modal-content>
    <sui-modal-actions>
      <sui-button id="close" tab-index="0" @click="toggleModal">
        Close
      </sui-button>
    </sui-modal-actions>
  </sui-modal>
</template>

<script>
import NamespaceTable from "../FormElements/NamespaceTable.vue";

export default {
  name: "NamespaceModal",
  components: {
    NamespaceTable
  },
  methods: {
    toggleModal() {
      this.$store.commit("toggleNamespaceModal", false);
    }
  }
};
</script>

<style scoped></style>
