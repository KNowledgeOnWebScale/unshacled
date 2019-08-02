<template>
  <v-group @mouseenter="hover = true" @mouseleave="hover = false">
    <v-rect :config="getRectConfig()"></v-rect>
    <v-text ref="key" :config="keyConfig"></v-text>
    <v-line :config="lineConfig"></v-line>
    <div v-for="(value, index) of getConstraintValues()" :key="index">
      <v-text :config="getTextConfig(value, index)"></v-text>
      <v-circle
        v-if="hover"
        :config="deleteConstraintConfig"
        @click="deleteConstraint"
      ></v-circle>
    </div>
  </v-group>
</template>

<script>
import {
  HEIGHT,
  CONSTRAINT_SEPARATION_LINE,
  WIDTH,
  CONSTRAINT_CONFIG,
  CONSTRAINT_TEXT_CONFIG,
  DELTA_Y_TEXT,
  DELETE_BUTTON_CONFIG,
  DELTA_Y_DELETE
} from "../../util/konvaConfigs";
import { urlToName } from "../../parsing/urlParser";

export default {
  name: "Constraint",
  props: {
    shapeID: {
      type: String,
      required: true
    },
    constraintID: {
      type: String,
      required: true
    },
    stroke: {
      type: String,
      required: false,
      default: "black"
    }
  },
  data() {
    const y = this.$store.state.mShape.mCoordinate.yValues[this.$props.shapeID][
      this.$props.constraintID
    ];

    return {
      hover: false,
      lineConfig: {
        ...CONSTRAINT_SEPARATION_LINE,
        points: [0, y + HEIGHT, WIDTH, y + HEIGHT] // [x1, y1, x2, y2]
      },
      rectangleConfig: {
        ...CONSTRAINT_CONFIG,
        y,
        stroke: this.$props.stroke
      },
      keyConfig: {
        ...CONSTRAINT_TEXT_CONFIG,
        y: y + DELTA_Y_TEXT,
        fontStyle: "italic",
        text: urlToName(this.$props.constraintID)
      },
      valueConfig: {
        ...CONSTRAINT_TEXT_CONFIG,
        y: y + DELTA_Y_TEXT + HEIGHT
      },
      deleteConstraintConfig: {
        ...DELETE_BUTTON_CONFIG,
        y: y + DELTA_Y_DELETE
      }
    };
  },
  methods: {
    /**
     * Delete the current constraint from its shape.
     */
    deleteConstraint() {
      this.$store.dispatch("deleteConstraintFromShapeWithID", {
        shapeID: this.$props.shapeID,
        constraint: this.$props.constraintID
      });
      this.$store.commit("updateYValues", {
        shapeID: this.$props.shapeID,
        shapes: this.$store.state.mShape.model
      });
    },

    /**
     * Get all the constraint values of this predicate.
     * Returns a list of values.
     */
    getConstraintValues() {
      const constraints = this.$store.getters.shapeConstraints(
        this.$props.shapeID
      );
      const output = [];

      if (constraints && constraints[this.$props.constraintID]) {
        const values = constraints[this.$props.constraintID];

        // Properties should be listed in a single entry
        if (this.$props.constraintID.includes("property")) {
          for (const value of values) {
            output.push(urlToName(value));
          }
          return [output.toString()];
        }

        // FIXME ugly
        for (const value of values) {
          if (value["@id"]) {
            output.push(urlToName(value["@id"]));
          } else if (value["@value"]) {
            output.push(urlToName(value["@value"]));
          } else if (value["@list"]) {
            for (const v of value["@list"]) {
              if (v["@id"]) {
                output.push(v["@id"]);
              } else if (v["@value"]) {
                output.push(v["@value"]);
              }
            }
          } else {
            output.push(urlToName(value));
          }
        }
      }
      return output;
    },

    getRectConfig() {
      return {
        ...this.rectangleConfig,
        height: HEIGHT * (this.getNumConstraintValues() + 1)
      };
    },

    /**
     * Get the configuration for the given text value.
     */
    getTextConfig(text, index) {
      return {
        ...this.valueConfig,
        y: this.valueConfig.y + index * HEIGHT,
        text
      };
    },

    /**
     * Get the number of constraint values.
     * @returns {number}
     */
    getNumConstraintValues() {
      const cvs = this.$store.getters.shapeWithID(this.$props.shapeID)[
        this.$props.constraintID
      ];

      return this.$props.constraintID.includes("property")
        ? 1 // For `property`, these will be listed as a single value.
        : cvs[0]["@list"]
        ? cvs[0]["@list"].length // Get the number of elements if it's a list.
        : cvs.length;
    }
  }
};
</script>

<style scoped></style>
