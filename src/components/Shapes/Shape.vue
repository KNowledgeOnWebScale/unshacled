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
      @dragmove="updatePosition"
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
import ReactiveInput from "../FormElements/ReactiveInput.vue";
import { urlToName } from "../../parsing/urlParser";
import {
  DELETE_BUTTON_CONFIG,
  ID_TEXT_CONFIG,
  NODE_SHAPE_CONFIG,
  PROPERTY_SHAPE_CONFIG,
  ADD_PREDICATE_CONFIG
} from "../../util/konvaConfigs";

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
      shapeConfig: this.$props.nodeShape
        ? NODE_SHAPE_CONFIG
        : PROPERTY_SHAPE_CONFIG,
      deleteNodeConfig: DELETE_BUTTON_CONFIG,
      idTextConfig: {
        ...ID_TEXT_CONFIG,
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
      () => self.getConstraints()
    );
  },
  methods: {
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
