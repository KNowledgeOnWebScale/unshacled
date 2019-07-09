<template>
  <div>
    <v-group :draggable="true">
      <v-rect :config="shapeConfig"></v-rect>
      <!-- TODO add text -->
      <!-- TODO add text editor -->
      <!-- TODO add button for deleting the shape -->
      <div v-for="(prop, key) in getProperties()" :key="key">
        <v-rect :config="getPropConfig(propYValues[key])"></v-rect>
        <!-- TODO add text -->
        <!-- TODO add editor -->
      </div>
      <!-- TODO add button for adding property -->
    </v-group>
  </div>
</template>

<script>
export default {
  name: "Shape",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    const x = 0;
    return {
      propYValues: {},
      shapeConfig: {
        x,
        y: 0,
        height: 40,
        width: 250,
        fill: "lightgreen",
        stroke: "green",
        strokeWidth: 3
      },
      propertyConfig: {
        x,
        height: 40,
        width: 250,
        fill: "white",
        stroke: "black",
        strokeWidth: 2
      }
    };
  },
  methods: {
    /**
     * Get an object containing all the properties and set their y values.
     * @return an object mapping every property name to a property object.
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
        this.propYValues[prop] = y + i * this.propertyConfig.height;
        i += 1;
      }
    },
    /**
     * Create a new property config object using the given y value.
     * @param y
     */
    getPropConfig(y) {
      const newConfig = {};
      // We have to create a copy of this config object.
      for (const key of Object.keys(this.propertyConfig)) {
        newConfig[key] = this.propertyConfig[key];
      }
      newConfig.y = y;
      return newConfig;
    }
  }
};
</script>

<style scoped></style>
