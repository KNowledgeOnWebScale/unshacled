<template>
  <div>
    <sui-modal v-model="this.$store.state.showNodeShapeModal">
      <sui-modal-header>
        Add a {{ isPropertyShapeModal ? "Property" : "Node" }} Shape
      </sui-modal-header>
      <sui-modal-content>
        <sui-form v-on:submit.prevent="confirmNodeShape">
          <sui-form-field id="shapeNodeField" inline>
            <label for="shapeNodeID">ID</label>
            <input id="shapeNodeID" v-model="id" placeholder="Unique ID" />
          </sui-form-field>
        </sui-form>
        <sui-segment v-if="error" color="red">
          The ID should be unique.
        </sui-segment>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button negative @click="toggleShapeModal">Cancel</sui-button>
        <sui-button positive @click="confirmNodeShape">Add</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
export default {
  name: "NodeShapeModal",
  props: {
    isPropertyShapeModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      idString: "",
      error: false,
      listening: false
    };
  },
  computed: {
    id: {
      get() {
        return this.idString;
      },
      set(newID) {
        this.idString = newID;
      }
    }
  },
  methods: {
    confirmNodeShape() {
      this.error = false;
      const id = this.idString;
      // Checks if name is a unique key, also checking propertyshapes
      for (const prop in this.$store.state.propertyShapes) {
        if (this.$store.state.propertyShapes[prop]["@id"] === id)
          this.error = true;
      }
      // Only commit if the name is unique. Otherwise, show an error message.
      if (id === "" || this.$store.state.nodeShapes[id]) {
        this.error = true;
      }
      if (!this.error) {
        this.toggleShapeModal();
        this.idString = "";
        if (this.$props.isPropertyShapeModal)
          this.$store.commit("addPropertyShape", id);
        else this.$store.commit("addNodeShape", id);
      }
    },
    toggleShapeModal() {
      this.$store.commit("toggleShapeModal");
    }
  }
};
</script>

<style scoped></style>
