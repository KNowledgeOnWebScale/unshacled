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
          <v-text
            ref="shapeLabel"
            :config="getLabelTextConfig()"
            @mouseenter="setCursor('text')"
            @mouseleave="setCursor('')"
          ></v-text>
          <v-text ref="shapeURI" :config="getURITextConfig()"></v-text>
        </v-group>

        <!-- Description -->
        <v-group v-show="hasDescription() && titleHover">
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
      
      <!-- Shape information -->
      <v-group>
        <v-rect :config="getInfoShapeConfig()"></v-rect>
        <div v-for="(prop, key) in getShapeInfo()" :key="key">
          <constraint
            :constraint-i-d="key"
            :shape-i-d="$props.id"
            :node-shape="$props.nodeShape"
            :stroke="shapeConfig.stroke"
          ></constraint>
        </div>
      </v-group>

      <!-- Constraints -->
      <v-group>
        <v-rect :config="getConstraintShapeConfig()"></v-rect>
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
  </div>
</template>

<script>
import Constraint from "./Constraint.vue";
import { uriToPrefix } from "../../util/urlParser";
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
  DESCRIPTION_TITLE_CONFIG,
  DESCRIPTION_TEXT_CONFIG,
  PROPERTY_RECT_CONFIG,
  MAX_LENGTH,
  TEXT_SIZE,
  pointerCursor,
  resetCursor,
  textCursor,
  SHAPE_CONFIG,
  HEIGHT_HEADER,
  HEIGHT
} from "../../config/konvaConfigs";
import { TERM } from "../../translation/terminology";
import { abbreviate } from "../../util/strings";
import { LABEL } from "../../util/constants";

export default {
  name: "Shape",
  components: { Constraint },
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
  /**
   * Hover {boolean} indicates if the user is hovering over this shape.
   * TitleHover {boolean} indicates if the user is hovering over the title of this shape.
   * ShapeConfig {object} configuration object for the rectangle of the shape.
   * DeleteNodeConfig {object} configuration of the delete button.
   * IDTextConfig {object} configuration of the ID text.
   * AddPredicateConfig {object} configuration of the "add predicate"-button
   * @returns {{hover: boolean, titleHover: boolean, shapeConfig: object, deleteNodeConfig: object, idTextConfig: object, addPredicateConfig: object}}}
   */
  data() {
    return {
      hover: false,
      titleHover: false,
      shapeConfig: this.$props.nodeShape
        ? NODE_SHAPE_CONFIG
        : PROPERTY_SHAPE_CONFIG,
      shapeLabel: this.$props.hasType
        ? this.$props.nodeShape
        ? "<<NodeConditions>>"
        : "<<PropertyConditions>>"
        : "<<Conditions>>",
      deleteNodeConfig: DELETE_BUTTON_CONFIG,
      idTextConfig: {
        ...LABEL_TEXT_CONFIG,
        text: uriToPrefix(this.$store.state.mConfig.namespaces, this.$props.id)
      },
      addPredicateConfig: ADD_PREDICATE_CONFIG
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
    /**
     * Create the label text configuration object.
     * Abbreviate the text if needed and change the namespace URL to the prefix if possible.
     * @returns {object} the configuration object for the label.
     */
    getLabelTextConfig() {
      const label = this.$store.getters.labelsForIds[this.id];
      const text = this.shapeLabel;
      return {
        ...LABEL_TEXT_CONFIG,
        y: label ? OFFSET : TEXT_OFFSET,
        text
      };
    },

    /**
     * Create the URI text configuration object.
     * Abbreviate the URI if needed.
     * @returns {object} the configuration of the URI.
     */
    getURITextConfig() {
      const label = this.$store.getters.labelsForIds[this.id];
      const text = label ? abbreviate(label) : "";
      return { ...URI_TEXT_CONFIG, text };
    },

    /**
     * Get the config for the rectangle around the shape information
     * the y value starts below the header
     * the height is the amount of information properties * the common height of a property box
     * @returns {object} the configuration for the rectangle around the shape information
     */
    getInfoShapeConfig() {
      const infoAmount = this.$store.getters.getInfoAmount(this.id);
      return {
        ...PROPERTY_RECT_CONFIG,
        height: infoAmount ? infoAmount * HEIGHT : HEIGHT,
        y: HEIGHT_HEADER
      }
    },

    /**
     * Get the config for the rectangle around the shape constraints
     * the y value starts below the information rectangle
     * the height is the amount of constraints * the common height of a property box
     * @returns {object} the configuration for the rectangle around the shape constraints
     */
    getConstraintShapeConfig() {
      const infoAmount = this.$store.getters.getInfoAmount(this.id);
      const constraintAmount = this.$store.getters.getConstraintAmount(this.id);
      return {
        ...PROPERTY_RECT_CONFIG,
        height: constraintAmount ? constraintAmount * HEIGHT : HEIGHT,
        y: infoAmount ? HEIGHT_HEADER + (infoAmount * HEIGHT) : HEIGHT_HEADER + HEIGHT
      }
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
      // console.log(this.$store.getters.shapeInfo(this.$props.id));
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
