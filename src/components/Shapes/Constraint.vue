<template>
  <v-group>
    <v-rect :config="this.$props.constraintConfig"></v-rect>
    <v-text ref="key" :config="keyConfig"></v-text>
    <v-text ref="value" :config="valueConfig"></v-text>
    <v-circle
      v-if="this.$props.hover"
      :config="this.$props.deletePropConfig"
      @click="deleteConstraint"
    ></v-circle>
  </v-group>
</template>

<script>
import { HEIGHT } from "../../util/konvaConfigs";
import { urlToName } from "../../util/nameParser";

export default {
  name: "Constraint",
  props: {
    shape: {
      type: String,
      required: true
    },
    constraintID: {
      type: String,
      required: true
    },
    hover: {
      type: Boolean,
      required: true
    },
    constraintConfig: {
      type: Object,
      required: true
    },
    propTextConfig: {
      type: Object,
      required: true
    },
    deletePropConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      keyConfig: {
        ...this.$props.propTextConfig,
        fontStyle: "italic",
        text: urlToName(this.$props.constraintID)
      },
      valueConfig: {
        ...this.$props.propTextConfig,
        y: this.$props.propTextConfig.y + HEIGHT,
        text: this.getConstraintValue()
      }
    };
  },
  methods: {
    /**
     * Delete the current constraint from its shape.
     */
    deleteConstraint() {
      const args = {
        shapeID: this.$props.shape,
        constraint: this.$props.constraintID
      };
      this.$store.dispatch("deleteConstraintFromShape", args);
    },

    /**
     * Get the value of the current constraint.
     * @returns {[]|*} array or string, depending to the number of values.
     */
    getConstraintValue() {
      const value = this.$store.getters.shapeConstraints(this.$props.shape)[
        this.$props.constraintID
      ];

      // Check if there is more than one value.
      if (value.length > 1) {
        // Transform the list.
        const output = [];
        for (const element of value) {
          // Extract each elemet's name.
          output.push(urlToName(element));
        }
        return output;
      } else if (value.length === 0) {
        // The constraint has no value.
        return "(empty)";
      } else {
        // Get the ID and extract the name.
        return urlToName(value[0]["@id"]);
      }
    }
  }
};
</script>

<style scoped></style>
