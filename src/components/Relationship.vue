<template>
  <v-line :config="lineconfig"></v-line>
</template>

<script>
export default {
  name: "Relationship",
  props: {
    coords: Array
  },
  data() {
    return {
      lineconfig: {
        points: this.coords,
        stroke: "black",
        strokewidth: 1
      }
    };
  },
  watch: {
    coords: function(newCoors, old) {
      this.lineconfig.points = newCoors;
    }
  },
  methods: {}
};
</script>

<style scoped></style>
