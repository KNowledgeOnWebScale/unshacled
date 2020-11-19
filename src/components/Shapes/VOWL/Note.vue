<template>
  <div>
    <v-shape
      :config="{
        sceneFunc: function(context, shape) {
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(shapeData.noteWidth - shapeData.cornerInset, 0);
          context.lineTo(shapeData.noteWidth, shapeData.cornerInset);
          context.lineTo(shapeData.noteWidth, shapeData.noteMargin + getNoteLength());
          context.lineTo(0, shapeData.noteMargin + getNoteLength());
          context.closePath();
          context.fillStrokeShape(shape);
        },
        fill: 'white',
        stroke: getBorderColor(),
        strokeWidth: 2,
        dashEnabled: isDeactivated,
        dash: shapeData.dashArray
      }"
    />
    <v-image v-if="$props.icon !== 'none'" :config="iconConfig"></v-image>
  </div>
</template>

<script>
import {
  NOTE_HEIGHT,
  NOTE_CORNER_INSET_VOWL,
  NOTE_MARGIN_VOWL,
  NOTE_WIDTH_VOWL,
  NOTE_ICON_SIZE_VOWL,
  RELATIONSHIP_DASH_ARRAY
} from "../../../config/konvaConfigs";
import { VOWL_BORDER_COLOR } from "../../../util/constants";

export default {
  name: "Note",
  components: {},
  props: {
    shapeId: {
      type: String,
      required: true
    },
    calculateLength: {
      type: Boolean,
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: "none"
    }
  },
  data() {
    return {
      shapeData: {
        noteWidth: NOTE_WIDTH_VOWL,
        cornerInset: NOTE_CORNER_INSET_VOWL,
        noteMargin: NOTE_MARGIN_VOWL,
        dashArray: RELATIONSHIP_DASH_ARRAY
      },
      iconImage: new Image(NOTE_ICON_SIZE_VOWL, NOTE_ICON_SIZE_VOWL)
    };
  },
  computed: {
    iconConfig() {
      return {
        x: NOTE_MARGIN_VOWL,
        y: NOTE_MARGIN_VOWL,
        image: this.iconImage,
        width: NOTE_ICON_SIZE_VOWL,
        height: NOTE_ICON_SIZE_VOWL
      };
    },

    isDeactivated() {
      return this.$store.getters.isDeactivated(this.$props.shapeId);
    }
  },
  mounted() {
    if (this.$props.icon !== "none") {
      this.iconImage.src = `/icons/${this.$props.icon}.svg`;
    }
  },
  methods: {
    getNoteLength() {
      if (this.$props.calculateLength) {
        const singleNoteVOWLConstraints = this.$store.getters.singleNoteVOWLConstraints(
          this.$props.shapeId
        );
        const constraintAmount = Object.keys(singleNoteVOWLConstraints).length;
        return constraintAmount * NOTE_HEIGHT;
      }
      return NOTE_HEIGHT;
    },

    getBorderColor() {
      return VOWL_BORDER_COLOR[
        this.$store.getters.getSeverity(this.$props.shapeId)
      ];
    }
  }
};
</script>

<style scoped></style>
