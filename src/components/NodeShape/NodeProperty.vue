<template>
  <v-group>
    <v-rect :config="propertyConfig"></v-rect>
    <v-text ref="prop" :config="propTextConfig"></v-text>
    <v-circle
      :config="deleteNodeConfig"
<!--      @mousedown="deleteNodeShape"-->
    ></v-circle>
    <!-- TODO add editor -->
  </v-group>
</template>

<script>
export default {
  name: "NodeProperty",
  props: {
    node: {
      required: true,
      type: String
    },
    prop: {
      required: true,
      type: String
    },
    y: {
      required: true
    }
  },
  data() {
    const x = 0;
    const width = 250;
    return {
      propertyConfig: {
        x,
        y: this.$props.y,
        height: 40,
        width,
        fill: "white",
        stroke: "black",
        strokeWidth: 2
      },
      propTextConfig: {
        x,
        y: this.$props.y + 15,
        size: 20,
        text: this.$props.prop,
        width,
        align: "center"
      },
      deletePropConfig: {
        x: 240,
        y: 10,
        radius: 6,
        fill: "red"
      }
    };
  },
  methods: {
    deleteProperty() {
      this.$store.commit("deleteProperty", this.$props.node, this.$props.prop);
    }
  }
};
</script>

<style scoped></style>
