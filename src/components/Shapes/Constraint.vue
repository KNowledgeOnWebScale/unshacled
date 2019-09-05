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
  DELTA_Y_DELETE,
  MAX_LENGTH
} from "../../config/konvaConfigs";
import { uriToPrefix, urlToName } from "../../util/urlParser";
import { SINGLE_ENTRY } from "../../util/constants";
import ValueType, {
  getValueTypeFromConstraint,
  ValueTypes
} from "../../util/enums/ValueType";
import { TERM } from "../../translation/terminology";
import { abbreviate } from "../../util/strings";

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
        text: uriToPrefix(this.$props.constraintID)
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
    editValue(index) {
      const { constraintID } = this.$props;
      const shape = this.$store.getters.shapeWithID(this.$props.shapeID);
      const values = shape[constraintID];
      const vt = ValueType(constraintID)
        ? ValueType(constraintID)
        : getValueTypeFromConstraint(values);

      let iter = values;
      if (
        vt.includes(ValueTypes.LIST) &&
        values.length === 1 &&
        values[0]["@list"]
      ) {
        iter = values[0]["@list"];
      }
      const key = vt.includes(ValueTypes.ID) ? "@id" : "@value";
      const value = iter[index][key];

      if (constraintID === TERM.path) {
        this.$store.commit("togglePathModal", {
          shapeID: this.$props.shapeID,
          editing: true
        });
      } else if (!this.isListOfValues()) {
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
        const values = constraints[constraintID];
        const vt = ValueType(constraintID)
          ? ValueType(constraintID)
          : getValueTypeFromConstraint(constraints[constraintID]);

        // Properties should be listed in a single entry.
        let iter;
        if (this.isListOfValues()) {
          iter =
            values.length > 1 || !vt.includes(ValueTypes.LIST)
              ? values
              : values[0]["@list"];
        } else {
          iter = values;
        }

        // Other constraints should be visualized as an array of their value representations.
        if (
          vt.includes(ValueTypes.LIST) &&
          values.length === 1 &&
          values[0]["@list"]
        ) {
          iter = values[0]["@list"];
        }
        for (const v of iter) {
          const key = vt.includes(ValueTypes.ID) ? "@id" : "@value";
          const name = v[key] ? v[key] : v;
          // If the shape has a label, use it.
          const text =
            this.$store.getters.labelForId(name) || uriToPrefix(name);
          // Abbreviate the label.
          output.push(abbreviate(text));
        }
        if (this.isListOfValues()) {
          const joined = output.join(", ");
          // Abbreviate the label of every element depending on the number of elements in the list.
          if (joined.length > MAX_LENGTH - 8) {
            return [
              output
                .map(e => abbreviate(e, (2 * MAX_LENGTH) / output.length))
                .join(", ")
            ];
          }
          return [joined];
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

    /**
     * Get the configurations for the different visualization components.
     * This is mainly to set the y values and heights of the different components.
     */
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
      const text = uriToPrefix(value);
      const move = text.length - 2 > MAX_LENGTH ? -HEIGHT / 6 : 0;
      return {
        ...this.valueConfig,
        y: this.valueConfig.y + this.getYValue() + index * HEIGHT + move,
        text
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
