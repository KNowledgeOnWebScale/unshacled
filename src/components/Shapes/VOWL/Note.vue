<template>
  <div>
    <v-shape
      :config="{
        sceneFunc: function(context, shape) {
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(180, 0);
          context.lineTo(200, 20);
          context.lineTo(200, 30 + getNoteLength());
          context.lineTo(0, 30 + getNoteLength());
          context.closePath();
          context.fillStrokeShape(shape);
        },
        fill: 'white',
        stroke: getBorderColor(),
        strokeWidth: 2
      }"
    />
  </div>
</template>

<script>
import { HEIGHT } from "../../../config/konvaConfigs";
import { TERM } from "../../../translation/terminology";

export default {
  name: "Note",
  components: {},
  props: {
    shapeId: {
      type: String,
      required: true
    }
  },
  methods: {
    getNoteLength() {
      const infoAmount = this.$store.getters.getInfoAmount(this.$props.shapeId);
      const constraintAmount = this.$store.getters.getConstraintAmount(
        this.$props.shapeId
      );

      return (infoAmount + constraintAmount) * HEIGHT;
    },

    getBorderColor() {
      const info = this.$store.getters.shapeInfo(this.$props.shapeId);
      if (info[TERM.severity]) {
        switch (info[TERM.severity][0]["@id"]) {
          case TERM.Info:
            return "#93c47d";
          case TERM.Warning:
            return "#ffd966";
          case TERM.Violation:
            return "#e06666";
          default:
            return "#e06666";
        }
      } else {
        return "#e06666";
      }
    }
  }
};
</script>

<style scoped></style>
