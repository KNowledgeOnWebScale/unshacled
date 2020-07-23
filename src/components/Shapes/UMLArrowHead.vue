<template>
  <v-shape
    :config="{
      sceneFunc: function(context, shape) {
        const scale = scaling;
        context.beginPath();
        context.moveTo(0 * scale, 20 * scale);
        context.lineTo(6 * scale, 0 * scale);
        context.lineTo(12 * scale, 20 * scale);
        context.lineTo(6 * scale, 15 * scale);
        context.closePath();

        context.fillStrokeShape(shape);
      },
      ...getConfig()
    }"
  />
</template>

<script>
import {
  UML_ARROWHEAD_WIDTH,
  UML_ARROWHEAD_HEIGHT,
  UML_ARROWHEAD_CENTER_X,
  UML_ARROWHEAD_CENTER_Y,
  UML_ARROWHEAD_SHIFT,
  UML_ARROWHEAD_ROTATE,
  HALF_CIRCLE
} from "../../config/konvaConfigs";

export default {
  name: "UMLArrowHead",
  props: {
    relationship: {
      type: Object,
      required: true
    },
    scale: {
      type: Number,
      required: false,
      default: 1
    }
  },
  data() {
    return {
      scaling: this.$props.scale
    };
  },
  methods: {
    updatePosition({ x, y, rotation }) {
      this.pointerConfig.x = x;
      this.pointerConfig.y = y;
      this.pointerConfig.rotation = rotation;
    },
    getConfig() {
      const relationshipID = `${this.$props.relationship.constraintID} - ${this.$props.relationship.from} - ${this.$props.relationship.to}`;
      const relationshipCoordinates = this.$store.state.mShape.mCoordinate
        .relationshipCoordinates[relationshipID];

      const x = relationshipCoordinates.to.x;
      const y = relationshipCoordinates.to.y;

      const dy = relationshipCoordinates.to.y - relationshipCoordinates.from.y;
      const dx = relationshipCoordinates.to.x - relationshipCoordinates.from.x;
      let theta = Math.atan2(dy, dx); // range (-PI, PI]
      theta *= HALF_CIRCLE / Math.PI; // rads to degs, range (-180, 180]
      theta += UML_ARROWHEAD_ROTATE;

      const slope = dy / dx;
      const angle = Math.atan(slope);
      const shiftY = UML_ARROWHEAD_SHIFT * Math.sin(angle);
      const shiftX = Math.sqrt(
        Math.pow(UML_ARROWHEAD_SHIFT, 2) - Math.pow(shiftY, 2)
      );

      const shiftDirection =
        relationshipCoordinates.to.x > relationshipCoordinates.from.x;

      return {
        x: shiftDirection ? x - shiftX : x + shiftX,
        y: shiftDirection ? y - shiftY : y + shiftY,
        width: this.$props.scale * UML_ARROWHEAD_WIDTH,
        height: this.$props.scale * UML_ARROWHEAD_HEIGHT,
        fill: "black",
        stroke: "black",
        strokeWidth: 1,
        offset: {
          x: this.$props.scale * UML_ARROWHEAD_CENTER_X,
          y: this.$props.scale * UML_ARROWHEAD_CENTER_Y
        },
        rotation: theta
      };
    }
  }
};
</script>

<style scoped></style>
