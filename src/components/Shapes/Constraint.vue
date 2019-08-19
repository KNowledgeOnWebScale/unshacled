<template>
  <v-group>
    <v-rect :config="getConfigs().rectangleConfig"></v-rect>

    <v-group @mouseenter="hoverKey = true" @mouseleave="hoverKey = false">
      <v-text ref="key" :config="getConfigs().keyConfig"></v-text>
      <v-circle
        v-if="hoverKey && canBeDeleted()"
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
          v-if="hoverValues && !isListOfValues() && canBeDeleted()"
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
import { urlToName } from "../../util/urlParser";
import { SINGLE_ENTRY } from "../../util/constants";
import ValueType, {
  getValueTypeFromConstraint,
  ValueTypes
} from "../../util/enums/ValueType";
import { TERM } from "../../translation/terminology";

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
     * @returns {boolean} value that indicates if this constraint can be removed from the shape.
     */
    canBeDeleted() {
      return this.$props.constraintID !== TERM.path;
    },

    /**
     * Start editing the value of the given constraint.
     * NOTE: We don't want to edit properties this way; they will be edited using the visual relationships.
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
     * Returns boolean value which indicates if the current constraint value should be visualized
     * as a list of values in a single entry.
     * @returns {boolean}
     */
    isListOfValues() {
      const { shapeID, constraintID } = this.$props;
      const constraints = this.$store.getters.shapeConstraints(shapeID);
      return (
        constraints &&
        constraints[constraintID] &&
        SINGLE_ENTRY.includes(urlToName(constraintID))
      );
    },

    /**
     * Get all the constraint values of this predicate.
     * @returns {[]} a list of values.
     */
    getConstraintValues() {
      const { shapeID, constraintID } = this.$props;
      const constraints = this.$store.getters.shapeConstraints(shapeID);
      const output = [];

      if (constraints && constraints[constraintID]) {
        // Show the full path.
        if (constraintID === TERM.path) {
          return [constraints[constraintID][0]["@id"]];
        }

        // Get the constraint's value type.
        let values = constraints[constraintID];
        const vt = ValueType(constraintID)
          ? ValueType(constraintID)
          : getValueTypeFromConstraint(constraints[constraintID]);

        // Properties should be listed in a single entry.
        if (this.isListOfValues()) {
          const iter = vt.includes(ValueTypes.LIST)
            ? values[0]["@list"]
            : values;
          for (const v of iter) {
            output.push(v["@id"] ? urlToName(v["@id"]) : urlToName(v));
          }
          return [output.toString()];
        }

        // Other constraints should be visualized as an array of their value representations.
        if (
          vt.includes(ValueTypes.LIST) &&
          values.length === 1 &&
          values[0]["@list"]
        ) {
          values = values[0]["@list"];
        }
        for (const v of values) {
          const key = vt.includes(ValueTypes.ID) ? "@id" : "@value";
          output.push(v[key] ? v[key] : v);
        }
      }
      return output;
    },

    /**
     * Get the number of constraint values.
     * @returns {number}
     */
    getNumConstraintValues() {
      const { shapeID, constraintID } = this.$props;
      const cvs = this.$store.getters.shapeWithID(shapeID)[constraintID];
      return SINGLE_ENTRY.includes(urlToName(constraintID))
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

    /**
     * Get the configuration for a constraint value.
     * This will set the y coordinate and the text using the given value and index.
     * @param value text that should be visualized in this constraint component.
     * @param index the index of the constraint value.
     * @returns {{y: *, text: *}}
     */
    getValueConfig(value, index) {
      return {
        ...this.valueConfig,
        y: this.valueConfig.y + this.getYValue() + index * HEIGHT,
        text: this.$props.constraintID === TERM.path ? value : urlToName(value)
      };
    },

    /**
     * Delete the configuration of the delete button for the constraint value at the given index.
     * @param index the index of the constraint value.
     * @returns {{y: *}}
     */
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
