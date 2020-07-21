<template>
  <v-group v-if="this.$props.to.length >= 2" ref="group">
    <v-group ref="label" :config="getConfig().label">
      <v-rect :config="getRectConfig(this.$refs.text)"></v-rect>
      <v-text ref="text" :config="getConfig().text"></v-text>
    </v-group>
    <v-line ref="line" :config="getConfig().line"></v-line>
  </v-group>
</template>

<script>
import {
  RELATIONSHIP_LINE_CONFIG,
  MARGIN,
  RELATIONSHIP_DASH_ARRAY,
  RELATIONSHIP_LABEL_TEXT_CONFIG,
  RELATIONSHIP_LABEL_RECT_CONFIG,
  LOGICAL_RELATIONSHIP_OFFSET,
  LOGICAL_RELATIONSHIP_APPENDAGE
} from "../../config/konvaConfigs";
import { TERM } from "../../translation/terminology";

export default {
  name: "LogicalRelationship",
  props: {
    constraintID: {
      type: String,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: Array,
      required: true
    }
  },

  data() {
    return {};
  },
  methods: {
    /**
     * Get the end points of the logical relationship line.
     * @returns {[number]} a list of coordinate objects: [{x1, y1}, {x2, y2}]
     */
    getEndPoints() {
      const { constraintID, from, to } = this.$props;
      const fstArrowCoords = this.$store.state.mShape.mCoordinate
        .relationshipCoordinates[`${constraintID} - ${from} - ${to[0]}`];
      const sndArrowCoords = this.$store.state.mShape.mCoordinate
        .relationshipCoordinates[`${constraintID} - ${from} - ${to[1]}`];

      const fstMid = {
        x: (fstArrowCoords.from.x + fstArrowCoords.to.x) / 2,
        y: (fstArrowCoords.from.y + fstArrowCoords.to.y) / 2
      };
      const sndMid = {
        x: (sndArrowCoords.from.x + sndArrowCoords.to.x) / 2,
        y: (sndArrowCoords.from.y + sndArrowCoords.to.y) / 2
      };

      const fstMidPoint = fstMid.x < sndMid.x ? fstMid : sndMid;
      const sndMidPoint = fstMid.x < sndMid.x ? sndMid : fstMid;

      const slope =
        (sndMidPoint.y - fstMidPoint.y) / (sndMidPoint.x - fstMidPoint.x);
      const angle = Math.atan(slope);
      const deltaY = LOGICAL_RELATIONSHIP_APPENDAGE * Math.sin(angle);
      const deltaX = Math.sqrt(
        Math.pow(LOGICAL_RELATIONSHIP_APPENDAGE, 2) - Math.pow(deltaY, 2)
      );

      return [
        fstMidPoint.x - deltaX,
        fstMidPoint.y - deltaY,
        sndMidPoint.x + deltaX,
        sndMidPoint.y + deltaY
      ];
    },

    /**
     * Get the configurations for the components of the logical relationship
     * @returns {{line: object, label: object, text: object, rect: object}}
     */
    getConfig() {
      /* Determine the end points and the rotation of the arrow. */
      const points = this.getEndPoints();

      /* Create and return the configuration objects using these end points. */
      return {
        line: {
          ...RELATIONSHIP_LINE_CONFIG,
          dash: RELATIONSHIP_DASH_ARRAY,
          points
        },
        label: {
          x: points[0] - LOGICAL_RELATIONSHIP_OFFSET,
          y: points[1] - MARGIN
        },
        text: {
          ...RELATIONSHIP_LABEL_TEXT_CONFIG,
          text: this.getLabelText()
        },
        rect: {
          ...RELATIONSHIP_LABEL_RECT_CONFIG,
          x: -MARGIN,
          y: -MARGIN
        }
      };
    },

    /**
     * Get the configuration for a label rectangle.
     * This one is not included in `getConfig` because it relies on the previously drawn text.
     * This checks how wide the text in the label is and adjusts the rectangle accordingly.
     * @param {string} ref The reference for the label text.
     * @returns {any} a configuration object.
     */
    getRectConfig(ref) {
      const configs = this.getConfig();
      if (ref && ref.getNode()) {
        return {
          ...configs.rect,
          width: ref.getNode().width() + MARGIN * 2
        };
      }
      return configs.rect;
    },

    /**
     * Get the correct label to display next to the logical relationship line, depending on the type of relationship.
     * @returns {string} the correct relationship label.
     */
    getLabelText() {
      switch (this.$props.constraintID) {
        case TERM.or:
          return "OR";
        case TERM.and:
          return "AND";
        case TERM.xone:
          return "OneOf";
        default:
          return "";
      }
    }
  }
};
</script>

<style scoped></style>
