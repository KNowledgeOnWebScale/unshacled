<template>
  <div>
    <sui-modal v-model="this.$store.state.predicateModal.show">
      <sui-modal-header> Add Predicate Report </sui-modal-header>
      <sui-modal-content>
        <select v-model="predicate" @change="selectPredicate()">
          <option
            v-for="obj in predicates"
            id="Preds"
            :key="obj"
            :value="obj"
            >{{ obj }}</option
          >
        </select>
        <select v-if="objects">
          <option v-for="obj in objects" id="Objects" :key="obj" :value="obj">{{
            obj
          }}</option>
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
  data() {
    return {
      predicate: "",
      urls: {}
    };
  },

  computed: {
    predicates() {
      const predsWithoutUrl = [];

      if (this.type) {
        const preds = this.$store.getters.predicates(this.type);
        console.log(preds);
        if (preds)
          preds.forEach(pred => {
            const value = pred.split("#")[1];
            this.urls[value] = pred.split("#")[0];
            predsWithoutUrl.push(value);
          });
      }
      return predsWithoutUrl;
    },

    objects() {
      const { objects } = this.$store.getters;
      console.log(objects);
      return objects;
    }
  },
  methods: {
    toggleModal() {
      const args = { id: null, type: null };
      this.$store.commit("togglePredicateModal", args);
    },
    selectPredicate() {
      console.log(this.urls);
      this.$store.commit(
        "changePredicate",
        `${this.urls[this.predicate]}#${this.predicate}`
      );
    }
  }
};
</script>

<style scoped></style>
