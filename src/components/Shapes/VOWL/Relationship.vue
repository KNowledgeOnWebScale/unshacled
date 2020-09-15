<template>
  <v-group ref="group" @mouseenter="hover = true" @mouseleave="hover = false">
    <v-group ref="label" :config="getConfigs().label">
      <v-rect :config="getRectConfig(this.$refs.text)"></v-rect>
      <v-text ref="text" :config="getConfigs().text"></v-text>
    </v-group>

    <v-group
      v-if="cardinalityPresent"
      ref="cardinalityLabel"
      :config="getCardinalityLabelConfig()"
    >
      <v-rect :config="getRectConfig(this.$refs.cardinalityText)"></v-rect>
      <v-text
        ref="cardinalityText"
        :config="getConfigs().cardinalityText"
      ></v-text>
    </v-group>

    <v-line ref="arrow" :config="getConfigs().line"></v-line>
    <u-m-l-arrow-head :relationship="relationship"></u-m-l-arrow-head>
    <v-circle
      v-if="hover"
      :config="getButtonConfig()"
      @click="click()"
      @mouseenter="setCursor('pointer')"
      @mouseleave="setCursor('')"
    ></v-circle>
  </v-group>
</template>

<script>
import {
  WIDTH,
  DELETE_BUTTON_CONFIG,
  RELATIONSHIP_ARROW_CONFIG,
  RELATIONSHIP_LABEL_RECT_CONFIG,
  RELATIONSHIP_LABEL_TEXT_CONFIG,
  RELATIONSHIP_LABEL_OFFSET,
  RELATIONSHIP_DASH_ARRAY,
  MARGIN,
  pointerCursor,
  resetCursor,
  LABEL_TOP_LEFT,
  LABEL_TOP_RIGHT,
  LABEL_BOTTOM_LEFT,
  LABEL_BOTTOM_RIGHT,
  LABEL_NO_SHIFT,
  LABEL_SHIFT_DOWN,
  LABEL_SHIFT_UP
} from "../../../config/konvaConfigs";
import { intersectionPoint } from "../../../util/calculations";
import { uriToPrefix } from "../../../util/urlParser";
import { TERM } from "../../../translation/terminology";
import { isBlankPathNode, parsePath } from "../../../util/pathPropertyUtil";
import { COMPLIES_WITH } from "../../../util/constants";
import UMLArrowHead from "./UMLArrowHead.vue";

export default {
  name: "Relationship",
  components: { UMLArrowHead },
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
  /**
   * Hover {boolean} indicates if the mouse is hovering over this relationship.
   * @returns {{hover: boolean}}
   */
  data() {
    return {
      hover: false,
      cardinalityPresent: false,
      cardinalitySection: 1,
      labelShift: 0,
      relationship: {
        constraintID: this.$props.constraintID,
        from: this.$props.from,
        to: this.$props.to
      }
    };
  },
  methods: {
    /**
     * Get the end points of the relationship line.
     * @returns {[number]} a list of coordinates: [x1, y1, x2, y2]
     */
    getEndPoints() {
      const { from, to } = this.$props;
      const { coordinates, heights } = this.$store.state.mShape.mCoordinate;

      /* Check whether the cardinality label should be put on the left side or the right side of the arrowpoint */
      this.cardinalityLeft =
        coordinates[to].x + WIDTH > coordinates[from].x + WIDTH / 2 &&
        coordinates[to].y <
          coordinates[from].y + RELATIONSHIP_LABEL_RECT_CONFIG.height;

      /* Determine the center points of the start shape. */
      const start = {
        x: coordinates[from].x + WIDTH / 2,
        y: coordinates[from].y + heights[from] / 2
      };

      const end = {
        x: coordinates[to].x + WIDTH / 2,
        y: coordinates[to].y + heights[to] / 2
      };

      const intersectionStart = intersectionPoint(
        start,
        end,
        { x: coordinates[from].x, y: coordinates[from].y },
        { x: coordinates[from].x + WIDTH, y: coordinates[from].y + heights[from] }
      );
      const intersectionEnd = intersectionPoint(
        end,
        start,
        { x: coordinates[to].x, y: coordinates[to].y },
        { x: coordinates[to].x + WIDTH, y: coordinates[to].y + heights[to] }
      );

      this.setCardinalitySection(start, intersectionEnd);
      this.setLabelShift(start, intersectionEnd);

      return [
        intersectionStart.x,
        intersectionStart.y,
        intersectionEnd.x,
        intersectionEnd.y
      ]; // x1, y1, x2, y2
    },

    /**
     * Get the configurations for the components of the relationship depending on the end points of the arrow.
     * @returns {{line: object, label: object, text: object, rect: object, cardinalityLabel: object, cardinalityText: object}}
     */
    getConfigs() {
      /* Determine the end points of the arrow. */
      const points = this.getEndPoints();

      /* Store the endpoints, to use for the representation of logical relationships */
      this.$store.commit("updateRelationshipCoordinates", {
        constraintId: this.$props.constraintID,
        from: this.$props.from,
        to: this.$props.to,
        fromCoords: {
          x: points[0],
          y: points[1]
        },
        toCoords: {
          x: points[2],
          y: points[3]
        }
      });

      const rotation = Math.tan(
        (points[3] - points[1]) / (points[2] - points[0])
      );

      let labelY;
      switch (this.labelShift) {
        case LABEL_NO_SHIFT:
          labelY = (points[1] + points[3]) / 2 - 2 * MARGIN;
          break;
        case LABEL_SHIFT_UP:
          labelY = (points[1] + points[3]) / 2 - 3 * MARGIN;
          break;
        case LABEL_SHIFT_DOWN:
          labelY = (points[1] + points[3]) / 2 + MARGIN;
          break;
      }

      /* Create and return the configuration objects using these end points. */
      return {
        line: {
          ...RELATIONSHIP_ARROW_CONFIG,
          dash: RELATIONSHIP_DASH_ARRAY,
          dashEnabled:
            COMPLIES_WITH.includes(this.$props.constraintID) ||
            this.$props.constraintID === TERM.not,
          points
        },
        label: {
          x: (points[0] + points[2]) / 2 + RELATIONSHIP_LABEL_OFFSET,
          y: labelY
        },
        text: {
          ...RELATIONSHIP_LABEL_TEXT_CONFIG,
          text: this.getLabelText()
        },
        rect: {
          ...RELATIONSHIP_LABEL_RECT_CONFIG,
          x: -MARGIN,
          y: -MARGIN
        },
        cardinalityLabel: {
          x: points[2],
          y: points[3]
        },
        cardinalityText: {
          ...RELATIONSHIP_LABEL_TEXT_CONFIG,
          text: this.getCardinalityLabelText()
        },
        arrowhead: {
          x: points[2],
          y: points[3],
          rotation
        }
      };
    },

    /**
     * Get the configuration for a label rectangle.
     * This one is not included in `getConfigs` because it relies on the previously drawn text.
     * This checks how wide the text in the label is and adjusts the rectangle accordingly.
     * @param {string} ref The reference for the label text.
     * @returns {any} a configuration object.
     */
    getRectConfig(ref) {
      const configs = this.getConfigs();
      if (ref && ref.getNode()) {
        return {
          ...configs.rect,
          width: ref.getNode().width() + MARGIN * 2
        };
      }
      return configs.rect;
    },

    /**
     * This sets the section the cardinality label should be placed in, if there is one.
     * Section 1: top left of the arrowhead
     * Section 2: top right of the arrowhead
     * Section 3: bottom right of the arrowhead
     * Section 4: bottom left of the arrowhead
     * Section 0: overlapping shapes / something went wrong => no cardinalityLabel should be placed
     * @param {object} midPoint The center point of the start shape, with an x and y component.
     * @param {object} endPoint The intersection point of the end shape, with an x, y and "side" component.
     */
    setCardinalitySection(midPoint, endPoint) {
      if (endPoint.side) {
        switch (endPoint.side) {
          case "T":
            this.cardinalitySection =
              endPoint.x < midPoint.x ? LABEL_TOP_LEFT : LABEL_TOP_RIGHT;
            break;
          case "L":
            this.cardinalitySection =
              endPoint.y < midPoint.y ? LABEL_TOP_LEFT : LABEL_BOTTOM_LEFT;
            break;
          case "B":
            this.cardinalitySection =
              endPoint.x < midPoint.x ? LABEL_BOTTOM_LEFT : LABEL_BOTTOM_RIGHT;
            break;
          case "R":
            this.cardinalitySection =
              endPoint.y < midPoint.y ? LABEL_TOP_RIGHT : LABEL_BOTTOM_RIGHT;
            break;
          default:
            this.cardinalitySection = 0;
        }
      } else {
        this.cardinalitySection = 0;
      }
    },

    setLabelShift(midPoint, endPoint) {
      if (endPoint.side) {
        switch (endPoint.side) {
          case "L":
            this.labelShift =
              endPoint.y < midPoint.y ? LABEL_SHIFT_DOWN : LABEL_SHIFT_UP;
            break;
          case "R":
            this.labelShift =
              endPoint.y < midPoint.y ? LABEL_SHIFT_UP : LABEL_SHIFT_DOWN;
            break;
          default:
            this.labelShift = LABEL_NO_SHIFT;
        }
      } else {
        this.labelShift = LABEL_NO_SHIFT;
      }
    },

    /**
     * Get the configuration for the cardinality label, according to the cardinalitySection property;
     * Section 1: top left of the arrowhead
     * Section 2: top right of the arrowhead
     * Section 3: bottom right of the arrowhead
     * Section 4: bottom left of the arrowhead
     * Section 0: overlapping shapes / something went wrong => no cardinalityLabel should be placed
     * @returns {object} a configuration object.
     */
    getCardinalityLabelConfig() {
      const { cardinalityLabel } = this.getConfigs();

      if (this.$refs.cardinalityText && this.$refs.cardinalityText.getNode()) {
        switch (this.cardinalitySection) {
          case LABEL_TOP_LEFT:
            return {
              x:
                cardinalityLabel.x -
                this.$refs.cardinalityText.getNode().width() -
                RELATIONSHIP_LABEL_OFFSET,
              y:
                cardinalityLabel.y -
                this.$refs.cardinalityText.getNode().height() -
                RELATIONSHIP_LABEL_OFFSET
            };
          case LABEL_TOP_RIGHT:
            return {
              x: cardinalityLabel.x + RELATIONSHIP_LABEL_OFFSET,
              y:
                cardinalityLabel.y -
                this.$refs.cardinalityText.getNode().height() -
                RELATIONSHIP_LABEL_OFFSET
            };
          case LABEL_BOTTOM_RIGHT:
            return {
              x: cardinalityLabel.x + RELATIONSHIP_LABEL_OFFSET,
              y: cardinalityLabel.y + RELATIONSHIP_LABEL_OFFSET
            };
          case LABEL_BOTTOM_LEFT:
            return {
              x:
                cardinalityLabel.x -
                this.$refs.cardinalityText.getNode().width() -
                RELATIONSHIP_LABEL_OFFSET,
              y: cardinalityLabel.y + RELATIONSHIP_LABEL_OFFSET
            };
        }
      } else {
        return cardinalityLabel;
      }
    },

    /**
     * Get the correct label to display next to the relationship arrows, depending on the type of relationship.
     * @returns {string} the correct relationship label.
     */
    getLabelText() {
      if (this.$props.constraintID === TERM.property) {
        const path = this.getPropertyFromId(TERM.path, this.$props.to);
        if (path["@value"]) {
          return path["@value"];
        } else if (path["@id"]) {
          const pathNode = this.$store.getters.shapeWithID(path["@id"]);
          if (pathNode && isBlankPathNode(pathNode)) {
            return parsePath({
              partialPath: path["@id"],
              getters: this.$store.getters
            });
          } else {
            return uriToPrefix(this.$store.getters.namespaces, path["@id"]);
          }
        } else if (path["@list"]) {
          return parsePath({
            partialPath: path["@list"],
            getters: this.$store.getters
          });
        } else {
          return "value missing";
        }
      } else if (COMPLIES_WITH.includes(this.$props.constraintID)) {
        return "compliesWith";
      } else if (this.$props.constraintID === TERM.not) {
        return "NOT";
      } else {
        return "";
      }
    },

    /**
     * Returns the cardinality of the PropertyShape, derived from the sh:minCount and sh:maxCount constraints.
     * This label has the format "x..y" with
     *  x = 0 when there is no minCount and the value of minCount when it is present
     *  y = * when there is no maxCount and the value of maxCount when it is present
     * @returns {string} The text for the cardinality label with the proper formatting and values
     */
    getCardinalityLabelText() {
      const compliesWith =
        this.$props.constraintID === TERM.qualifiedValueShape;

      let cardMin;
      if (compliesWith) {
        cardMin = this.getPropertyFromId(
          TERM.qualifiedMinCount,
          this.$props.from
        );
      } else {
        cardMin = this.getPropertyFromId(TERM.minCount, this.$props.to);
      }
      const minCount = cardMin ? cardMin["@value"] : undefined;

      let cardMax;
      if (compliesWith) {
        cardMax = this.getPropertyFromId(
          TERM.qualifiedMaxCount,
          this.$props.from
        );
      } else {
        cardMax = this.getPropertyFromId(TERM.maxCount, this.$props.to);
      }
      const maxCount = cardMax ? cardMax["@value"] : undefined;

      this.cardinalityPresent =
        (minCount || maxCount) && this.cardinalitySection !== 0;

      return `${minCount || "0"}..${maxCount || "*"}`;
    },

    /**
     * Takes in a shapeId for a PropertyShape and returns that PropertyShape's <property> value.
     * @param {string} property The property that has to be looked up in the PropertyShape
     * @param {string} id The unique identifier for the PropertyShape
     * @returns {string} That PropertyShape's sh:path value
     */
    getPropertyFromId(property, id) {
      const shape = this.$store.getters.shapeWithID(id);
      if (shape && shape[property]) {
        return shape[property][0];
      }
      return undefined;
    },

    /**
     * Get the button configuration.
     * This one is not included in `getConfigs` because it relies on the previously drawn line.
     * @returns {any} a configuration object.
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
      this.$store.commit("saveOperation", {
        state: this.$store.state,
        action: {
          type: "deleteConstraintValue",
          args: this.$props.onClickProps
        }
      });
    },

    /**
     * Set the cursor type according to the passed argument.
     * @param {string} type the type of cursor we want to use.
     */
    setCursor(type) {
      if (type === "pointer") pointerCursor();
      else resetCursor();
    }
  }
};
</script>

<style scoped></style>
