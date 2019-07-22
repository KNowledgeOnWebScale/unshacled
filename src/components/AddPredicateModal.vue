<template>
  <div>
    <sui-modal v-model="this.$store.state.predicateModal.show">
      <sui-modal-header> Add Predicate Report </sui-modal-header>
      <sui-modal-content>
        <select>
          <option
            v-for="obj in predicates"
            id="Preds"
            :key="obj"
            value="key"
            @change="selectPredicate"
            >{{ obj }}</option
          >
        </select>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button positive>add</sui-button>
        <sui-button negative @click="toggleModal">Cancel</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
export default {
  name: "AddPredicateModal",
  props: ["type", "id"],
  computed: {
    predicates() {
      const predsWithoutUrl = [];
      if (this.type) {
        const preds = this.$store.getters.predicates(this.type);
        if (preds)
          preds.forEach(pred => {
            predsWithoutUrl.push(pred.split("#")[1]);
          });
      }
      return predsWithoutUrl;
    }
  },
  methods: {
    toggleModal() {
      const args = { id: null, type: null };
      this.$store.commit("togglePredicateModal", args);
    },
    selectPredicate() {
      const val = document.getElementById("Preds");
      this.$store.commit(
        "changePredicate",
        val.options(val.selectedIndex).value
      );
    }
  }
};
</script>

<style scoped></style>
