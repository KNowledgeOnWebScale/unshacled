<template>
  <v-line :config="lineconfig"></v-line>
</template>

<script>
export default {
  name: "Relationship",
  props: {
    keyOne,
    keyTwo
  },
  data() {
    return {
      lineconfig: {
        points: this.coördinates,
        stroke: "black",
        strokewidth: 1
      }
    };
  },
  methods: {
    coördinates: function() {
      c1 = this.$store.getters.getCoördinatesFromNodeByName(this.keyOne);
      c2 = this.$store.getters.getCoördinatesFromNodeByName(this.keyTwo);
      return [c1.x, c1.y, c2.x, c2.y];
    }
  }
};
</script>

<style scoped></style>
