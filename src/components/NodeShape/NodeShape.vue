<template>
  <div>
    <v-group
      :draggable="true"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <v-rect :config="shapeConfig"></v-rect>
      <v-text ref="nodeID" :config="idTextConfig"></v-text>
      <v-circle
        v-if="hover"
        :config="deleteNodeConfig"
        @mousedown="deleteNodeShape"
      ></v-circle>
      <!-- TODO add text editor -->
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

export default {
  name: "NodeShape",
  components: { NodeProperty },
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
      // propYValues: {},
      propertyConfigs: {},
      propTextConfigs: {},
      deletePropConfigs: {},
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
        // y: this.$props.y,
        height: 40,
        width,
        fill: "white",
        stroke: "black",
        strokeWidth: 2
      },
      propTextConfig: {
        x,
        // y: this.$props.y + 15,
        size: 20,
        text: this.$props.propKey,
        width,
        align: "center"
      },
      deletePropConfig: {
        x: 240,
        // y: this.$props.y + 20,
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

    deleteNodeShape() {
      this.$store.commit("deleteNodeShape", this.$props.id);
    }
  }
};
</script>

<style scoped></style>
