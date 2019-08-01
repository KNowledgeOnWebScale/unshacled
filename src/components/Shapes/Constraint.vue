<template>
  <v-group>
    <v-rect :config="rectangleConfig"></v-rect>
    <v-text ref="key" :config="keyConfig"></v-text>
    <v-line :config="lineConfig"></v-line>
    <v-text ref="value" :config="valueConfig"></v-text>
    <v-circle
      v-if="this.$props.hover"
      :config="this.$props.deleteConstraintConfig"
      @click="deleteConstraint"
    ></v-circle>
  </v-group>
</template>

<script>
import {
  HEIGHT,
  CONSTRAINT_SEPARATION_LINE,
  WIDTH
} from "../../util/konvaConfigs";
import { urlToName } from "../../parsing/urlParser";

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
    stroke: {
      type: String,
      required: false,
      default: "black"
    },
    constraintConfig: {
      type: Object,
      required: true
    },
    constraintTextConfig: {
      type: Object,
      required: true
    },
    deleteConstraintConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    const { x, y } = this.$props.constraintConfig;
    return {
      lineConfig: {
        ...CONSTRAINT_SEPARATION_LINE,
        points: [x, y + HEIGHT, x + WIDTH, y + HEIGHT] // [x1, y1, x2, y2]
      },
      rectangleConfig: {
        ...this.$props.constraintConfig,
        stroke: this.$props.stroke
      },
      keyConfig: {
        ...this.$props.constraintTextConfig,
        fontStyle: "italic",
        text: urlToName(this.$props.constraintID)
      },
      valueConfig: {
        ...this.$props.constraintTextConfig,
        y: this.$props.constraintTextConfig.y + HEIGHT,
        text: this.getConstraintValue()
      }
    };
  },
  mounted() {
    const self = this;
    // Update the text value whenever the shape has changed.
    this.$store.watch(
      () => self.$store.getters.shapeConstraints(self.$props.shape),
      () => self.updateConfigs()
    );
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
