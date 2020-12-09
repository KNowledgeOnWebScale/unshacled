<template>
  <div>
    <v-group ref="arrowGroup" @mouseenter="arrowHover = true" @mouseleave="arrowHover = false">
      <v-arrow ref="arrow" @mouseenter="printDebug" :config="getArrowConfig()"></v-arrow>

      <v-circle
        v-if="arrowHover"
        :config="getButtonConfig()"
        @click="deleteShape"
        @mouseenter="setCursor('pointer')"
        @mouseleave="setCursor('')"
      ></v-circle>
    </v-group>
    <v-group
      ref="posRef"
      :draggable="true"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @dragmove="updatePosition"
    >
      <!-- Main ellipse -->
      <v-group>
        <v-ellipse
          :config="getShapeConfig()"
        ></v-ellipse>
        <v-text ref="centerLabel" :config="getCenterLabelConfig()"></v-text>
      </v-group>

      <!-- Buttons -->
      <v-group>
        <v-circle
          v-if="hover"
          :config="deleteNodeConfig"
          @click="deleteShape"
          @mouseenter="setCursor('pointer')"
          @mouseleave="setCursor('')"
        ></v-circle>
      </v-group>

      <!-- An icon, if one is needed -->
      <v-image :config="iconConfig"></v-image>
    </v-group>
  </div>
</template>

<script>
import { uriToPrefix } from "../../../util/urlParser";
import {
  pointerCursor,
  resetCursor,
  textCursor,
  HEIGHT,
  SUBJECT_HR_LABEL_CONFIG,
  SUBJECT_URI_TEXT_CONFIG_VOWL,
  HEIGHT_VOWL,
  WIDTH_VOWL,
  CENTER_SHAPE_VOWL_X,
  CENTER_SHAPE_VOWL_Y,
  NOTE_INSET_VOWL,
  NOTE_WIDTH_VOWL,
  NOTE_ICON_SIZE_VOWL,
  NOTE_MARGIN_VOWL,
  RELATIONSHIP_DASH_ARRAY,
  CLOSED_BORDER_WIDTH_VOWL,
  BORDER_WIDTH_VOWL,
  MARGIN_VOWL,
  RDF_RESOURCE_SHAPE_CONFIG,
  LITERAL_SHAPE_CONFIG,
  HEIGHT_LITERAL_VOWL,
  DELETE_BUTTON_CONFIG_VOWL_RDF,
  DELETE_BUTTON_CONFIG_VOWL_LITERAL,
  ADD_PREDICATE_CONFIG_VOWL_RDF,
  ADD_PREDICATE_CONFIG_VOWL_LITERAL,
  TEXT_CONFIG_VOWL,
  TEXT_SIZE,
  LOGICAL_SHAPE_CONFIG,
  DELETE_BUTTON_CONFIG,
  DELETE_BUTTON_CONFIG_LOGICAL_REL,
  ADD_PREDICATE_CONFIG_LOGICAL_REL,
  LOGICAL_SHAPE_WIDTH,
  LOGICAL_SHAPE_HEIGHT,
  LOGICAL_ICON_SIZE,
  RELATIONSHIP_ARROW_CONFIG
} from "../../../config/konvaConfigs";
import { TERM } from "../../../translation/terminology";
import { abbreviate } from "../../../util/strings";
import {
  LABEL,
  LOGICAL_RELATIONSHIPS,
  VOWL_LITERAL_CONSTRAINTS,
  VOWL_SHAPE_KIND,
  VOWL_SHAPE_ICONS
} from "../../../util/constants";
import {
  getDefaultEllipsePosition,
  getPropertyGroupBounds,
  getShapeIntersection
} from "../../../util/calculations";
import { isBlankLogicalRelationshipNode } from '../../../util/pathPropertyUtil';
import { getNonOverlappingCoordinates } from '../../../util';

export default {
  name: "LogicalRelationship",
  props: {
    id: {
      type: String,
      required: true
    },
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
    return {
      hover: false,
      arrowHover: false,
      iconImage: null,
      debug: true
    };
  },
  computed: {
    icon() {
      const iconMap = {
        [TERM.or]: "or",
        [TERM.and]: "and",
        [TERM.xone]: "xone"
      };
      return iconMap[this.constraintID];
    },

    iconConfig() {
      return {
          x: LOGICAL_SHAPE_WIDTH * 0.1,
          y: LOGICAL_SHAPE_HEIGHT - LOGICAL_ICON_SIZE - MARGIN_VOWL,
          image: this.iconImage,
          width: LOGICAL_SHAPE_WIDTH * 0.8,
          height: LOGICAL_ICON_SIZE
        };
    },

    deleteNodeConfig() {
      return DELETE_BUTTON_CONFIG_LOGICAL_REL;
    },

    /**
     * The data element this.to might include a blank logical relationship node that doesn't get rendered,
     * this computed property has the correct ID's of all the destination shapes.
     * For now however, this component doesn't need to know the destination shapes, so this is commented out.
     */
    // destinationShapes() {
    //   const toReturn = [];
    //   const { relationships } = this.$store.getters;
    //   const { model } = this.$store.state.mShape;
    //   for (const dest of this.to) {
    //     const destShape = this.$store.getters.shapeWithID(dest);
    //     if (isBlankLogicalRelationshipNode(destShape, relationships, model)){
    //       for (const rel of relationships) {
    //         if (rel.from === dest) {
    //           toReturn.push(rel.to);
    //           break;
    //         }
    //       }
    //     } else {
    //       toReturn.push(dest);
    //     }
    //   }
    //   return toReturn;
    // }
  },
  mounted() {
    const { id } = this.$props;
    /* Move the shape to the defined coordinate. */
    const { posRef } = this.$refs;
    if (!this.$store.state.mShape.mCoordinate.coordinates[id]){
      const { x, y } = getNonOverlappingCoordinates({
        coordinates: this.$store.state.mShape.mCoordinate.coordinates,
        bottomYs: this.$store.getters.allBottomYs,
        heights: this.$store.state.mShape.mCoordinate.heights
      });
      this.$store.commit("setCoordinates", {
        shapeID: this.id,
        x, y
      });
    }
    if (posRef && posRef.getNode()) {
      posRef
      .getNode()
      .setPosition(this.$store.state.mShape.mCoordinate.coordinates[id]);
    }
  },
  created() {
    const image = new Image('auto', LOGICAL_ICON_SIZE);
    image.src = `/icons/${this.icon}.svg`;
    image.onload = () => {
      this.iconImage = image;
    };
  },
  methods: {
    getArrowConfig() {
      const points = this.getEndPoints();
      return {
        ...RELATIONSHIP_ARROW_CONFIG,
        dash: RELATIONSHIP_DASH_ARRAY,
        dashEnabled: true,
        points
      }
    },

    getEndPoints() {
      const { from } = this.$props;
      const to = this.id;
      const { coordinates } = this.$store.state.mShape.mCoordinate;

      const shapeMap = {
        [VOWL_SHAPE_KIND.RDF_RESOURCE]:
          (coords, kind) => {
            return {
              x: coords.x + CENTER_SHAPE_VOWL_X,
              y: coords.y + CENTER_SHAPE_VOWL_Y,
              height: HEIGHT_VOWL,
              width: WIDTH_VOWL,
              kind
            };
        },
        [VOWL_SHAPE_KIND.LITERAL]:
          (coords, kind) => {
            return {
              x: coords.x,
              y: coords.y,
              height: HEIGHT_LITERAL_VOWL,
              width: WIDTH_VOWL,
              kind
            };
        },
        [VOWL_SHAPE_KIND.RELATIONSHIP]:
          (coords, kind) => {
            return {
              x: coords.x + LOGICAL_SHAPE_WIDTH / 2,
              y: coords.y + LOGICAL_SHAPE_HEIGHT / 2,
              height: LOGICAL_SHAPE_HEIGHT,
              width: LOGICAL_SHAPE_WIDTH,
              kind
            };
        }
      };

      /* Determine the center points of the start shape. */
      const startKind = this.$store.getters.getShapeKind(from);
      const start = shapeMap[startKind](coordinates[from], startKind);

      const endKind = VOWL_SHAPE_KIND.RELATIONSHIP;
      const end = shapeMap[endKind](coordinates[to], endKind);

      const note1 = this.getNoteProps(from);
      const startNote = note1 || {};
      const hasNoteStart = Boolean(note1);

      const intersectionStart = getShapeIntersection(
        start,
        startNote,
        hasNoteStart,
        end
      );

      const intersectionEnd = getShapeIntersection(
        end,
        null,
        false,
        start
      );

      return [
        intersectionStart.x,
        intersectionStart.y,
        intersectionEnd.x,
        intersectionEnd.y
      ]; // x1, y1, x2, y2
    },

    getNoteProps(id) {
      const { coordinates } = this.$store.state.mShape.mCoordinate;
      const {
        VOWLconstraintCoordinates,
        VOWLconstraintHeights
      } = this.$store.state.mShape.mCoordinate;

      const toReturn = VOWLconstraintHeights[id]
        ? {
            y: coordinates[id].y + VOWLconstraintCoordinates[id].y,
            x: coordinates[id].x + VOWLconstraintCoordinates[id].x,
            height: VOWLconstraintHeights[id],
            width: NOTE_WIDTH_VOWL
          }
        : undefined;

      return toReturn;
    },

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

    getShapeConfig() {
      return {
        ...LOGICAL_SHAPE_CONFIG,
        strokeWidth: BORDER_WIDTH_VOWL,
        stroke: this.getBorderColor()
      };
    },

    getBorderColor() {
      const info = this.$store.getters.shapeInfo(this.from);
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
    },

    /**
     * @returns {object} the configuration object for the center label.
     */
    getCenterLabelConfig() {
      const logicalLabelMap = {
        [TERM.or]: "OR",
        [TERM.and]: "AND",
        [TERM.xone]: "OneOf"
      };
      const text = logicalLabelMap[this.constraintID];
      return {
        align: "center",
        x: 0,
        width: LOGICAL_SHAPE_WIDTH,
        y: MARGIN_VOWL,
        fontSize: TEXT_SIZE * 1.5,
        text
      };
    },

    /**
     * Takes the coordinates from this node shape and calls store to update them.
     */
    updatePosition() {
      if (this.$refs.posRef && this.$refs.posRef.getNode()){
        /* Determine the current position. */
        const pos = this.$refs.posRef.getNode().position();
        this.$store.commit("setCoordinates", {
          shapeID: this.id,
          x: pos.x,
          y: pos.y
        });
      }
    },

    /**
     * Delete this shape.
     */
    deleteShape() {
      const args = {
        shapeID: this.from,
        constraintID: this.constraintID
      };
      this.$store.dispatch("deleteConstraintFromShapeWithID", args);
    },

    /**
     * Set the cursor type according to the passed argument.
     * @param {string} type "pointer" || "text" || *: the type of cursor we want to use.
     */
    setCursor(type) {
      if (type === "pointer") pointerCursor();
      else if (type === "text") textCursor();
      else resetCursor();
    },

    printDebug() {
      console.log(this.$store.state.mShape.mCoordinate.coordinates[this.id]);
    }
  }
};
</script>

<style scoped></style>
