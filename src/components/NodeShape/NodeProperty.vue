<template>
  <v-group>
    <v-rect :config="this.$props.propertyConfig"></v-rect>
    <v-text ref="propKey" :config="this.$props.propTextConfig"></v-text>
    <v-circle
      :config="this.$props.deletePropConfig"
      @mousedown="deleteProperty"
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
    propKey: {
      required: true,
      type: String
    },
    propertyConfig: {
      required: true
    },
    propTextConfig: {
      required: true
    },
    deletePropConfig: {
      required: true
    }
  },
  // data() {
  //   const x = 0;
  //   const width = 250;
  //   return {
  //     propertyConfig: {
  //       x,
  //       y: this.$props.y,
  //       height: 40,
  //       width,
  //       fill: "white",
  //       stroke: "black",
  //       strokeWidth: 2
  //     },
  //     propTextConfig: {
  //       x,
  //       y: this.$props.y + 15,
  //       size: 20,
  //       text: this.$props.propKey,
  //       width,
  //       align: "center"
  //     },
  //     deletePropConfig: {
  //       x: 240,
  //       y: this.$props.y + 20,
  //       radius: 6,
  //       fill: "red"
  //     }
  //   };
  // },
  methods: {
    deleteProperty() {
      const args = {
        node: this.$props.node,
        prop: this.$props.propKey
      };
      this.$store.commit("deletePropFromNode", args);
    }
  }
};
</script>

<style scoped></style>
