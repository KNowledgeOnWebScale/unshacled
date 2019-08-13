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
  HEIGHT,
  RELATIONSHIP_CONFIG,
  WIDTH
} from "../../util/konvaConfigs";

export default {
  name: "Relationship",
  props: {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    onClickProps: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hover: false
    };
  },
  methods: {
    /**
     * Get the end points of the relationship line.
     * @returns {array}
     */
    getEndPoints() {
      const { from, to } = this.$props;
      const { coordinates } = this.$store.state.mShape.mCoordinate;
      const start = coordinates[from];
      const end = coordinates[to];
      return [
        start.x + WIDTH / 2,
        start.y + HEIGHT / 2,
        end.x + WIDTH / 2,
        end.y + HEIGHT / 2
      ];
    },

    /**
     * Get the button config for this relationship.
     * @returns {{x, y, radius, fill}}
     */
    getButtonConfig() {
      const points = this.getEndPoints();
      return {
        ...DELETE_BUTTON_CONFIG,
        x: (points[0] + points[2]) / 2,
        y: (points[1] + points[3]) / 2
      };
    },

    /**
     * Get the line config for this relationship.
     * @returns {{points, stroke, fill}}
     */
    getLineConfig() {
      return {
        ...RELATIONSHIP_CONFIG,
        points: this.getEndPoints()
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
