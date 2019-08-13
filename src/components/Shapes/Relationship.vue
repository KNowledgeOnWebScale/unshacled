<template>
  <v-group @mouseenter="hover = true" @mouseleave="hover = false">
    <v-circle
      v-if="hover"
      :config="getButtonConfig()"
      @click="click()"
    ></v-circle>
    <v-arrow :config="getLineConfig()"></v-arrow>
  </v-group>
</template>

<script>
import {
  DELETE_BUTTON_CONFIG,
  RELATIONSHIP_CONFIG
} from "../../util/konvaConfigs";

export default {
  name: "Relationship",
  state: {
    hover: false
  },
  props: {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    points: {
      type: Array,
      required: true
    },
    onClickProps: {
      type: Object,
      required: true
    }
  },
  methods: {
    /**
     * Get the button config for this relationship.
     * @returns {{x, y, radius, fill}}
     */
    getButtonConfig() {
      return DELETE_BUTTON_CONFIG;
    },

    /**
     * Get the line config for this relationship.
     * @returns {{points, stroke, fill}}
     */
    getLineConfig() {
      return {
        ...RELATIONSHIP_CONFIG,
        points: this.$props.points
      };
    },

    /**
     * Call the delete function using the given arguments.
     */
    click() {
      this.$store.dispatch("deleteConstraintValue", this.$props.onClickProps);
    }
  }
};
</script>

<style scoped></style>
