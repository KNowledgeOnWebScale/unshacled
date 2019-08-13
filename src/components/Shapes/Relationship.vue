<template>
  <v-group @mouseenter="hover = true" @mouseleave="hover = false">
    <v-arrow ref="arrow" :config="getLineConfig()"></v-arrow>
    <v-circle
      v-if="hover"
      :config="getButtonConfig()"
      @click="click()"
    ></v-circle>
  </v-group>
</template>

<script>
import {
  DELETE_BUTTON_CONFIG,
  RELATIONSHIP_CONFIG,
  WIDTH
} from "../../util/konvaConfigs";
import nearestPointOnPerimeter from "../../util/nearestPointOnPerimeter";

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
      const { coordinates, heights } = this.$store.state.mShape.mCoordinate;

      // Center points of the shapes.
      const start = {
        x: coordinates[from].x + WIDTH / 2,
        y: coordinates[from].y + heights[from] / 2
      };
      // const end = {
      //   x: coordinates[to].x + WIDTH / 2,
      //   y: coordinates[to].y + heights[to] / 2
      // };
      const end = nearestPointOnPerimeter(
        coordinates[to],
        {
          x: coordinates[to].x + WIDTH,
          y: coordinates[to].y + heights[to]
        },
        start
      );

      return [
        start.x, // x1
        start.y, // y1
        end.x, // x2
        end.y // y2
      ];
    },

    /**
     * Get the button configuration for this relationship.
     */
    getButtonConfig() {
      const arrow = this.$refs.arrow.getNode();
      const transform = arrow.getAbsoluteTransform().copy();
      transform.invert();
      const pointer = arrow.getStage().getPointerPosition();
      const relative = transform.point(pointer);
      return {
        ...DELETE_BUTTON_CONFIG,
        x: relative.x,
        y: relative.y
      };
    },

    /**
     * Get the line configuration for this relationship.
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
