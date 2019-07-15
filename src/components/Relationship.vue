<template>
  <v-line :config="lineconfig"></v-line>
</template>

<script>
export default {
  name: "Relationship",
  props: {
    coords: {
      required: true,
      type: Array
    }
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
    /**
     * just makes sure the lineconfig changes whenever it gets new props
     */
    coords(newCoors) {
      this.lineconfig.points = newCoors;
    }
  },
  methods: {}
};
</script>

<style scoped></style>
