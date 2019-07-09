<template>
  <div>
    <v-group :draggable="true">
      <v-rect :config="shapeConfig"></v-rect>
      <!-- TODO add text -->
      <!-- TODO add text editor -->
      <!-- TODO add button for deleting the shape -->
      <div v-for="key in Object.keys(property)" :key="key">
        <v-rect :config="propertyConfig"></v-rect>
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
    return {
      shapeConfig: {
        x: 0,
        y: 0,
        height: 40,
        width: 250,
        fill: "white",
        stroke: "black",
        strokeWidth: 3
      },
      propertyConfig: {
        x: 0,
        y: 0,
        height: 40,
        width: 250,
        fill: "white",
        stroke: "black",
        strokeWidth: 2
      }
    };
  }
};
</script>

<style scoped></style>
