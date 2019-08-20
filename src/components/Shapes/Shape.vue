<template>
  <div>
    <v-group
      ref="posRef"
      :draggable="true"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @dragmove="updatePosition"
    >
      <v-group @mouseenter="titleHover = true" @mouseleave="titleHover = false">
        <!-- Header -->
        <v-group @click="startEditing">
          <v-rect :config="shapeConfig"></v-rect>
          <v-text ref="shapeLabel" :config="getLabelTextConfig()"></v-text>
          <v-text ref="shapeURI" :config="getURITextConfig()"></v-text>
        </v-group>

        <!-- Description -->
        <v-group v-if="hasDescription() && titleHover">
          <v-rect :config="getDescriptionConfig().rect"></v-rect>
          <v-text :config="getDescriptionConfig().title"></v-text>
          <v-text :config="getDescriptionConfig().text"></v-text>
        </v-group>
      </v-group>

      <!-- Buttons -->
      <v-group>
        <v-circle
          v-if="hover"
          :config="deleteNodeConfig"
          @click="deleteShape"
        ></v-circle>
        <v-circle
          v-if="hover && !adding"
          :config="addPredicateConfig"
          @mousedown="addPredicate"
        ></v-circle>
      </v-group>

      <!-- Constraints -->
      <div v-for="(prop, key) in getConstraints()" :key="key">
        <constraint
          :constraint-i-d="key"
          :shape-i-d="$props.id"
          :node-shape="$props.nodeShape"
          :stroke="shapeConfig.stroke"
        ></constraint>
      </div>
    </v-group>
  </div>
</template>

<script>
import Constraint from "./Constraint.vue";
import { urlToName } from "../../util/urlParser";
import {
  DELETE_BUTTON_CONFIG,
  LABEL_TEXT_CONFIG,
  NODE_SHAPE_CONFIG,
  PROPERTY_SHAPE_CONFIG,
  ADD_PREDICATE_CONFIG,
  URI_TEXT_CONFIG,
  TEXT_OFFSET,
  OFFSET,
  DESCRIPTION_RECT_CONFIG,
  DESCRIPTION_TEXT_CONFIG,
  MAX_LENGTH,
  TEXT_SIZE,
  WIDTH,
  MARGIN
} from "../../util/konvaConfigs";
import { TERM } from "../../translation/terminology";
import { abbreviate } from "../../util/strings";

export default {
  name: "Shape",
  components: { Constraint },
  props: {
    id: {
      type: String,
      required: true
    },
    nodeShape: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      hover: false,
      titleHover: false,
      editing: false,
      adding: false,
      shapeConfig: this.$props.nodeShape
        ? NODE_SHAPE_CONFIG
        : PROPERTY_SHAPE_CONFIG,
      deleteNodeConfig: DELETE_BUTTON_CONFIG,
      idTextConfig: {
        ...LABEL_TEXT_CONFIG,
        text: urlToName(this.$props.id)
      },
      addPredicateConfig: ADD_PREDICATE_CONFIG
    };
  },
  mounted() {
    const self = this;
    const { id } = this.$props;
    // Move the shape to the defined coordinate.
    this.$refs.posRef
      .getNode()
      .setPosition(this.$store.state.mShape.mCoordinate.coordinates[id]);
    this.updatePosition();

    this.$store.watch(
      () => self.$store.getters.shapeConstraints(self.$props.id),
      () => {
        self.getConstraints();
        self.getDescriptionConfig();
      }
    );
  },
  methods: {
    /**
     * @returns {{}} the configuration of the main text
     */
    getLabelTextConfig() {
      const label = this.$store.getters.labelForId(this.id);
      const text = label ? abbreviate(label) : abbreviate(urlToName(this.id));
      return {
        ...LABEL_TEXT_CONFIG,
        y: label ? OFFSET : TEXT_OFFSET,
        text
      };
    },

    /**
     * @returns {{}} the configuration of the URI
     */
    getURITextConfig() {
      const label = this.$store.getters.labelForId(this.id);
      const text = label ? abbreviate(this.id) : "";
      return { ...URI_TEXT_CONFIG, text };
    },

    /**
     * @returns {boolean} value that indicates if this shape has a description.
     */
    hasDescription() {
      const d = this.$store.getters.shapeWithID(this.id)[TERM.description];
      if (d) {
        const description = d[0]["@value"];
        return description && description !== "";
      }
      return false;
    },

    /**
     * Get the configuration for the visualization of the description.
     */
    getDescriptionConfig() {
      // Check if the shape has a description.
      if (this.hasDescription()) {
        const text = this.$store.getters.shapeWithID(this.id)[
          TERM.description
        ][0]["@value"];

        // Constants for the configuration.
        const x = WIDTH + MARGIN;
        const textX = x + 2 * MARGIN;
        const offset = TEXT_OFFSET / 2;
        let lines = Math.ceil(text.length / MAX_LENGTH);
        if (lines < 2) lines = 2;

        return {
          rect: {
            ...DESCRIPTION_RECT_CONFIG,
            x,
            height: lines * TEXT_SIZE + TEXT_OFFSET,
            width: WIDTH + 4 * MARGIN
          },
          title: {
            ...DESCRIPTION_TEXT_CONFIG,
            text: "Description",
            fontStyle: "bold",
            x: textX,
            y: offset
          },
          text: {
            ...DESCRIPTION_TEXT_CONFIG,
            x: textX,
            y: offset + TEXT_OFFSET,
            width: WIDTH,
            text
          }
        };
      }

      // If the shape does not have a description, do not return any configuration.
      return {
        rect: {},
        title: {},
        text: {}
      };
    },

    /**
     * Get an object containing all the constraints.
     * @returns an object mapping every constraint name to a (list of) values.
     */
    getConstraints() {
      return this.$store.getters.shapeConstraints(this.$props.id);
    },

    /**
     * Takes the coordinates from this node shape and calls store to update them.
     */
    updatePosition() {
      const pos = this.$refs.posRef.getNode().position();
      this.$store.commit("updateYValues", {
        shapeID: this.$props.id,
        shapes: this.$store.state.mShape.model
      });
      this.$store.commit("updateCoordinates", {
        shapeID: this.$props.id,
        x: pos.x,
        y: pos.y
      });
    },

    /**
     * Toggle the predicate model to add a constraint to this shape.
     */
    addPredicate() {
      this.$store.commit("resetPredicateModal");
      this.$store.commit("togglePredicateModal", {
        shapeID: this.id,
        shapeType: this.nodeShape ? "NodeShape" : "PropertyShape",
        onExit: "addPredicate",
        editing: false
      });
    },

    /**
     * Call the ReactiveInput component to start editing using the given text node.
     */
    startEditing() {
      const shape = this.$store.getters.shapeWithID(this.id);
      const description = shape[TERM.description]
        ? shape[TERM.description][0]["@value"]
        : "";
      this.$store.commit("toggleEditShapeModal", {
        id: this.id,
        label: this.$store.getters.labelForId(this.id),
        description,
        nodeShape: this.nodeShape
      });
    },

    /**
     * Stop editing.
     * Check if the filled in value is valid and unique.
     * Call the store to edit the node shape if possible.
     */
    stopEditing(newValue) {
      // Check if the new value is valid and unique.
      if (newValue !== "" && !this.$store.getters.shapes[newValue]) {
        const args = {
          oldID: this.$props.id,
          newID: newValue
        };
        // if (this.$props.nodeShape) {
        //   this.$store.dispatch("editNodeShape", args);
        // } else {
        this.$store.dispatch("editPropertyShape", args);
        // }
      }
    },

    /**
     * Delete this node shape.
     */
    deleteShape() {
      if (this.$refs.reactiveInput) this.$refs.reactiveInput.stopEditing();
      const action = this.$props.nodeShape
        ? "deleteNodeShape"
        : "deletePropertyShape";
      this.$store.dispatch(action, this.$props.id);
    }
  }
};
</script>

<style scoped></style>
