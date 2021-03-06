<template>
  <v-group
    :config="headerShift"
    @mouseenter="hoverKey = true"
    @mouseleave="hoverKey = false"
  >
    <v-text ref="key" :config="getConfigs().keyConfig"></v-text>
    <v-text
      :config="getValueConfig(getConstraintValues())"
      @click="editValue(0)"
      @mouseenter="setCursor('text')"
      @mouseleave="setCursor('')"
    ></v-text>
    <v-circle
      v-if="hoverKey && canBeDeleted()"
      :config="getConfigs().deleteConstraint"
      @click="deleteConstraint"
      @mouseenter="setCursor('pointer')"
      @mouseleave="setCursor('')"
    ></v-circle>
  </v-group>
</template>

<script>
import {
  HEIGHT,
  WIDTH,
  CONSTRAINT_CONFIG,
  CONSTRAINT_TEXT_CONFIG,
  DELETE_BUTTON_CONFIG,
  TEXT_OFFSET,
  MAX_LENGTH,
  pointerCursor,
  textCursor,
  resetCursor,
  HEADER_MARGIN
} from "../../../config/konvaConfigs";
import { uriToPrefix, urlToName } from "../../../util/urlParser";
import { SINGLE_ENTRY, APPLIES_ON } from "../../../util/constants";
import ValueType, {
  getValueTypeFromConstraint,
  ValueTypes
} from "../../../util/enums/ValueType";
import { TERM } from "../../../translation/terminology";
import { abbreviate } from "../../../util/strings";
import { isBlankPathNode, parsePath } from "../../../util/pathPropertyUtil";

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
  /**
   * HoverKey {boolean} indicates if the mouse is hovering over the key of the constraint.
   * HoverValues {boolean} indicates if the mouse is hovering over the values of the constraint.
   *
   * RectangleConfig {} the configuration of the rectangle.
   * KeyConfig {} the configuration of the key text field.
   * ValueConfig {} the configuration of the value text field.
   * DeleteConstraintConfig {} the configuration of the delete button.
   *
   * @returns {{hoverKey: boolean, hoverValues: boolean, rectangleConfig: {}, keyConfig: {}, valueConfig: {}, deleteConstraintConfig: {}}}
   */
  data() {
    return {
      hoverKey: false,
      hoverValues: false,

      rectangleConfig: {
        ...CONSTRAINT_CONFIG,
        stroke: this.$props.stroke
      },
      keyConfig: {
        ...CONSTRAINT_TEXT_CONFIG,
        x: TEXT_OFFSET,
        y: TEXT_OFFSET
      },
      valueConfig: {
        ...CONSTRAINT_TEXT_CONFIG,
        y: TEXT_OFFSET,
        x: WIDTH / 3
      },
      deleteConstraintConfig: {
        ...DELETE_BUTTON_CONFIG,
        y: HEIGHT / 2
      },
      headerShift: {
        y: HEADER_MARGIN + HEIGHT
      }
    };
  },
  methods: {
    /* EDIT/DELETE  ================================================================================================= */

    /**
     * Check if this constraint can be removed.
     * @returns {boolean} value that indicates if this constraint can be removed from the shape.
     */
    canBeDeleted() {
      return this.$props.constraintID !== TERM.path;
    },

    /**
     * Start editing the value of the given constraint.
     * NOTE: We don't want to edit every constraint this way.
     *       Some constraint can be edited using the visual relationships.
     * @param {number} index the index of the value in the constraint object.
     */
    editValue(index) {
      const { constraintID } = this.$props;
      const shape = this.$store.getters.shapeWithID(this.$props.shapeID);
      const values = shape[constraintID];
      const vt = ValueType(constraintID)
        ? ValueType(constraintID)
        : getValueTypeFromConstraint(values);

      // Determine the list we have to iterate over.
      let iter = values;
      if (
        vt.includes(ValueTypes.LIST) &&
        values.length === 1 &&
        values[0]["@list"]
      ) {
        iter = values[0]["@list"];
      }
      // Determine the key we have to check.
      const key = vt.includes(ValueTypes.ID) ? "@id" : "@value";
      const value = iter[index][key];

      if (constraintID === TERM.path) {
        /* The path of a property shape is handled differently. */
        this.$store.commit("togglePathModal", {
          shapeID: this.$props.shapeID,
          editing: true
        });
      } else if (!this.isListOfValues()) {
        /* Lists of values cannot be edited. */
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
      const args = {
        shapeID: this.$props.shapeID,
        constraintID: this.$props.constraintID
      };
      this.$store.dispatch("deleteConstraintFromShapeWithID", args);
      this.$store.commit("updateYValues", {
        shapeID: this.$props.shapeID,
        shapes: this.$store.state.mShape.model,
        relationships: this.$store.getters.relationships
      });

      /* Save the state to undo later. */
      this.$store.commit("saveOperation", {
        state: this.$store.state,
        action: { type: "deleteConstraintFromShapeWithID", args }
      });
    },

    /**
     * Delete the constraint value at the given index,
     * @param {number} index the index of the value in the constraint.
     */
    deleteConstraintValue(index) {
      const args = {
        shapeID: this.$props.shapeID,
        constraintID: this.$props.constraintID,
        valueIndex: index
      };
      this.$store.dispatch("deleteConstraintValueWithIndex", args);
      /* Save the state to undo later. */
      this.$store.commit("saveOperation", {
        state: this.$store.state,
        action: {
          type: "deleteConstraintValueWithIndex",
          args
        }
      });
      this.$store.commit("updateYValues", {
        shapeID: this.$props.shapeID,
        shapes: this.$store.state.mShape.model,
        relationships: this.$store.getters.relationships
      });
    },

    /* HELPERS ====================================================================================================== */

    /**
     * Checks if the current constraint value should be visualized as a list of values in a single entry.
     * @returns {boolean} value which indicates if the constraint value should be visualized as a list of values.
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
     * Get the correct value formatting for when a key is one of the "appliesOn" keys
     * @param {string} key the key, used to check which formatting shoudl be applied to the value.
     * @param {string} value the value that has to be formatted.
     * @returns {string} the formatted value.
     */
    appliesOnValue(key, value) {
      switch (key) {
        case TERM.targetNode:
          return `instance(${uriToPrefix(
            this.$store.getters.namespaces,
            value
          )})`;
        case TERM.targetClass:
          return `class(${uriToPrefix(
            this.$store.getters.namespaces,
            value
          )})`;
        case TERM.targetSubjectsOf:
          return `subjectsOf(${uriToPrefix(
            this.$store.getters.namespaces,
            value
          )})`;
        case TERM.targetObjectsOf:
          return `objectsOf(${uriToPrefix(
            this.$store.getters.namespaces,
            value
          )})`;
      }
    },

    /**
     * Get all the constraint values of this predicate, used to visualize the constraint.
     * @returns {[string]} a list of all the constraint values as strings.
     */
    getConstraintValues() {
      const { shapeID, constraintID } = this.$props;
      const info = this.$store.getters.shapeInfo(shapeID);
      const constraints = this.$store.getters.shapeConstraints(shapeID);
      const output = [];

      Object.assign(constraints, info);

      if (constraints && constraints[constraintID]) {
        if (constraintID === TERM.path) {
          /* Show the full path. */
          const path = constraints[constraintID][0];
          if (path["@value"]) {
            return [path["@value"]];
          } else if (path["@id"]) {
            const pathNode = this.$store.getters.shapeWithID(path["@id"]);
            if (pathNode && isBlankPathNode(pathNode)) {
              return [
                parsePath({
                  partialPath: path["@id"],
                  getters: this.$store.getters
                })
              ];
            } else {
              return [uriToPrefix(this.$store.getters.namespaces, path["@id"])];
            }
          } else if (path["@list"]) {
            return [
              parsePath({
                partialPath: path["@list"],
                getters: this.$store.getters
              })
            ];
          } else {
            return ["value missing"];
          }
        } else if (constraintID === "@id") {
          return constraints[constraintID];
        } else if (APPLIES_ON.includes(constraintID)) {
          return this.appliesOnValue(
            constraintID,
            constraints[constraintID][0]["@id"]
          );
        }

        /* Get the constraint's value type. */
        const values = constraints[constraintID];
        const vt = ValueType(constraintID)
          ? ValueType(constraintID)
          : getValueTypeFromConstraint(constraints[constraintID]);

        /* Specified constraint values should be listed in a single entry. */
        let iter;
        if (this.isListOfValues()) {
          iter =
            values.length > 1 || !vt.includes(ValueTypes.LIST)
              ? values
              : values[0]["@list"];
        } else {
          iter = values;
        }

        /* Other constraints should be visualized as an array of their value representations. */
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
          /* If the shape has a label, abbreviate and use it. */
          const text =
            this.$store.getters.labelsForIds[name] ||
            uriToPrefix(this.$store.state.mConfig.namespaces, name);
          output.push(abbreviate(text));
        }
        if (this.isListOfValues()) {
          const joined = output.join(", ");
          /* Abbreviate the label of every element depending on the number of elements in the list. */
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

    /* CONFIGURATIONS =============================================================================================== */

    /**
     * Get the y value of this constraint.
     * @returns {number} the y value of this constraint.
     */
    getYValue() {
      return this.$store.state.mShape.mCoordinate.yValues[this.$props.shapeID][
        this.$props.constraintID
      ];
    },

    /**
     * Get the configurations for the different visualization components.
     * This is mainly to dynamically set the y values and heights of the different components.
     * @returns {{rectangleConfig: object, keyConfig: object, valueConfig: object, deleteConstraint: object}}
     */
    getConfigs() {
      /* Determine the current y value. */
      const y = this.getYValue();

      const key = this.$props.constraintID;
      let keyText;
      if (key === "@id") {
        keyText = "IRI";
      } else if (APPLIES_ON.includes(key)) {
        keyText = "appliesOn";
      } else {
        keyText = uriToPrefix(
          this.$store.state.mConfig.namespaces,
          this.$props.constraintID
        );
      }

      return {
        rectangleConfig: {
          ...this.rectangleConfig,
          y,
          height: HEIGHT
        },
        keyConfig: {
          ...this.keyConfig,
          y: this.keyConfig.y + y,
          text: keyText
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
     * @param {string} value text that should be visualized in this constraint component.
     * @param {number} index the index of the constraint value.
     * @returns {{y: number, text: string}}
     */
    getValueConfig(value) {
      if (value.length === 1) {
        const val = value[0];
        value = val;
      }
      const text = uriToPrefix(this.$store.state.mConfig.namespaces, value);

      // Determine if the value has to move up to free up space for the label/name.
      const move = text.length - 2 > MAX_LENGTH ? -HEIGHT / 6 : 0;
      return {
        ...this.valueConfig,
        y: this.valueConfig.y + this.getYValue() + move,
        text
      };
    },

    /**
     * Get the configuration of the delete button for the constraint value at the given index.
     * @param {number} index the index of the constraint value.
     * @returns {object} the configuration object with an updated y value.
     */
    getDeleteValueConfig(index) {
      return {
        ...this.deleteConstraintConfig,
        y:
          this.deleteConstraintConfig.y +
          (index + 1) * HEIGHT +
          this.getYValue()
      };
    },

    /**
     * Set the cursor type according to the passed argument.
     * @param {string} type the type of pointer we want to use: "pointer" || "text"
     */
    setCursor(type) {
      if (type === "pointer") pointerCursor();
      else if (type === "text") textCursor();
      else resetCursor();
    }
  }
};
</script>

<style scoped></style>
