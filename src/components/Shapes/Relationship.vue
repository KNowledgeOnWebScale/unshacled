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

    <v-arrow ref="arrow" :config="getConfigs().line"></v-arrow>
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
  HEIGHT,
  DELETE_BUTTON_CONFIG,
  RELATIONSHIP_ARROW_CONFIG,
  RELATIONSHIP_LABEL_RECT_CONFIG,
  RELATIONSHIP_LABEL_TEXT_CONFIG,
  RELATIONSHIP_LABEL_OFFSET,
  RELATIONSHIP_DASH_ARRAY,
  MARGIN,
  pointerCursor,
  resetCursor
} from "../../config/konvaConfigs";
import { nearestPointOnPerimeter, distance } from "../../util/calculations";
import { uriToPrefix } from "../../util/urlParser";
import { TERM } from "../../translation/terminology";
import { isBlankPathNode, parsePath } from "../../util/pathPropertyUtil";
import { COMPLIES_WITH } from "../../util/constants";

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
      cardinalityLeft: false
    };
  },
  methods: {
    /**
     * Get the end points of the relationship line.
     * @returns {[number]} a list of coordinates: [x1, y1, x2, y2]
     */
    getEndPoints() {
      const { from, to, constraintID } = this.$props;
      const {
        coordinates,
        heights,
        yValues
      } = this.$store.state.mShape.mCoordinate;

      /* Check whether the cardinality label should be put on the left side or the right side of the arrowpoint */
      this.cardinalityLeft =
        coordinates[to].x + WIDTH > coordinates[from].x + WIDTH / 2 &&
        coordinates[to].y <
          coordinates[from].y + RELATIONSHIP_LABEL_RECT_CONFIG.height;

      /* Determine the center points of the start shape. */
      const start = {
        x: coordinates[from].x + WIDTH / 2,
        y: yValues[from][constraintID]
          ? coordinates[from].y +
            yValues[from][constraintID] +
            RELATIONSHIP_LABEL_OFFSET
          : coordinates[from].y + RELATIONSHIP_LABEL_OFFSET
      };
      /* Determine the closest point on the end shape's perimeter. */
      const end = nearestPointOnPerimeter(
        coordinates[to],
        {
          x: coordinates[to].x + WIDTH,
          y: coordinates[to].y + heights[to]
        },
        start
      );

      /* Grab the nearest edge of the start shape. */
      const edges = {
        xl: coordinates[from].x,
        xr: coordinates[from].x + WIDTH,
        y: yValues[from][constraintID]
          ? coordinates[from].y + yValues[from][constraintID] + HEIGHT
          : coordinates[from].y + HEIGHT
      };
      const distLeft = distance(edges.xl, edges.y, end.x, end.y);
      const distRight = distance(edges.xr, edges.y, end.x, end.y);
      start.x = distLeft < distRight ? edges.xl : edges.xr;
      start.y = edges.y;

      return [start.x, start.y, end.x, end.y]; // x1, y1, x2, y2
    },

    /**
     * Get the configurations for the components of the relationship depending on the end points of the arrow.
     * @returns {{line: object, label: object, text: object, rect: object, cardinalityLabel: object, cardinalityText: object}}
     */
    getConfigs() {
      /* Determine the end points and the rotation of the arrow. */
      const points = this.getEndPoints();

      /* Create and return the configuration objects using these end points and rotations. */
      return {
        line: {
          ...RELATIONSHIP_ARROW_CONFIG,
          dash: RELATIONSHIP_DASH_ARRAY,
          dashEnabled: COMPLIES_WITH.includes(this.$props.constraintID),
          points
        },
        label: {
          x: (points[0] + points[2]) / 2 + RELATIONSHIP_LABEL_OFFSET,
          y: (points[1] + points[3] - 2 * MARGIN) / 2
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
          x: points[2] + RELATIONSHIP_LABEL_OFFSET,
          y: points[3] - RELATIONSHIP_LABEL_OFFSET
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
     * Get the configuration for the cardinality label, this puts the label on the left side of
     * the arrow point if the label is hidden behind the "to" shape, otherwise just leaves it on the right side.
     * @returns {object} a configuration object.
     */
    getCardinalityLabelConfig() {
      const configs = this.getConfigs();
      if (this.cardinalityLeft) {
        if (
          this.$refs.cardinalityText &&
          this.$refs.cardinalityText.getNode()
        ) {
          return {
            ...configs.cardinalityLabel,
            x:
              configs.cardinalityLabel.x -
              2 * RELATIONSHIP_LABEL_OFFSET -
              this.$refs.cardinalityText.getNode().width(),
            y: configs.cardinalityLabel.y + 2 * RELATIONSHIP_LABEL_OFFSET
          };
        }
      }
      return configs.cardinalityLabel;
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
      } else {
        return "no label";
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
      const compliesWith = COMPLIES_WITH.includes(this.$props.constraintID);

      let cardMin;
      if (!compliesWith) {
        cardMin = this.getPropertyFromId(TERM.minCount, this.$props.to);
      } else {
        cardMin = this.getPropertyFromId(TERM.qualifiedMinCount, this.$props.from);
      }
      const minCount = cardMin ? cardMin["@value"] : undefined;

      let cardMax;
      if (!compliesWith) {
        cardMax = this.getPropertyFromId(TERM.maxCount, this.$props.to);
      } else {
        cardMax = this.getPropertyFromId(TERM.qualifiedMaxCount, this.$props.from);
      }
      const maxCount = cardMax ? cardMax["@value"] : undefined;

      this.cardinalityPresent = minCount || maxCount;

      return `${minCount || "0"}..${maxCount || "*"}`;
    },

    /**
     * Takes in a shapeId for a PropertyShape and returns that PropertyShape's <property> value.
     * @param {string} property The property that has to be looked up in the PropertyShape
     * @param {string} id The unique identifier for the PropertyShape
     * @returns {string} That PropertyShape's sh:path value
     */
    getPropertyFromId(property, id) {
      for (const shape of this.$store.state.mShape.model) {
        if (shape["@id"] === id) {
          if (shape[property]) {
            return shape[property][0];
          } else {
            return undefined;
          }
        }
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
