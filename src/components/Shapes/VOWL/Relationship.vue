<template>
  <v-group ref="group" @mouseenter="sethover" @mouseleave="hover = false">
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

    <v-arrow ref="arrow" :config="getConfigs().line"></v-arrow>

    <v-group v-if="hasLabel" ref="label" :config="getLabelConfig()">
      <v-rect :config="getLabelRectConfig(this.$refs.text)"></v-rect>
      <v-text ref="text" :config="getConfigs().text"></v-text>
    </v-group>

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
  DELETE_BUTTON_CONFIG,
  RELATIONSHIP_ARROW_CONFIG,
  RELATIONSHIP_LABEL_RECT_CONFIG,
  RELATIONSHIP_LABEL_TEXT_CONFIG,
  RELATIONSHIP_LABEL_OFFSET,
  RELATIONSHIP_DASH_ARRAY,
  MARGIN,
  pointerCursor,
  resetCursor,
  LABEL_NO_SHIFT,
  LABEL_SHIFT_DOWN,
  LABEL_SHIFT_UP,
  WIDTH_VOWL,
  HEIGHT_VOWL,
  CENTER_SHAPE_VOWL_X,
  CENTER_SHAPE_VOWL_Y,
  NOTE_WIDTH_VOWL,
  LABEL_SECTION,
  HEIGHT_LITERAL_VOWL
} from "../../../config/konvaConfigs";
import { getShapeIntersection } from "../../../util/calculations";
import { uriToPrefix } from "../../../util/urlParser";
import { TERM } from "../../../translation/terminology";
import { isBlankPathNode, parsePath } from "../../../util/pathPropertyUtil";
import { COMPLIES_WITH, VOWL_BORDER_COLOR, VOWL_SHAPE_KIND } from "../../../util/constants";

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
      },
      hasLabel: true
    };
  },
  methods: {
    sethover() {
      this.hover = true;
      console.log(this.$props.constraintID);
    },
    /**
     * Get the end points of the relationship line.
     * @returns {[number]} a list of coordinates: [x1, y1, x2, y2]
     */
    getEndPoints() {
      const { from, to } = this.$props;
      const { coordinates } = this.$store.state.mShape.mCoordinate;

      /* Determine the center points of the start shape. */
      const startKind = this.$store.getters.getShapeKind(from);
      const start = startKind === VOWL_SHAPE_KIND.RDF_RESOURCE
      ? {
        x: coordinates[from].x + CENTER_SHAPE_VOWL_X,
        y: coordinates[from].y + CENTER_SHAPE_VOWL_Y,
        height: HEIGHT_VOWL,
        width: WIDTH_VOWL,
        kind: startKind
      }
      : {
        x: coordinates[from].x,
        y: coordinates[from].y,
        height: HEIGHT_LITERAL_VOWL,
        width: WIDTH_VOWL,
        kind: startKind
      };

      const endKind = this.$store.getters.getShapeKind(to);
      const end = endKind === VOWL_SHAPE_KIND.RDF_RESOURCE
      ? {
        x: coordinates[to].x + CENTER_SHAPE_VOWL_X,
        y: coordinates[to].y + CENTER_SHAPE_VOWL_Y,
        height: HEIGHT_VOWL,
        width: WIDTH_VOWL,
        kind: endKind
      }
      : {
        x: coordinates[to].x,
        y: coordinates[to].y,
        height: HEIGHT_LITERAL_VOWL,
        width: WIDTH_VOWL,
        kind: endKind
      };

      const note1 = this.getNoteProps(from);
      const startNote = note1 || {};
      const hasNoteStart = Boolean(note1);

      const intersectionStart = getShapeIntersection(
        start,
        startNote,
        hasNoteStart,
        end
      );

      const note2 = this.getNoteProps(to);
      const endNote = note2 || {};
      const hasNoteEnd = Boolean(note2);

      const intersectionEnd = getShapeIntersection(
        end,
        endNote,
        hasNoteEnd,
        start
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

      const isProperty = this.$props.constraintID === TERM.property;
      let labelY;
      if (isProperty) {
        labelY = (points[1] + points[3]) / 2 - MARGIN;
      } else {
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
          x: (points[0] + points[2]) / 2,
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
     * Sets the label to the correct fill color, outline color and height
     * @param {String} ref The reference for the label text.
     * @returns {Object} A configuration object.
     */
    getLabelRectConfig(ref) {
      const rectConfig = this.getRectConfig(ref);
      const isProperty = this.$props.constraintID === TERM.property;
      const strokeColor =
        VOWL_BORDER_COLOR[this.$store.getters.getSeverity(this.$props.to)];
      if (ref && ref.getNode()) {
        return {
          ...rectConfig,
          fill: isProperty ? "#AACCFF" : "white",
          height: ref.getNode().height() + MARGIN * 2,
          strokeEnabled: isProperty,
          stroke: isProperty ? strokeColor : "black"
        };
      } else {
        return rectConfig;
      }
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
              endPoint.x < midPoint.x ? LABEL_SECTION.TL : LABEL_SECTION.TR;
            break;
          case "L":
            this.cardinalitySection =
              endPoint.y < midPoint.y ? LABEL_SECTION.TL : LABEL_SECTION.BL;
            break;
          case "B":
            this.cardinalitySection =
              endPoint.x < midPoint.x ? LABEL_SECTION.BL : LABEL_SECTION.BR;
            break;
          case "R":
            this.cardinalitySection =
              endPoint.y < midPoint.y ? LABEL_SECTION.TR : LABEL_SECTION.BR;
            break;
          default:
            this.cardinalitySection = LABEL_SECTION.UNSPECIFIED;
        }
      } else {
        this.cardinalitySection = LABEL_SECTION.TR;
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

    getLabelConfig() {
      const { label } = this.getConfigs();

      if (this.$refs.text && this.$refs.text.getNode()) {
        return {
          ...label,
          x: label.x - this.$refs.text.getNode().width() / 2
        };
      } else {
        return label;
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
          case LABEL_SECTION.TL:
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
          case LABEL_SECTION.TR:
            return {
              x: cardinalityLabel.x + RELATIONSHIP_LABEL_OFFSET,
              y:
                cardinalityLabel.y -
                this.$refs.cardinalityText.getNode().height() -
                RELATIONSHIP_LABEL_OFFSET
            };
          case LABEL_SECTION.BR:
            return {
              x: cardinalityLabel.x + RELATIONSHIP_LABEL_OFFSET,
              y: cardinalityLabel.y + RELATIONSHIP_LABEL_OFFSET
            };
          case LABEL_SECTION.BL:
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
        }
        if (path["@id"]) {
          const pathNode = this.$store.getters.shapeWithID(path["@id"]);
          if (pathNode && isBlankPathNode(pathNode)) {
            return parsePath({
              partialPath: path["@id"],
              getters: this.$store.getters
            });
          }
          return uriToPrefix(this.$store.getters.namespaces, path["@id"]);
        }
        if (path["@list"]) {
          return parsePath({
            partialPath: path["@list"],
            getters: this.$store.getters
          });
        }
        return "value missing";
      }
      if (COMPLIES_WITH.includes(this.$props.constraintID)) {
        return "complyWith";
      }
      if (this.$props.constraintID === TERM.not) {
        return "NOT";
      }
      this.hasLabel = false;
      return "";
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
