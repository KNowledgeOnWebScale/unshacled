<template>
  <v-group @mouseenter="hover = true" @mouseleave="hover = false">
    <v-rect :config="rectangleConfig"></v-rect>
    <v-text ref="key" :config="keyConfig"></v-text>
    <v-line :config="lineConfig"></v-line>
    <div v-for="(value, index) of getConstraintValues()" :key="index">
      <v-text :config="getConfig(value, index)"></v-text>
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
    // Get the number of constraint values. For `property`, these will be listed as a single value.
    const numConstraintValues = this.$props.constraintID.includes("property")
      ? 1
      : this.$store.getters.shapeWithID(this.$props.shapeID)[
          this.$props.constraintID
        ].length;

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
        height: HEIGHT * (numConstraintValues + 1),
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
        y: y + DELTA_Y_TEXT + HEIGHT,
        text: this.getConstraintValue()
      },
      deleteConstraintConfig: {
        ...DELETE_BUTTON_CONFIG,
        y: y + DELTA_Y_DELETE
      }
    };
  },
  mounted() {
    const self = this;
    // Update the text value whenever the shape has changed.
    this.$store.watch(
      () => self.$store.getters.shapeConstraints(self.$props.shapeID),
      () => self.updateConfigs()
    );
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
     * Get the value of the current constraint.
     * @returns {[]|*} array or string, depending to the number of values.
     */
    getConstraintValue() {
      this.getConstraintValues();
      const constraints = this.$store.getters.shapeConstraints(
        this.$props.shapeID
      );
      if (constraints && constraints[this.$props.constraintID]) {
        const value = constraints[this.$props.constraintID];

        // Check if there is more than one value.
        if (value.length > 1) {
          // Transform the list.
          const output = [];
          for (const element of value) {
            // Extract each element's name.
            output.push(urlToName(element));
          }
          return output;
        } else if (value.length === 0) {
          // The constraint has no value.
          return "(empty)";
        } else if (value[0]["@id"]) {
          // Get the ID and extract the name.
          return urlToName(value[0]["@id"]);
        } else if (value[0]["@value"]) {
          // Get the value.
          return value[0]["@value"];
        }
      }
      return "";
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

    /**
     * Get the configuration for the given text value.
     */
    getConfig(text, index) {
      return {
        ...this.valueConfig,
        y: this.valueConfig.y + index * HEIGHT,
        text
      };
    },

    /**
     * Update the text values.
     */
    updateConfigs() {
      this.keyConfig = {
        ...this.keyConfig,
        text: urlToName(this.$props.constraintID)
      };
      this.valueConfig = {
        ...this.valueConfig,
        text: this.getConstraintValue()
      };
    }
  }
};
</script>

<style scoped></style>
