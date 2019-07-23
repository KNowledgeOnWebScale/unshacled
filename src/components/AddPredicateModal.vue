<template>
  <div>
    <sui-modal v-model="this.$store.state.predicateModal.show">
      <sui-modal-header> Add Predicate Report {{ input }}</sui-modal-header>
      <sui-modal-content>
        Predicate:
        <select v-model="predicate" @change="selectPredicate()">
          <option
            v-for="obj in predicates"
            id="Preds"
            :key="obj"
            :value="obj"
            >{{ obj }}</option
          >
        </select>
        <br />
        Object:
        <select v-model="object" v-if="objects">
          <option v-for="obj in objects" id="Objects" :key="obj" :value="obj">{{
            obj
          }}</option>
        </select>
        <br />
        Value:
        <input v-model="input" />
        <sui-segment v-if="error" color="red">
          Some constraints aren't supported yet by the internal model.
        </sui-segment>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button positive @click="addPredicate">add</sui-button>
        <sui-button negative @click="toggleModal">Cancel</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import ValueType from "../util/enums/ValueType";

export default {
  name: "AddPredicateModal",
  props: ["type", "id"],
  data() {
    return {
      predicate: "",
      urls: {},
      input: "",
      object: "",
      error: false
    };
  },

  computed: {
    predicates() {
      const predsWithoutUrl = [];

      if (this.type) {
        const preds = this.$store.getters.predicates(this.type);
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
      return objects;
    }
  },
  methods: {
    toggleModal() {
      const args = { id: null, type: null };
      this.$store.commit("togglePredicateModal", args);
      this.error = false;
    },
    selectPredicate() {
      this.$store.commit(
        "changePredicate",
        `${this.urls[this.predicate]}#${this.predicate}`
      );
    },
    addPredicate() {
      const pred = this.$store.state.predicateModal.predicate;
      const val = ValueType(pred);
      if (val === undefined)
        this.error = true;
      else
        this.error = false;
      console.log(val)
      const args = { pred, id: this.id, vt: val, input: this.input, object: this.object };
      if(!this.error)
      this.$store.commit("addPredicate", args);
    }
  }
};
</script>

<style scoped></style>
