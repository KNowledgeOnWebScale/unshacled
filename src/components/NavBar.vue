<template>
  <div>
    <sui-menu ref="navbar" attached="top" inverted>
      <sui-dropdown item icon="file alternate" simple>
        <sui-dropdown-menu>
          <sui-dropdown-item>Import</sui-dropdown-item>
          <sui-dropdown-item>Export</sui-dropdown-item>
          <sui-dropdown-divider></sui-dropdown-divider>
          <sui-dropdown-item @click="loadExample">
            Load Example
          </sui-dropdown-item>
        </sui-dropdown-menu>
      </sui-dropdown>
      <sui-menu-item class="clickable" icon="add" @click="toggleModal">
        Shape
      </sui-menu-item>
      <sui-menu-item class="clickable" icon="trash" @click="clear">
      </sui-menu-item>
      <sui-menu-menu position="right">
        <sui-menu-item class="clickable" icon="user"></sui-menu-item>
      </sui-menu-menu>
    </sui-menu>

    <div>
      <sui-modal v-model="nodeShapeModal.visible">
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
  </div>
</template>

<script>
import SuiDropdown from "semantic-ui-vue/dist/commonjs/modules/Dropdown/Dropdown";
import SuiDropdownDivider from "semantic-ui-vue/dist/commonjs/modules/Dropdown/DropdownDivider";

export default {
  name: "NavBar",
  components: { SuiDropdownDivider, SuiDropdown },
  data() {
    return {
      nodeShapeModal: {
        visible: false,
        id: ""
      }
    };
  },
  computed: {
    id: {
      get() {
        return this.nodeShapeModal.id;
      },
      set(newID) {
        this.nodeShapeModal.id = newID;
      }
    }
  },
  methods: {
    clear() {
      this.$store.commit("clear");
    },
    loadExample() {
      this.$store.commit("loadExample");
    },
    toggleModal() {
      this.nodeShapeModal.visible = !this.nodeShapeModal.visible;
    },
    confirmNodeShape() {
      const { id } = this.nodeShapeModal;
      // Only commit if the name is unique. Otherwise, show an error message.
      if (id === "" || this.$store.state.nodeShapes[id]) {
        console.log("error");
      } else {
        this.toggleModal();
        this.nodeShapeModal.id = "";
        this.$store.commit("addNodeShape", id);
      }
    }
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
