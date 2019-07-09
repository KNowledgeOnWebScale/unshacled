<template>
  <div>
    <sui-modal v-model="this.$store.state.showNodeShapeModal">
      <sui-modal-header>Add a Node Shape</sui-modal-header>
      <sui-modal-content>
        <sui-form>
          <sui-form-field id="shapeNodeField" inline>
            <label>ID</label>
            <input id="shapeNodeID" v-model="id" placeholder="Unique ID" />
          </sui-form-field>
        </sui-form>
        <sui-segment color="red">
          The ID should be unique.
        </sui-segment>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button negative @click="toggleModal">
          Cancel
        </sui-button>
        <sui-button positive @click="confirmNodeShape">
          Add
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
export default {
  name: "NodeShapeModal",
  data() {
    return {
      idString: ""
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
      // Only commit if the name is unique. Otherwise, show an error message.
      if (id === "" || this.$store.state.nodeShapes[id]) {
        console.log("error");
        // TODO show the error message only when needed
      } else {
        this.toggleModal();
        this.idString = "";
        this.$store.commit("addNodeShape", id);
      }
    },
    toggleModal() {
      this.$store.commit("toggleNodeShapeModal");
    }
  }
};
</script>

<style scoped></style>
