<template>
  <div>
    <v-group
      ref="posRef"
      :draggable="true"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @dragmove="updatePosition"
    >
      <!-- Main ellipse -->
      <v-group @mouseenter="titleHover = true" @mouseleave="titleHover = false">
        <!-- Header -->
        <v-group @click="startEditing">
          <v-ellipse :config="getShapeConfig()"></v-ellipse>
          <v-text ref="shapeLabel" :config="getLabelTextConfig()"></v-text>
          <v-text ref="shapeURI" :config="getURITextConfig()"></v-text>
        </v-group>
      </v-group>

      <!-- Buttons -->
      <v-group>
        <v-circle
          v-if="hover"
          :config="deleteNodeConfig"
          @click="deleteShape"
          @mouseenter="setCursor('pointer')"
          @mouseleave="setCursor('')"
        ></v-circle>
        <v-circle
          v-if="hover"
          :config="addPredicateConfig"
          @click="addPredicate"
          @mouseenter="setCursor('pointer')"
          @mouseleave="setCursor('')"
        ></v-circle>
      </v-group>

      <!-- Information & constraints -->
      <v-group :v-if="getNoteLength() > 0" :config="getNoteConfig()">
        <note :length="getNoteLength()" :shape-id="this.$props.id" />
        <v-group :config="getConstraintsConfig()">
          <div v-for="(prop, key) in getShapeInfo()" :key="key">
            <constraint
              :constraint-i-d="key"
              :shape-i-d="$props.id"
              :node-shape="$props.nodeShape"
              :stroke="shapeConfig.stroke"
            ></constraint>
          </div>
          <div v-for="(prop, key) in getConstraints()" :key="key">
            <constraint
              :constraint-i-d="key"
              :shape-i-d="$props.id"
              :node-shape="$props.nodeShape"
              :stroke="shapeConfig.stroke"
            ></constraint>
          </div>
        </v-group>
      </v-group>
    </v-group>
  </div>
</template>

<script>
import Constraint from "./Constraint.vue";
import Note from "./Note.vue";
import { uriToPrefix } from "../../../util/urlParser";
import {
  TEXT_OFFSET,
  DESCRIPTION_RECT_CONFIG,
  DESCRIPTION_TITLE_CONFIG,
  DESCRIPTION_TEXT_CONFIG,
  MAX_LENGTH,
  TEXT_SIZE,
  pointerCursor,
  resetCursor,
  textCursor,
  HEIGHT,
  NODE_SHAPE_CONFIG_VOWL,
  PROPERTY_SHAPE_CONFIG_VOWL,
  SHAPE_CONFIG_VOWL,
  NAME_TEXT_CONFIG_VOWL,
  URI_TEXT_CONFIG_VOWL,
  DELETE_BUTTON_CONFIG_VOWL,
  ADD_PREDICATE_CONFIG_VOWL,
  HEIGHT_VOWL,
  WIDTH_VOWL,
  CENTER_SHAPE_VOWL_X,
  CENTER_SHAPE_VOWL_Y,
  NOTE_INSET_VOWL
} from "../../../config/konvaConfigs";
import { TERM } from "../../../translation/terminology";
import { abbreviate } from "../../../util/strings";
import { LABEL } from "../../../util/constants";
import { projectYOnEllipse } from "../../../util/calculations";

export default {
  name: "Shape",
  components: { Constraint, Note },
  props: {
    id: {
      type: String,
      required: true
    },
    hasType: {
      type: Boolean,
      required: true
    },
    nodeShape: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      hover: false,
      titleHover: false,
      shapeConfig: this.$props.nodeShape
        ? NODE_SHAPE_CONFIG_VOWL
        : PROPERTY_SHAPE_CONFIG_VOWL,
      deleteNodeConfig: DELETE_BUTTON_CONFIG_VOWL,
      addPredicateConfig: ADD_PREDICATE_CONFIG_VOWL
    };
  },
  mounted() {
    const self = this;
    const { id } = this.$props;
    /* Move the shape to the defined coordinate. */
    this.$refs.posRef
      .getNode()
      .setPosition(this.$store.state.mShape.mCoordinate.coordinates[id]);
    this.updatePosition();

    /* Update the constraints when the store state changes. */
    this.$store.watch(
      () => self.$store.getters.shapeConstraints(self.$props.id),
      () => self.$store.getters.shapeInfo(self.$props.id),
      () => {
        self.getConstraints();
        self.getDescriptionConfig();
      }
    );
  },
  methods: {
    getShapeConfig() {
      let config;
      if (this.$props.hasType) {
        if (this.$props.nodeShape) {
          config = NODE_SHAPE_CONFIG_VOWL;
        } else {
          config = PROPERTY_SHAPE_CONFIG_VOWL;
        }
      } else {
        config = SHAPE_CONFIG_VOWL;
      }

      return {
        ...config,
        stroke: this.getBorderColor()
      };
    },

    getBorderColor() {
      const info = this.$store.getters.shapeInfo(this.$props.id);
      if (info[TERM.severity]) {
        switch (info[TERM.severity][0]["@id"]) {
          case TERM.Info:
            return "#93c47d";
          case TERM.Warning:
            return "#ffd966";
          case TERM.Violation:
            return "#e06666";
          default:
            return "#e06666";
        }
      } else {
        return "#e06666";
      }
    },

    /**
     * Create the label text configuration object.
     * Abbreviate the text if needed and change the namespace URL to the prefix if possible.
     * @returns {object} the configuration object for the label.
     */
    getLabelTextConfig() {
      const label = this.$store.getters.labelsForIds[this.id];
      const text = label ? abbreviate(label) : "";
      return {
        ...NAME_TEXT_CONFIG_VOWL,
        text
      };
    },

    /**
     * Create the URI text configuration object.
     * Abbreviate the URI if needed.
     * @returns {object} the configuration of the URI.
     */
    getURITextConfig() {
      const uri = uriToPrefix(
        this.$store.state.mConfig.namespaces,
        this.$props.id
      );
      const text = uri[0] === "_" ? "" : uri;
      return {
        ...URI_TEXT_CONFIG_VOWL,
        text
      };
    },

    getNoteConfig() {
      return {
        y: HEIGHT_VOWL - NOTE_INSET_VOWL,
        x:
          projectYOnEllipse(
            HEIGHT_VOWL - NOTE_INSET_VOWL,
            HEIGHT_VOWL,
            WIDTH_VOWL,
            CENTER_SHAPE_VOWL_X,
            CENTER_SHAPE_VOWL_Y
          ) - NOTE_INSET_VOWL
      };
    },

    getNoteLength() {
      const infoAmount = this.$store.getters.getInfoAmount(this.id);
      const constraintAmount = this.$store.getters.getConstraintAmount(this.id);

      return (infoAmount + constraintAmount) * HEIGHT;
    },

    getConstraintsConfig() {
      return {
        x: -10,
        y: -30
      };
    },

    /**
     * Check if this shape has a description.
     * @returns {boolean} value that indicates if this shape has a description.
     */
    hasDescription() {
      const shape = this.$store.getters.shapeWithID(this.id);
      if (shape) {
        const constraint = shape[TERM.description];
        if (constraint) {
          const description = constraint[0]["@value"];
          return description && description !== "";
        }
      }
      return false;
    },

    /**
     * Get the configuration objects for the visualization of the description.
     * @returns {{rect: object, title: object, text: object}}
     */
    getDescriptionConfig() {
      /* Check if the shape has a description first. */
      if (this.hasDescription()) {
        const text = this.$store.getters.shapeWithID(this.id)[
          TERM.description
        ][0]["@value"];

        // Constants for the configuration.
        let lines = Math.ceil(text.length / MAX_LENGTH);
        if (lines < 2) lines = 2;

        return {
          rect: {
            ...DESCRIPTION_RECT_CONFIG,
            height: lines * TEXT_SIZE + TEXT_OFFSET
          },
          title: DESCRIPTION_TITLE_CONFIG,
          text: {
            ...DESCRIPTION_TEXT_CONFIG,
            text
          }
        };
      }

      /* If the shape does not have a description, no configurations are needed. */
      return {
        rect: {},
        title: {},
        text: {}
      };
    },

    /**
     * Get an object containing all the constraints.
     * @returns {object} an object mapping every constraint name to a (list of) values.
     */
    getConstraints() {
      return this.$store.getters.shapeConstraints(this.$props.id);
    },

    /**
     * Get an object containing all the information about the shape.
     * @returns {object} an object mapping every informative constraint name to a (list of) values.
     */
    getShapeInfo() {
      return this.$store.getters.shapeInfo(this.$props.id);
    },

    /**
     * Takes the coordinates from this node shape and calls store to update them.
     */
    updatePosition() {
      /* Determine the current position. */
      const pos = this.$refs.posRef.getNode().position();
      /* Update the y values of the components relative to this shape. */
      this.$store.commit("updateYValues", {
        shapeID: this.$props.id,
        shapes: this.$store.state.mShape.model
      });
      /* Update the coordinates of this shape. */
      this.$store.commit("updateCoordinates", {
        shapeID: this.$props.id,
        shapes: this.$store.state.mShape.model,
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
     * Toggle the shape modal to start editing this shape's properties.
     */
    startEditing() {
      const shape = this.$store.getters.shapeWithID(this.id);

      /* Get the label and its language. */
      const labelConstraint = shape[TERM.name]
        ? shape[TERM.name]
        : shape[LABEL]
        ? shape[LABEL]
        : null;
      const label = labelConstraint ? labelConstraint[0]["@value"] : "";
      const labelLang = labelConstraint
        ? labelConstraint[0]["@language"]
        : "en";

      /* Get the description and its language. */
      const description = shape[TERM.description]
        ? shape[TERM.description][0]["@value"]
        : "";
      const descrLang = shape[TERM.description]
        ? shape[TERM.description][0]["@language"]
        : "en";

      /* Toggle the modal. */
      this.$store.commit("toggleEditShapeModal", {
        id: this.id,
        label,
        labelLang,
        description,
        descrLang,
        nodeShape: this.nodeShape
      });
    },

    /**
     * Delete this shape.
     */
    deleteShape() {
      const action = this.$props.nodeShape
        ? "deleteNodeShape"
        : "deletePropertyShape";
      this.$store.dispatch(action, this.$props.id);
      /* Save the state to undo later. */
      this.$store.commit("saveOperation", {
        state: this.$store.state,
        action: {
          type: action,
          args: this.$props.id
        }
      });
    },

    /**
     * Set the cursor type according to the passed argument.
     * @param {string} type "pointer" || "text" || *: the type of cursor we want to use.
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
