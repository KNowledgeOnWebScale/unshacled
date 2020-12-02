<template>
  <v-group @mouseenter="hoverKey = true" @mouseleave="hoverKey = false">
    <v-text
      :config="getTextConfig()"
      @click="editValue(0)"
      @mouseenter="setCursor('text')"
      @mouseleave="setCursor('')"
    ></v-text>
    <v-circle
      v-if="hoverKey && canBeDeleted()"
      :config="deleteConstraintConfig"
      @click="deleteConstraint"
      @mouseenter="setCursor('pointer')"
      @mouseleave="setCursor('')"
    ></v-circle>
  </v-group>
</template>

<script>
import {
  CONSTRAINT_TEXT_CONFIG_VOWL,
  TEXT_OFFSET,
  MAX_LENGTH,
  pointerCursor,
  textCursor,
  resetCursor,
<<<<<<< HEAD
  DELETE_BUTTON_CONFIG,
=======
  DELETE_BUTTON_CONFIG_VOWL_LITERAL,
>>>>>>> 3858ded60686a67a1ca50b493293d5ad07d06a96
  NOTE_WIDTH_VOWL,
  NOTE_MARGIN_VOWL,
  NOTE_HEIGHT_CALC,
  NOTE_ICON_SIZE_VOWL
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
    isConcat: {
      type: Boolean,
      required: false,
      default: false
    },
    hasIcon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  /**
   * HoverKey {boolean} indicates if the mouse is hovering over the key of the constraint.
   * HoverValues {boolean} indicates if the mouse is hovering over the values of the constraint.
   *
   * KeyConfig {} the configuration of the key text field.
   * DeleteConstraintConfig {} the configuration of the delete button.
   */
  data() {
    return {
      hoverKey: false,
      hoverValues: false,

      keyConfig: {
        ...CONSTRAINT_TEXT_CONFIG_VOWL,
        y: TEXT_OFFSET
      },
      deleteConstraintConfig: {
        ...DELETE_BUTTON_CONFIG_VOWL_LITERAL,
        x: this.$props.hasIcon
          ? NOTE_WIDTH_VOWL -
            NOTE_ICON_SIZE_VOWL -
            TEXT_OFFSET -
            NOTE_MARGIN_VOWL
          : NOTE_WIDTH_VOWL - 2 * NOTE_MARGIN_VOWL,
        y: NOTE_HEIGHT_CALC / 2
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
      if (this.$props.isConcat) {
        const concatMap = {
          range: Object.keys(
            this.$store.getters.rangeVOWLConstraints(this.$props.shapeID)
          ),
          length: Object.keys(
            this.$store.getters.lengthVOWLConstraints(this.$props.shapeID)
          )
        };
        let args;
        for (const concatConstraint of concatMap[this.$props.constraintID]) {
          args = {
            shapeID: this.$props.shapeID,
            constraintID: concatConstraint
          };
          this.$store.dispatch("deleteConstraintFromShapeWithID", args);

          /* Save the state to undo later. */
          this.$store.commit("saveOperation", {
            state: this.$store.state,
            action: { type: "deleteConstraintFromShapeWithID", args }
          });
        }
      } else {
        const args = {
          shapeID: this.$props.shapeID,
          constraintID: this.$props.constraintID
        };
        this.$store.dispatch("deleteConstraintFromShapeWithID", args);

        /* Save the state to undo later. */
        this.$store.commit("saveOperation", {
          state: this.$store.state,
          action: { type: "deleteConstraintFromShapeWithID", args }
        });
      }
      this.$store.commit("updateYValues", {
        shapeID: this.$props.shapeID,
        shapes: this.$store.state.mShape.model
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

    getTextConfig() {
      const key = this.$props.constraintID;
      let text;
      if (!this.$props.isConcat) {
        let value = this.getConstraintValues();

        if (value.length === 1) {
          const val = value[0];
          value = val;
        }

        const keyText = uriToPrefix(this.$store.state.mConfig.namespaces, key);
        const valueText = uriToPrefix(this.$store.state.mConfig.namespaces, value);

        const textMap = {
          [TERM.languageIn]: value =>
            `languageIn(${value.map(x => `'${x}'`).join(", ")})`,
          [TERM.closed]: () => `onlyListedProperties(${valueText})`,
          [TERM.ignoredProperties]: value =>
            `otherAllowedProperties(${value.map(x => `'${x}'`).join(", ")})`,
          [TERM.in]: value => `valueIn(${value.map(x => `'${x}'`).join(", ")})`,
          [TERM.pattern]: value => `${keyText}("${valueText}")`
        };

        if (textMap[key]) {
          text = textMap[key](value);
        } else {
          text = `${keyText}(${valueText})`;
        }
      } else if (key === "range") {
        text = this.getRangeText();
      } else if (key === "length") {
        text = this.getLengthText();
      }
      return {
        ...this.keyConfig,
        text
      };
    },

    getRangeText() {
      const rangeConstraints = this.$store.getters.rangeVOWLConstraints(
        this.$props.shapeID
      );
      const rangeKeys = Object.keys(rangeConstraints);

      let start = 0;
      let end = "*";
      if (rangeKeys.includes(TERM.minExclusive)) {
        start =
          Number.parseInt(rangeConstraints[TERM.minExclusive][0]["@value"]) + 1;
      } else if (rangeKeys.includes(TERM.minInclusive)) {
        start = Number.parseInt(
          rangeConstraints[TERM.minInclusive][0]["@value"]
        );
      }

      if (rangeKeys.includes(TERM.maxExclusive)) {
        end =
          Number.parseInt(rangeConstraints[TERM.maxExclusive][0]["@value"]) - 1;
      } else if (rangeKeys.includes(TERM.maxInclusive)) {
        end = Number.parseInt(rangeConstraints[TERM.maxInclusive][0]["@value"]);
      }
      return `range(${start}..${end})`;
    },

    getLengthText() {
      const lengthConstraints = this.$store.getters.lengthVOWLConstraints(
        this.$props.shapeID
      );
      const lengthKeys = Object.keys(lengthConstraints);

      let start = 0;
      let end = "*";
      if (lengthKeys.includes(TERM.minLength)) {
        start = Number.parseInt(lengthConstraints[TERM.minLength][0]["@value"]);
      }
      if (lengthKeys.includes(TERM.maxLength)) {
        end = Number.parseInt(lengthConstraints[TERM.maxLength][0]["@value"]);
      }

      return `length(${start}..${end})`;
    },

    getDeleteConfig() {
      const y = 0;

      return {
        ...this.deleteConstraintConfig,
        y: this.deleteConstraintConfig.y + y
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
