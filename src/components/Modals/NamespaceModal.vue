<template>
  <sui-modal v-model="$store.state.mConfig.namespaceModal.show">
    <sui-modal-header>Namespaces</sui-modal-header>
    <sui-modal-content>
      <namespace-table
        :table-properties="$store.state.mConfig.namespaceModal"
      ></namespace-table>

      <br />

      <sui-form @submit.prevent="addNamespace">
        <sui-form-fields>
          <sui-form-field class="four wide field">
            <sui-input placeholder="Prefix"></sui-input>
          </sui-form-field>
          <sui-form-field class="eleven wide field">
            <sui-input placeholder="URI"></sui-input>
          </sui-form-field>
          <sui-form-field class="one wide field">
            <sui-button
              color="green"
              icon="plus"
              :disabled="!validNamespace()"
            ></sui-button>
          </sui-form-field>
        </sui-form-fields>
      </sui-form>
    </sui-modal-content>

    <sui-modal-actions>
      <sui-button id="close" tab-index="0" @click="closeModal">
        Close
      </sui-button>
    </sui-modal-actions>
  </sui-modal>
</template>

<script>
import NamespaceTable from "../FormElements/NamespaceTable.vue";
import { IRI_REGEX } from "../../util/constants";

export default {
  name: "NamespaceModal",
  components: {
    NamespaceTable
  },
  state: {
    prefix: "",
    uri: ""
  },
  methods: {
    /**
     * Close the modal.
     */
    closeModal() {
      this.$store.commit("toggleNamespaceModal", false);
    },

    /**
     * Check if the entered prefix and URI are valid.
     */
    validNamespace() {
      const { prefix, uri } = this;
      if (
        prefix === "" ||
        uri === "" ||
        !/^[a-zA-Z0-9]+$/i.test(prefix) ||
        !IRI_REGEX.test(uri) ||
        !"/#".includes(uri.slice(-1))
      )
        return false;
    },

    /**
     * Add the given prefix and URI to the list with namespaces.
     */
    addNamespace() {
      this.$store.commit("addPrefix", { prefix: this.prefix, uri: this.uri });
    }
  }
};
</script>

<style scoped></style>
