<template>
  <v-group @mouseenter="hover = true" @mouseleave="hover = false">
    <v-arrow ref="arrow" :config="getLineConfig()"></v-arrow>
    <v-circle
      v-if="hover"
      :config="getButtonConfig()"
      @click="click()"
    ></v-circle>
  </v-group>
</template>

<script>
import {
  DELETE_BUTTON_CONFIG,
  HEIGHT,
  RELATIONSHIP_CONFIG,
  WIDTH
} from "../../util/konvaConfigs";

export default {
  name: "Relationship",
  props: {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    onClickProps: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hover: false
    };
  },
  methods: {
    /**
     * Get the end points of the relationship line.
     * @returns {array}
     */
    getEndPoints() {
      const { from, to } = this.$props;
      const { coordinates } = this.$store.state.mShape.mCoordinate;
      const start = coordinates[from];
      const end = coordinates[to];
      return [
        start.x + WIDTH / 2,
        start.y + HEIGHT / 2,
        end.x + WIDTH / 2,
        end.y + HEIGHT / 2
      ];
    },

    /**
     * Get the button config for this relationship.
     */
    getButtonConfig() {
      const arrow = this.$refs.arrow.getNode();
      const transform = arrow.getAbsoluteTransform().copy();
      transform.invert();
      const pointer = arrow.getStage().getPointerPosition();
      const relative = transform.point(pointer);
      return {
        ...DELETE_BUTTON_CONFIG,
        x: relative.x,
        y: relative.y
      };
    },

    /**
     * Get the line config for this relationship.
     */
    getLineConfig() {
      return {
        ...RELATIONSHIP_CONFIG,
        points: this.getEndPoints()
      };
    },

    /**
     * Call the delete function using the given arguments.
     */
    click() {
      this.$store.dispatch("deleteConstraintValue", this.$props.onClickProps);
    }
  }
};
</script>

<style scoped></style>
