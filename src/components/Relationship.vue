<template>
  <v-line :config="lineconfig"></v-line>
</template>

<script>
export default {
  name: "Relationship",
  props: {
    keyOne: String,
    keyTwo: String
  },
  data() {
    return {
      lineconfig: {
        points: this.coordinates(),
        stroke: "black",
        strokewidth: 1
      }
    };
  },
  methods: {
    coordinates: function() {
      const c1 = this.$store.getters.getCoordinatesFromNodeByName(this.keyOne);
      /*this.$store.getters["getCoordinatesFromNodeByName"](
        this.keyOne
      );*/
      const c2 = this.$store.getters["getCoordinatesFromNodeByName"](
        this.keyTwo
      );
      return [c1.x, c1.y, c2.x, c2.y];
    }
  }
};
</script>

<style scoped></style>
