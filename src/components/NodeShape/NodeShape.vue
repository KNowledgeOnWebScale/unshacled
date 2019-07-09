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
          :prop="key"
          :node="$props.id"
          :y="propYValues[key]"
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
      propYValues: {},
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
      this.setPropYValues(properties);
      return properties;
    },

    /**
     * Set the y value of every property in the propYValues object.
     */
    setPropYValues(properties) {
      let i = 0;
      const y = this.shapeConfig.y + this.shapeConfig.height;
      for (const prop of Object.keys(properties)) {
        // The properties should be listed below eachother.
        this.propYValues[prop] = y + i * this.shapeConfig.height;
        i += 1;
      }
    },

    deleteNodeShape() {
      this.$store.commit("deleteNodeShape", this.$props.id);
    }
  }
};
</script>

<style scoped></style>
