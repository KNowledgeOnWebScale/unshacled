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
      required: true,
      type: Object
    },
    propTextConfig: {
      required: true,
      type: Object
    },
    deletePropConfig: {
      required: true,
      type: Object
    }
  },
  methods: {
    /**
     * Delete the current property from its node shape.
     */
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
