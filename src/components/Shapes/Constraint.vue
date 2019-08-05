<template>
  <v-group>
    <v-rect :config="getConfigs().rectangleConfig"></v-rect>

    <v-group @mouseenter="hoverKey = true" @mouseleave="hoverKey = false">
      <v-text ref="key" :config="getConfigs().keyConfig"></v-text>
      <v-circle
        v-if="hoverKey"
        :config="getConfigs().deleteConstraint"
        @click="deleteConstraint"
      ></v-circle>
    </v-group>

    <v-line :config="getConfigs().lineConfig"></v-line>

    <v-group @mouseenter="hoverValues = true" @mouseleave="hoverValues = false">
      <div v-for="(value, index) of getConstraintValues()" :key="index">
        <v-text
          :config="getValueConfig(value, index)"
          @click="editValue(index, value)"
        ></v-text>
        <v-circle
          v-if="hoverValues"
          :config="getDeleteValueConfig(index)"
          @click="deleteConstraintValue(index)"
        ></v-circle>
      </div>
    </v-group>
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
    nodeShape: {
      type: Boolean,
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
    return {
      hoverKey: false,
      hoverValues: false,

      lineConfig: {
        ...CONSTRAINT_SEPARATION_LINE,
        points: [0, HEIGHT, WIDTH, HEIGHT] // [x1, y1, x2, y2]
      },
      rectangleConfig: {
        ...CONSTRAINT_CONFIG,
        stroke: this.$props.stroke
      },
      keyConfig: {
        ...CONSTRAINT_TEXT_CONFIG,
        y: DELTA_Y_TEXT,
        fontStyle: "italic",
        text: urlToName(this.$props.constraintID)
      },
      valueConfig: {
        ...CONSTRAINT_TEXT_CONFIG,
        y: DELTA_Y_TEXT + HEIGHT
      },
      deleteConstraintConfig: {
        ...DELETE_BUTTON_CONFIG,
        y: DELTA_Y_DELETE
      }
    };
  },
  methods: {
    /* EDIT/DELETE  ================================================================================================= */

    /**
     * Start editing the value of the given constraint.
     * NOTE: We don't want to edit properties this way. They will be edited using the visual relationships.
     */
    editValue(index, value) {
      if (!this.$props.constraintID.includes("property")) {
        this.$store.dispatch("startConstraintEdit", {
          shapeID: this.$props.shapeID,
          shapeType: this.$props.nodeShape ? "NodeShape" : "PropertyShape",
          constraintID: this.$props.constraintID,
          index,
          value
        });
      }
    },

    /**
     * Delete the current constraint from its shape.
     */
    deleteConstraint() {
      this.$store.dispatch("deleteConstraintFromShapeWithID", {
        shapeID: this.$props.shapeID,
        constraintID: this.$props.constraintID
      });
      this.$store.commit("updateYValues", {
        shapeID: this.$props.shapeID,
        shapes: this.$store.state.mShape.model
      });
    },

    /**
     * Delete the constraint value at the given index,
     * @param index
     */
    deleteConstraintValue(index) {
      this.$store.dispatch("deleteConstraintValueWithIndex", {
        shapeID: this.$props.shapeID,
        constraintID: this.$props.constraintID,
        valueIndex: index
      });
      this.$store.commit("updateYValues", {
        shapeID: this.$props.shapeID,
        shapes: this.$store.state.mShape.model
      });
    },

    /* HELPERS ====================================================================================================== */

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

        // Properties should be listed in a single entry.
        if (this.$props.constraintID.includes("property")) {
          for (const value of values) {
            output.push(
              value["@id"] ? urlToName(value["@id"]) : urlToName(value)
            );
          }
          return [output.toString()];
        }

        // FIXME ugly
        for (const value of values) {
          if (value["@id"] || value["@id"] === "") {
            output.push(urlToName(value["@id"]));
          } else if (value["@value"] || value["@value"] === "") {
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
     * Get the number of constraint values.
     * @returns {number}
     */
    getNumConstraintValues() {
      const cvs = this.$store.getters.shapeWithID(this.$props.shapeID)[
        this.$props.constraintID
      ];

      return this.$props.constraintID.includes("property")
        ? 1 // For `property`, these will be listed as a single value.
        : cvs.length > 0 && cvs[0]["@list"]
        ? cvs[0]["@list"].length // Get the number of elements if it's a list.
        : cvs.length;
    },

    /* CONFIGURATIONS =============================================================================================== */

    /**
     * Return the y value of this constraint.
     * @returns {*}
     */
    getYValue() {
      return this.$store.state.mShape.mCoordinate.yValues[this.$props.shapeID][
        this.$props.constraintID
      ];
    },

    getConfigs() {
      const y = this.getYValue();
      const points = [...this.lineConfig.points];
      points[1] += y;
      points[3] += y;

      return {
        lineConfig: { ...this.lineConfig, points },
        rectangleConfig: {
          ...this.rectangleConfig,
          y,
          height: (this.getNumConstraintValues() + 1) * HEIGHT
        },
        keyConfig: {
          ...this.keyConfig,
          y: this.keyConfig.y + y
        },
        valueConfig: {
          ...this.valueConfig,
          y: this.valueConfig.y + y
        },
        deleteConstraint: {
          ...this.deleteConstraintConfig,
          y: this.deleteConstraintConfig.y + y
        }
      };
    },

    getValueConfig(text, index) {
      return {
        ...this.valueConfig,
        y: this.valueConfig.y + this.getYValue() + index * HEIGHT,
        text
      };
    },

    getDeleteValueConfig(index) {
      return {
        ...this.deleteConstraintConfig,
        y:
          this.deleteConstraintConfig.y +
          (index + 1) * HEIGHT +
          this.getYValue()
      };
    }
  }
};
</script>

<style scoped></style>
