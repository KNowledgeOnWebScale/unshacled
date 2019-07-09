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
        :config="deleteConfig"
        @mousedown="deleteNodeShape"
      ></v-circle>
      <!-- TODO add text editor -->
      <div v-for="(prop, key) in getProperties()" :key="key">
        <v-rect :config="getPropConfig(propYValues[key])"></v-rect>
        <v-text
          ref="key"
          :config="getPropTextConfig(propYValues[key], key)"
        ></v-text>
        <!-- TODO add editor -->
      </div>
      <!-- TODO add button for adding property -->
    </v-group>
  </div>
</template>

<script>
import Util from "../util";

export default {
  name: "NodeShape",
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
      propertyConfig: {
        x,
        height: 40,
        width,
        fill: "white",
        stroke: "black",
        strokeWidth: 2
      },
      deleteConfig: {
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
      propTextConfig: {
        x,
        size: 20,
        text: "",
        width,
        align: "center"
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
        this.propYValues[prop] = y + i * this.propertyConfig.height;
        i += 1;
      }
    },

    /**
     * Create a new property config object using the given y value.
     * @param y the y coordinate that should be used in the new config object.
     * @returns {*} a new config object adapted using the given coordinate.
     */
    getPropConfig(y) {
      // We have to create a copy of this config object.
      const newConfig = Util.clone(this.propertyConfig);
      newConfig.y = y; // Position the property field under the previous ones.
      return newConfig;
    },

    /**
     * Create a new text property config object using the given y value.
     * @param y the coordinate that should be used to calculate the y coordinate of the new config object.
     * @param key the text that should be used in the new config object.
     * @returns {*} a new config object adapted using the given information.
     */
    getPropTextConfig(y, key) {
      // We have to create a copy of this config object.
      const newConfig = Util.clone(this.propTextConfig);
      newConfig.y = y + 15; // Make sure the text is vertically centered in the rectangle.
      newConfig.text = key; // Update the text using the key.
      return newConfig;
    },

    deleteNodeShape() {
      this.$store.commit("deleteNodeShape", this.$props.id);
    }
  }
};
</script>

<style scoped></style>
