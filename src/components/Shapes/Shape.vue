<template>
  <div>
    <reactive-input
      ref="reactiveInput"
      :is-datalist="false"
      :on-exit="stopEditing"
    ></reactive-input>

    <v-group
      ref="posRef"
      :draggable="true"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @dragmove="updateCoordinates"
    >
      <v-rect :config="shapeConfig"></v-rect>
      <v-text
        ref="shapeID"
        :config="idTextConfig"
        @click="startEditing"
      ></v-text>
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

      <div v-for="(prop, key) in getConstraints()" :key="key">
        <constraint
          :constraint-i-d="key"
          :shape="$props.id"
          :hover="hover"
          :stroke="shapeConfig.stroke"
          :constraint-config="constraintConfigs[key]"
          :constraint-text-config="constraintTextConfigs[key]"
          :delete-constraint-config="deleteConstraintConfigs[key]"
        ></constraint>
      </div>
    </v-group>
  </div>
</template>

<script>
import Constraint from "./Constraint.vue";
import ReactiveInput from "../FormElements/ReactiveInput.vue";
import { urlToName } from "../../parsing/urlParser";
import {
  DELETE_BUTTON_CONFIG,
  ID_TEXT_CONFIG,
  CONSTRAINT_TEXT_CONFIG,
  CONSTRAINT_CONFIG,
  NODE_SHAPE_CONFIG,
  PROPERTY_SHAPE_CONFIG,
  ADD_PREDICATE_CONFIG
} from "../../util/konvaConfigs";

const DELTA_Y_TEXT = 15;
const DELTA_Y_DELETE = 20;

export default {
  name: "Shape",
  components: { ReactiveInput, Constraint },
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
      editing: false,
      adding: false,
      constraintConfigs: {},
      constraintTextConfigs: {},
      deleteConstraintConfigs: {},
      shapeConfig: this.$props.nodeShape
        ? NODE_SHAPE_CONFIG
        : PROPERTY_SHAPE_CONFIG,
      deleteNodeConfig: DELETE_BUTTON_CONFIG,
      idTextConfig: {
        ...ID_TEXT_CONFIG,
        text: urlToName(this.$props.id)
      },
      constraintConfig: CONSTRAINT_CONFIG,
      constraintTextConfig: {
        ...CONSTRAINT_TEXT_CONFIG,
        text: urlToName(this.$props.propKey)
      },
      deleteConstraintConfig: DELETE_BUTTON_CONFIG,
      addPredicateConfig: ADD_PREDICATE_CONFIG
    };
  },
  mounted() {
    // Move the shape to the defined coordinate.
    this.$refs.posRef
      .getNode()
      .setPosition(
        this.$store.state.mShape.mCoordinate.coordinates[this.$props.id]
      );
    this.updateCoordinates();

    // Update the configurations if the shape had changed.
    const self = this;
    this.$store.watch(
      () => self.$store.getters.shapeConstraints(self.$props.id),
      () =>
        self.setConfigs(self.$store.getters.shapeConstraints(self.$props.id))
    );
  },
  methods: {
    /**
     * Get an object containing all the constraints and set their y values.
     * @returns an object mapping every constraint name to a (list of) values.
     */
    getConstraints() {
      const constraints = this.$store.getters.shapeConstraints(this.$props.id);
      this.setConfigs(constraints);
      return constraints;
    },

    /**
     * Takes the coordinates from this node shape and calls store to update them.
     */
    updateCoordinates() {
      const pos = this.$refs.posRef.getNode().position();
      const args = {
        node: this.$props.id,
        x: pos.x,
        y: pos.y
      };
      this.$store.commit("updateYValues", {
        shapeID: this.$props.id,
        shapes: this.$store.state.mShape.model
      });
      this.$store.commit("updateCoordinates", args);
    },

    /**
     * Set the configurations of its children using the updated y values from the state.
     * @param elements a dictionary containing the node shape's elements.
     */
    setConfigs(elements) {
      const { id } = this.$props;
      const ys = this.$store.state.mShape.mCoordinate.yValues[id];

      // FIXME
      for (const prop of Object.keys(elements)) {
        this.constraintConfigs[prop] = {
          ...this.constraintConfig,
          y: ys[prop]
        };
        this.constraintTextConfigs[prop] = {
          ...this.constraintTextConfig,
          y: ys[prop] + DELTA_Y_TEXT,
          text: prop
        };
        this.deleteConstraintConfigs[prop] = {
          ...this.deleteConstraintConfig,
          y: ys[prop] + DELTA_Y_DELETE
        };
      }
    },

    /**
     * TODO
     */
    addPredicate() {
      this.$store.commit("togglePredicateModal", {
        id: this.id,
        type: "PropertyShape"
      });
    },

    /**
     * Call the ReactiveInput component to start editing using the given text node.
     */
    startEditing() {
      if (this.$refs.reactiveInput)
        this.$refs.reactiveInput.startEditing(this.$refs.shapeID.getNode());
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
        if (this.$props.nodeShape) {
          this.$store.dispatch("editNodeShape", args);
        } else {
          this.$store.dispatch("editPropertyShape", args);
        }
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
