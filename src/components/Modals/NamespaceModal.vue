<template>
  <sui-modal v-model="$store.state.mConfig.mModal.show">
    <sui-modal-header>Namespaces</sui-modal-header>
    <sui-modal-content>
      <namespace-table
        :table-properties="$store.state.mConfig.mModal"
      ></namespace-table>

      <br />

      <sui-form @submit.prevent="addNamespace">
        <sui-form-fields>
          <sui-form-field
            class="four wide field"
            :class="{
              error: prefix !== '' && !validPrefix()
            }"
          >
            <input
              id="prefixField"
              placeholder="Prefix"
              @input="e => (prefix = e.target.value)"
            />
          </sui-form-field>
          <sui-form-field
            class="eleven wide field"
            :class="{ error: uri !== '' && !validURI() }"
          >
            <input
              id="uriField"
              placeholder="URI"
              @input="e => (uri = e.target.value)"
            />
          </sui-form-field>
          <sui-form-field class="one wide field">
            <sui-button
              color="green"
              icon="plus"
              :disabled="!validPrefix() || !validURI()"
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
  data() {
    return {
      prefix: "",
      uri: ""
    };
  },
  methods: {
    /**
     * Close the modal.
     */
    closeModal() {
      this.$store.commit("toggleNamespaceModal", false);
    },

    /**
     * Add the given prefix and URI to the list with namespaces.
     */
    addNamespace() {
      const { prefix, uri } = this;
      if (this.validURI() && this.validPrefix()) {
        this.$store.dispatch("addNewPrefix", { prefix, uri });
        // Clear the filled in values.
        this.prefix = "";
        this.uri = "";
        document.getElementById("prefixField").value = "";
        document.getElementById("uriField").value = "";
      }
    },

    /**
     * Check if the entered prefix is valid.
     */
    validPrefix() {
      const { prefix } = this;
      return (
        prefix !== "" &&
        /^[a-zA-Z0-9]+$/i.test(prefix) &&
        !Object.keys(this.$store.getters.namespaces).includes(prefix)
      );
    },

    /**
     * Check if the entered URI is valid.
     */
    validURI() {
      const { uri } = this;
      return (
        uri !== "" &&
        IRI_REGEX.test(uri) &&
        "/#".includes(uri.slice(-1)) &&
        !Object.values(this.$store.getters.namespaces).includes(uri)
      );
    }
  }
};
</script>

<style scoped></style>
