<template>
  <div>
    <reactive-input ref="reactiveInput" :on-exit="stopEditing"></reactive-input>
    <v-group
      ref="posRef"
      :draggable="true"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @dragmove="updateCoordinates"
    >
      <v-rect :config="shapeConfig"></v-rect>
      <v-text
        ref="nodeID"
        :config="idTextConfig"
        @click="startEditing"
      ></v-text>
      <v-circle
        v-if="hover"
        :config="deleteNodeConfig"
        @mousedown="deletePropertyShape"
      ></v-circle>

      <!-- TODO add button for adding property -->
    </v-group>
  </div>
</template>

<script>
import ReactiveInput from "../ReactiveInput.vue";
import {
  DELETE_NODE_CONFIG,
  ID_TEXT_CONFIG,
  PROP_TEXT_CONFIG,
  PROPERTY_CONFIG,
  PROPERTY_SHAPE_CONFIG
} from "../../util/konvaConfigs";

const DELTA_Y_TEXT = 15;
const DELTA_Y_DELETE = 20;

export default {
  name: "PropertyShape",
  components: { ReactiveInput },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hover: false,
      editing: false,
      propertyConfigs: {},
      propTextConfigs: {},
      deletePropConfigs: {},
      shapeConfig: PROPERTY_SHAPE_CONFIG,
      deleteNodeConfig: DELETE_NODE_CONFIG,
      idTextConfig: {
        ...ID_TEXT_CONFIG,
        text: this.$props.id
      },
      propertyConfig: PROPERTY_CONFIG,
      propTextConfig: {
        ...PROP_TEXT_CONFIG,
        text: this.$props.propKey
      },
      deletePropConfig: DELETE_NODE_CONFIG
    };
  },
  mounted() {
    // Move the shape to the defined coordinate.
    this.$refs.posRef
      .getNode()
      .setPosition(this.$store.state.coordinates[this.$props.id]);
    this.updateCoordinates();
  },
  methods: {
    /**
     * Get an object containing all the properties and set their y values.
     * @returns an object mapping every property name to a property object.
     */
    getProperties() {
      const { id } = this.$props;
      const properties = {};
      for (const prop of this.$store.getters.nodeShapes[id].properties) {
        properties[prop] = this.$store.getters.propertyShapes[prop];
      }
      this.setPropConfigs(properties);
      return properties;
    },

    /**
     * Set the configurations of its children using the updated y values from the state.
     * @param properties a dictionary containing the node shape's properties.
     */
    setPropConfigs(properties) {
      const { id } = this.$props;
      const ys = this.$store.state.yValues[id];
      for (const prop of Object.keys(properties)) {
        // The properties should be listed below eachother.
        this.propertyConfigs[prop] = { ...this.propertyConfig, y: ys[prop] };
        this.propTextConfigs[prop] = {
          ...this.propTextConfig,
          y: ys[prop] + DELTA_Y_TEXT,
          text: prop
        };
        this.deletePropConfigs[prop] = {
          ...this.deletePropConfig,
          y: ys[prop] + DELTA_Y_DELETE
        };
      }
    },

    /**
     * Call the ReactiveInput component to start editing using the given text node.
     */
    startEditing() {
      if (this.$refs.reactiveInput)
        this.$refs.reactiveInput.startEditing(this.$refs.nodeID.getNode());
    },

    /**
     * Stop editing.
     * Check if the filled in value is valid and unique.
     * Call the store to edit the node shape if possible.
     */
    stopEditing(newValue) {
      // Check if the new value is valid and unique.
      if (newValue !== "" && !this.$store.getters.propertyShapes[newValue]) {
        const args = {
          oldID: this.$props.id,
          newID: newValue
        };
        this.$store.commit("editPropertyShape", args);
      }
    },

    /**
     * Delete this node shape.
     */
    deletePropertyShape() {
      this.$store.commit("deletePropertyShape", this.$props.id);
    },

    /**
     * Takes the coördinates from this node shape and calls store to update them.
     */
    updateCoordinates() {
      const pos = this.$refs.posRef.getNode().position();
      const args = {
        node: this.$props.id,
        x: pos.x,
        y: pos.y
      };
      this.$store.commit("updateCoordinates", args);
    }
  }
};
</script>

<style scoped></style>
