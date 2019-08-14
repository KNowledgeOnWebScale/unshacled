<template>
  <v-group ref="group" @mouseenter="hover = true" @mouseleave="hover = false">
    <v-arrow ref="arrow" :config="getConfigs().line"></v-arrow>
    <v-group ref="label" :config="getConfigs().label">
      <v-rect :config="getLabelRectConfig()"></v-rect>
      <v-text ref="text" :config="getConfigs().text"></v-text>
    </v-group>
    <v-circle
      v-if="hover"
      :config="getButtonConfig()"
      @click="click()"
    ></v-circle>
  </v-group>
</template>

<script>
import {
  WIDTH,
  HEIGHT,
  DELETE_BUTTON_CONFIG,
  RELATIONSHIP_ARROW_CONFIG,
  RELATIONSHIP_LABEL_RECT_CONFIG,
  RELATIONSHIP_LABEL_TEXT_CONFIG,
  MARGIN
} from "../../util/konvaConfigs";
import nearestPointOnPerimeter from "../../util/nearestPointOnPerimeter";
import { urlToName } from "../../parsing/urlParser";
import {distance} from "../../util";

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
    constraintID: {
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
      const { from, to, constraintID } = this.$props;
      const {
        coordinates,
        heights,
        yValues
      } = this.$store.state.mShape.mCoordinate;

      // Center points of the shapes.
      const start = {
        x: coordinates[from].x + WIDTH / 2,
        y: coordinates[from].y + yValues[from][constraintID] + HEIGHT
      };
      const end = nearestPointOnPerimeter(
        coordinates[to],
        {
          x: coordinates[to].x + WIDTH,
          y: coordinates[to].y + heights[to]
        },
        start
      );

      // Grab the nearest edge of the start shape.
      const edges = {
        xl: coordinates[from].x,
        xr: coordinates[from].x + WIDTH,
        y: coordinates[from].y + yValues[from][constraintID] + HEIGHT
      };
      const distLeft = distance(edges.xl, edges.y, end.x, end.y);
      const distRight = distance(edges.xr, edges.y, end.x, end.y);
      start.x = distLeft < distRight ? edges.xl : edges.xr;
      start.y = edges.y;

      return [
        start.x, // x1
        start.y, // y1
        end.x, // x2
        end.y // y2
      ];
    },

    getConfigs() {
      const DEGREES = 180;

      // Get the end points and the rotation of the arrow.
      const points = this.getEndPoints();
      const dx = points[2] - points[0];
      const dy = points[3] - points[1];

      let rotation = Math.atan2(dy, dx) * (DEGREES / Math.PI);
      rotation > DEGREES / 2 ? (rotation -= DEGREES) : null;
      rotation < -DEGREES / 2 ? (rotation += DEGREES) : null;

      return {
        line: {
          ...RELATIONSHIP_ARROW_CONFIG,
          points
        },
        label: {
          x: (points[0] + points[2]) / 2,
          y: (points[1] + points[3] - 2 * MARGIN) / 2,
          rotation
        },
        text: {
          ...RELATIONSHIP_LABEL_TEXT_CONFIG,
          text: urlToName(this.$props.constraintID)
        },
        rect: {
          ...RELATIONSHIP_LABEL_RECT_CONFIG,
          x: -MARGIN,
          y: -MARGIN
        }
      };
    },

    getLabelRectConfig() {
      const configs = this.getConfigs();
      if (this.$refs.text && this.$refs.text.getNode()) {
        return {
          ...configs.rect,
          width: this.$refs.text.getNode().width() + MARGIN * 2
        };
      }
      return configs.rect;
    },

    /**
     * Get the button configuration.
     * This one is not included in `getConfigs` because it relies on the previously drawn line.
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
     * Call the delete function using the given arguments.
     */
    click() {
      this.hover = false;
      this.$store.dispatch("deleteConstraintValue", this.$props.onClickProps);
    }
  }
};
</script>

<style scoped></style>
