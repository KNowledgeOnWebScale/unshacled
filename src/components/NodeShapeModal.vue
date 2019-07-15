<template>
  <div>
    <sui-modal v-model="this.$store.state.showNodeShapeModal">
      <sui-modal-header>Add a {{isPropertyShapeModal? "Property" : "Node"}} Shape</sui-modal-header>
      <sui-modal-content>
        <sui-form>
          <sui-form-field id="shapeNodeField" inline>
            <label>ID</label>
            <input id="shapeNodeID" v-model="id" placeholder="Unique ID" />
          </sui-form-field>
        </sui-form>
        <sui-segment v-if="error" color="red">The ID should be unique.</sui-segment>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button negative @click="toggleModal">Cancel</sui-button>
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
      error: false
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
      const id = this.idString;
      //Checks if name is a unique key, also checking propertyshapes
      for (let prop in this.$store.state.properties) {
        if (this.$store.state.properties[prop].path == id) this.error = true;
      }
      // Only commit if the name is unique. Otherwise, show an error message.
      if (id === "" || this.$store.state.nodeShapes[id]) {
        this.error = true;
      }
      if (!this.error) {
        this.toggleModal();
        this.idString = "";
        if (this.$props.isPropertyShapeModal)
          this.$store.commit("addPropertyShape", id);
        else this.$store.commit("addNodeShape", id);
      }
    },
    toggleModal() {
      this.$store.commit("toggleNodeShapeModal");
    }
  }
};
</script>

<style scoped></style>
