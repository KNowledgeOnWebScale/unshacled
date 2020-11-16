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
        <!-- Shape label & uri -->
        <v-group @click="startEditing">
          <v-ellipse
            v-if="shapeKind === 1"
            :config="getShapeConfig()"
          ></v-ellipse>
          <v-rect v-if="shapeKind === 2" :config="getShapeConfig()"></v-rect>
          <v-text ref="upperLabel" :config="getUpperLabelConfig()"></v-text>
          <v-text ref="centerLabel" :config="getCenterLabelConfig()"></v-text>
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

      <!-- An icon, if one is needed -->
      <v-image v-if="icon !== 'none'" :config="iconConfig"></v-image>

      <v-group
        ref="constraints"
        :draggable="true"
        :config="getDefaultConstraintsConfig()"
        @dragmove="transLateToShape"
        @dragend="updateConstraintCoordinates()"
      >
        <property-group
          :shape-id="$props.id"
          :node-shape="$props.nodeShape"
          @new-height="setPropertyGroupHeight"
        ></property-group>
      </v-group>
    </v-group>
  </div>
</template>

<script>
import PropertyGroup from "./PropertyGroup.vue";
import { uriToPrefix } from "../../../util/urlParser";
import {
  pointerCursor,
  resetCursor,
  textCursor,
  HEIGHT,
  SUBJECT_HR_LABEL_CONFIG,
  SUBJECT_URI_TEXT_CONFIG_VOWL,
  HEIGHT_VOWL,
  WIDTH_VOWL,
  CENTER_SHAPE_VOWL_X,
  CENTER_SHAPE_VOWL_Y,
  NOTE_INSET_VOWL,
  NOTE_WIDTH_VOWL,
  NOTE_ICON_SIZE_VOWL,
  NOTE_MARGIN_VOWL,
  RELATIONSHIP_DASH_ARRAY,
  CLOSED_BORDER_WIDTH_VOWL,
  BORDER_WIDTH_VOWL,
  MARGIN_VOWL,
  RDF_RESOURCE_SHAPE_CONFIG,
  LITERAL_SHAPE_CONFIG,
  HEIGHT_LITERAL_VOWL,
  DELETE_BUTTON_CONFIG_VOWL_RDF,
  DELETE_BUTTON_CONFIG_VOWL_LITERAL,
  ADD_PREDICATE_CONFIG_VOWL_RDF,
  ADD_PREDICATE_CONFIG_VOWL_LITERAL,
  TEXT_CONFIG_VOWL,
  TEXT_SIZE
} from "../../../config/konvaConfigs";
import { TERM } from "../../../translation/terminology";
import { abbreviate } from "../../../util/strings";
import { LABEL, VOWL_SHAPE_KIND } from "../../../util/constants";
import {
  getDefaultEllipsePosition,
  getPropertyGroupBounds
} from "../../../util/calculations";

export default {
  name: "Shape",
  components: { PropertyGroup },
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
      required: false,
      default: false
    }
  },
  data() {
    return {
      hover: false,
      titleHover: false,
      shapeConfig:
        this.shapeKind === VOWL_SHAPE_KIND.RDF_RESOURCE
          ? RDF_RESOURCE_SHAPE_CONFIG
          : LITERAL_SHAPE_CONFIG,
      constraintsHeight: 0,
      iconImage: new Image(NOTE_ICON_SIZE_VOWL, NOTE_ICON_SIZE_VOWL)
    };
  },
  computed: {
    icon() {
      const iconConstraints = this.$store.getters.shapeIconVOWLConstraints(
        this.$props.id
      );
      const iconKeys = Object.keys(iconConstraints);
      if (iconKeys.length) {
        const iconMap = {
          [TERM.class]: "class",
          [TERM.datatype]: "datatype"
        };
        return iconMap[iconKeys[0]];
      } else {
        return "none";
      }
    },

    iconConfig() {
      const isRDF = this.shapeKind === VOWL_SHAPE_KIND.RDF_RESOURCE;
      return {
        x: 2 * NOTE_MARGIN_VOWL,
        y: isRDF ? CENTER_SHAPE_VOWL_Y - NOTE_ICON_SIZE_VOWL / 2 : HEIGHT_LITERAL_VOWL / 2 - NOTE_ICON_SIZE_VOWL / 2,
        image: this.iconImage,
        width: NOTE_ICON_SIZE_VOWL,
        height: NOTE_ICON_SIZE_VOWL
      };
    },

    shapeKind() {
      return this.$store.getters.getShapeKind(this.$props.id);
    },

    deleteNodeConfig() {
      return this.shapeKind === VOWL_SHAPE_KIND.RDF_RESOURCE
        ? DELETE_BUTTON_CONFIG_VOWL_RDF
        : DELETE_BUTTON_CONFIG_VOWL_LITERAL;
    },

    addPredicateConfig() {
      return this.shapeKind === VOWL_SHAPE_KIND.RDF_RESOURCE
        ? ADD_PREDICATE_CONFIG_VOWL_RDF
        : ADD_PREDICATE_CONFIG_VOWL_LITERAL;
    }
  },
  mounted() {
    const self = this;
    const { id } = this.$props;
    /* Move the shape to the defined coordinate. */
    this.$refs.posRef
      .getNode()
      .setPosition(this.$store.state.mShape.mCoordinate.coordinates[id]);
    this.updatePosition();
    this.updateConstraintCoordinates();

    const { icon } = this;
    if (icon !== "none") {
      this.iconImage.src = `/icons/${icon}.svg`;
    }

    /* Update the constraints when the store state changes. */
    this.$store.watch(
      () => self.$store.getters.shapeConstraints(self.$props.id),
      () => self.$store.getters.shapeInfo(self.$props.id),
      () => {
        self.getConstraints();
      }
    );
  },
  methods: {
    getShapeConfig() {
      const config =
        this.shapeKind === VOWL_SHAPE_KIND.RDF_RESOURCE
          ? RDF_RESOURCE_SHAPE_CONFIG
          : LITERAL_SHAPE_CONFIG;

      return {
        ...config,
        strokeWidth: this.isClosed()
          ? CLOSED_BORDER_WIDTH_VOWL
          : BORDER_WIDTH_VOWL,
        stroke: this.getBorderColor(),
        dashEnabled: this.isDeactivated(),
        dash: RELATIONSHIP_DASH_ARRAY
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

    isClosed() {
      return this.$store.getters.isClosed(this.$props.id);
    },

    isDeactivated() {
      return this.$store.getters.isDeactivated(this.$props.id);
    },

    /**
     * Create the upper label text configuration object.
     * The upper label is only used for subject shapes / node shapes in ShapeVOWL,
     * this label contains a bold human readable label, if one is present.
     * The object shapes don't use this, since they put this human readable label in the relationship label.
     * @returns {object} the configuration object for the upper label.
     */
    getUpperLabelConfig() {
      if (this.$props.nodeShape) {
        // Subject shape, should have a bold human readable label in the upper label, if one is present.
        const label = this.$store.getters.labelsForIds[this.id];
        const text = label ? abbreviate(label) : "";
        return {
          ...SUBJECT_HR_LABEL_CONFIG,
          text
        };
      }
    },

    /**
     * Create the center label text configuration object.
     * This is used by both subject and object shapes.
     * Subject shapes use this to display their own IRI.
     * Object shapes use this to display the IRI of sh:datatype or sh:class,
     * if they have that property, otherwise, this label is empty.
     * For object shapes, a distinction also has to be made between the RDF Resource shape kind
     * and the Literal shape kind, since they have to put the label at a different y.
     * @returns {object} the configuration object for the center label.
     */
    getCenterLabelConfig() {
      if (this.$props.nodeShape) {
        const text = uriToPrefix(this.$store.state.mConfig.namespaces, this.$props.id);
        return {
          ...SUBJECT_URI_TEXT_CONFIG_VOWL,
          text
        };
      } else {
        const text = this.icon === "class" || this.icon === "datatype"
          ? this.getShapeKindURI()
          : "";
        const baseConfig = {
          ...TEXT_CONFIG_VOWL,
          align: "left",
          width: WIDTH_VOWL - NOTE_ICON_SIZE_VOWL - 2 * MARGIN_VOWL,
          x: NOTE_ICON_SIZE_VOWL + 2 * MARGIN_VOWL,
          text
        };
        if (this.shapeKind === VOWL_SHAPE_KIND.RDF_RESOURCE) {
          return {
            ...baseConfig,
            y: CENTER_SHAPE_VOWL_Y - TEXT_SIZE / 2,
          };
        } else {
          return {
            ...baseConfig,
            y: HEIGHT_LITERAL_VOWL / 2 - TEXT_SIZE / 2,
          };
        }
      }
    },

    getShapeKindURI() {
      const shape = this.$store.getters.shapeWithID(this.$props.id);
      if (shape) {
        const iconProp = this.icon === "class" ? TERM.class : TERM.datatype;
        const classProp = shape[iconProp];
        if (classProp) {
          return uriToPrefix(
            this.$store.state.mConfig.namespaces,
            classProp[0]["@id"]
          );
        }
      }
      return "";
    },

    getNoteLength() {
      const infoAmount = this.$store.getters.getInfoAmount(this.id);
      const constraintAmount = this.$store.getters.getConstraintAmount(this.id);

      return (infoAmount + constraintAmount) * HEIGHT;
    },

    setPropertyGroupHeight(newHeight) {
      this.constraintsHeight = newHeight;
    },

    transLateToShape() {
      const propertyGroup = this.$refs.constraints.getNode();

      const constraintsRectangle = {
        x: propertyGroup.x(),
        y: propertyGroup.y(),
        width: NOTE_WIDTH_VOWL,
        height: this.constraintsHeight
      };

      const shape =
        this.shapeKind === VOWL_SHAPE_KIND.RDF_RESOURCE
          ? {
              x: CENTER_SHAPE_VOWL_X,
              y: CENTER_SHAPE_VOWL_Y,
              width: WIDTH_VOWL * NOTE_INSET_VOWL,
              height: HEIGHT_VOWL * NOTE_INSET_VOWL
            }
          : {
              x: 0,
              y: 0,
              width: WIDTH_VOWL,
              height: HEIGHT_LITERAL_VOWL
            };

      const newCoords = getPropertyGroupBounds(
        this.shapeKind,
        constraintsRectangle,
        shape
      );
      if (!(Number.isNaN(newCoords.x) || Number.isNaN(newCoords.y))) {
        propertyGroup.x(newCoords.x);
        propertyGroup.y(newCoords.y);
      }
    },

    updateConstraintCoordinates() {
      const constraints = this.$refs.constraints.getNode();

      if (constraints) {
        this.$store.commit("updateVOWLConstraintCoordinates", {
          shapeID: this.$props.id,
          x: constraints.x(),
          y: constraints.y()
        });
      }
    },

    /**
     * Returns default position for the PropertyGroup constraints container
     * @returns {Object} Object containing an x and y value of the default position for PropertyGroup
     */
    getDefaultConstraintsConfig() {
      const {
        VOWLconstraintCoordinates
      } = this.$store.state.mShape.mCoordinate;
      if (VOWLconstraintCoordinates[this.$props.id]) {
        return VOWLconstraintCoordinates[this.$props.id];
      } else if (this.shapeKind === VOWL_SHAPE_KIND.RDF_RESOURCE) {
        const ellipse = {
          x: CENTER_SHAPE_VOWL_X,
          y: CENTER_SHAPE_VOWL_Y,
          width: WIDTH_VOWL * NOTE_INSET_VOWL,
          height: HEIGHT_VOWL * NOTE_INSET_VOWL
        };
        return getDefaultEllipsePosition(ellipse);
      } else {
        return {
          x: 0,
          y: HEIGHT_LITERAL_VOWL + MARGIN_VOWL
        };
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
        shapeType: this.$props.nodeShape ? "NodeShape" : "PropertyShape",
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
        nodeShape: this.$props.nodeShape
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
