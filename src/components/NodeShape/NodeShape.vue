<template>
  <div>
    <v-group
      ref="posRef"
      :draggable="true"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @dragend="updateCoordinates"
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
        @mousedown="deleteNodeShape"
      ></v-circle>
      <!-- TODO add text editor -->
      <reactive-input
        ref="reactiveInput"
        :on-exit="stopEditing"
      ></reactive-input>
      <div v-for="(prop, key) in getProperties()" :key="key">
        <node-property
          :prop-key="key"
          :node="$props.id"
          :property-config="propertyConfigs[key]"
          :prop-text-config="propTextConfigs[key]"
          :delete-prop-config="deletePropConfigs[key]"
        ></node-property>
      </div>
      <!-- TODO add button for adding property -->
    </v-group>
  </div>
</template>

<script>
import NodeProperty from "./NodeProperty.vue";
import ReactiveInput from "../ReactiveInput.vue";

export default {
  name: "NodeShape",
  components: { ReactiveInput, NodeProperty },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    const x = 0;
    const width = 250;
    return {
      hover: false,
      editing: false,
      propertyConfigs: {},
      propTextConfigs: {},
      deletePropConfigs: {},
      // reactiveInput: null,
      shapeConfig: {
        x,
        y: 0,
        height: 40,
        width,
        fill: "lightgreen",
        stroke: "green",
        strokeWidth: 3
      },
      deleteNodeConfig: {
        x: 240,
        y: 10,
        radius: 6,
        fill: "red"
      },
      idTextConfig: {
        x,
        y: 15,
        size: 20,
        text: this.$props.id,
        width,
        align: "center",
        fontStyle: "bold"
      },
      propertyConfig: {
        x,
        height: 40,
        width,
        fill: "white",
        stroke: "black",
        strokeWidth: 2
      },
      propTextConfig: {
        x,
        size: 20,
        text: this.$props.propKey,
        width,
        align: "center"
      },
      deletePropConfig: {
        x: 240,
        radius: 6,
        fill: "red"
      }
    };
  },
  methods: {
    /**
     * Get an object containing all the properties and set their y values.
     * @returns an object mapping every property name to a property object.
     */
    getProperties() {
      const { id } = this.$props;
      const properties = {};
      for (const prop of this.$store.state.nodeShapes[id].properties) {
        properties[prop] = this.$store.state.properties[prop];
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
          y: ys[prop] + 15,
          text: prop
        };
        this.deletePropConfigs[prop] = {
          ...this.deletePropConfig,
          y: ys[prop] + 20
        };
      }
    },

    startEditing() {
      if (this.$refs.reactiveInput) {
        this.$refs.reactiveInput.startEditing(this.$refs.nodeID.getNode());
      }
    },

    stopEditing(newValue) {
      if (newValue !== "" && !this.$store.state.nodeShapes[newValue]) {
        const args = {
          oldID: this.$props.id,
          newID: newValue
        };
        this.$store.commit("addNodeShape", args);
      }
    },

    /**
     * Delete this node shape.
     */
    deleteNodeShape() {
      this.$store.commit("deleteNodeShape", this.$props.id);
    },

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
