<template>
  <v-group>
    <v-rect :config="this.$props.constraintConfig"></v-rect>
    <v-text ref="key" :config="keyConfig"></v-text>
    <v-text ref="value" :config="valueConfig"></v-text>
    <v-circle
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
    deleteConstraint() {
      const args = {
        shapeID: this.$props.shape,
        constraint: this.$props.constraintID
      };
      this.$store.dispatch("deleteConstraintFromShape", args);
    },
    getConstraintValue() {
      const constraints = this.$store.getters.shapeConstraints(
        this.$props.shape
      );
      return urlToName(constraints[this.$props.constraintID][0]["@id"]);
    }
  }
};
</script>

<style scoped></style>
