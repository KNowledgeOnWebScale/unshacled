<template>
  <div>
    <reactive-input
      ref="reactiveInput"
      :is-datalist="false"
      :on-exit="stopEditing"
    ></reactive-input>
    <reactive-input
      ref="addPropInput"
      :is-datalist="true"
      :on-exit="stopAddingProperty"
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
        ref="nodeID"
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
        :config="addPredConfig"
        @mousedown="addPredicate"
      ></v-circle>

      <div v-for="(prop, key) in getProperties()" :key="key">
        <node-property
          :prop-key="key"
          :node="$props.id"
          :property-config="propertyConfigs[key]"
          :prop-text-config="propTextConfigs[key]"
          :delete-prop-config="deletePropConfigs[key]"
        ></node-property>
      </div>

      <div v-for="(prop, key) in getConstraints()" :key="key">
        <constraint
          :constraint-i-d="key"
          :shape="$props.id"
          :constraint-config="propertyConfigs[key]"
          :prop-text-config="propTextConfigs[key]"
          :delete-prop-config="deletePropConfigs[key]"
        ></constraint>
      </div>

      <v-text
        ref="addPropText"
        :config="propTextConfigs['newProperty']"
      ></v-text>
      <v-rect v-if="adding" :config="propertyConfigs['newProperty']"></v-rect>
      <v-circle
        v-if="!adding"
        :config="addPropConfig"
        @click="addNewProperty"
      ></v-circle>
    </v-group>
  </div>
</template>

<script>
import ReactiveInput from "../FormElements/ReactiveInput.vue";
import NodeProperty from "./NodeProperty.vue";
import Constraint from "./Constraint.vue";
import { urlToName } from "../../util/nameParser";
import {
  DELETE_BUTTON_CONFIG,
  ADD_PROP_CONFIG,
  ID_TEXT_CONFIG,
  PROP_TEXT_CONFIG,
  PROPERTY_CONFIG,
  NODE_SHAPE_CONFIG,
  PROPERTY_SHAPE_CONFIG,
  CONSTRAINT_CONFIG
} from "../../util/konvaConfigs";

const DELTA_Y_TEXT = 15;
const DELTA_Y_DELETE = 20;
const NEW_PROPERTY_TEXT = "newProperty";

export default {
  name: "Shape",
  components: { ReactiveInput, NodeProperty, Constraint },
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
      propertyConfigs: {},
      propTextConfigs: {},
      deletePropConfigs: {},
      shapeConfig: this.$props.nodeShape
        ? NODE_SHAPE_CONFIG
        : PROPERTY_SHAPE_CONFIG,
      deleteNodeConfig: DELETE_BUTTON_CONFIG,
      idTextConfig: {
        ...ID_TEXT_CONFIG,
        text: urlToName(this.$props.id)
      },
      propertyConfig: PROPERTY_CONFIG,
      propTextConfig: {
        ...PROP_TEXT_CONFIG,
        text: urlToName(this.$props.propKey)
      },
      constraintConfig: CONSTRAINT_CONFIG,
      deletePropConfig: DELETE_BUTTON_CONFIG,
      addPropConfig: ADD_PROP_CONFIG
    };
  },
  mounted() {
    // Move the shape to the defined coordinate.
    this.$refs.posRef
      .getNode()
      .setPosition(this.$store.state.coordinates[this.$props.id]);
    this.updateCoordinates();
  },
  methods: {
    /**
     * Get an object containing all the properties and set their y values.
     * @returns an object mapping every property name to a property object.
     */
    getProperties() {
      const propNames = this.$store.getters.shapeProperties(this.$props.id);
      const propertyObjects = this.$store.getters.shapes;
      const propObjects = {};
      for (const prop of propNames) {
        // FIXME here's some undefined stuff going on, hence the if
        if (prop) propObjects[prop] = propertyObjects[prop];
      }
      this.setConfigs(propObjects, false);
      return propObjects;
    },

    /**
     * Get an object containing all the constraints and set their y values.
     * @returns an object mapping every constraint name to a (list of) values.
     */
    getConstraints() {
      const constraints = this.$store.getters.shapeConstraints(this.$props.id);
      this.setConfigs(constraints, true);
      return constraints;
    },

    /**
     * Set the configurations of its children using the updated y values from the state.
     * @param elements a dictionary containing the node shape's elements.
     * @param constraints boolean value which indicates if the given elements are constraints.
     */
    setConfigs(elements, constraints) {
      const { id } = this.$props;
      const ys = this.$store.state.yValues[id];
      for (const prop of Object.keys(elements)) {
        // The properties should be listed below eachother.
        if (constraints) {
          this.propertyConfigs[prop] = {
            ...this.constraintConfig,
            y: ys[prop]
          };
        } else {
          this.propertyConfigs[prop] = { ...this.propertyConfig, y: ys[prop] };
        }
        this.propTextConfigs[prop] = {
          ...this.propTextConfig,
          y: ys[prop] + DELTA_Y_TEXT,
          text: prop
        };
        this.deletePropConfigs[prop] = {
          ...this.deletePropConfig,
          y: ys[prop] + DELTA_Y_DELETE
        };
      }

      // Set y values for the button and text for adding a new property.
      this.propertyConfigs[NEW_PROPERTY_TEXT] = {
        ...this.propertyConfig,
        y: ys[NEW_PROPERTY_TEXT]
      };
      // This text is not visible, but is used to position the input field.
      this.propTextConfigs[NEW_PROPERTY_TEXT] = {
        ...this.propTextConfig,
        y: ys[NEW_PROPERTY_TEXT] + DELTA_Y_TEXT,
        text: "",
        fill: "transparent"
      };
      this.addPropConfig.y = ys["addButton"];
    },

    /**
     * Start adding a new property to the current node.
     */
    addNewProperty() {
      const { addPropInput, addPropText } = this.$refs;
      if (addPropInput) {
        this.adding = true;
        addPropInput.startEditing(
          addPropText.getNode(),
          addPropText.getNode().text()
        );
      }
    },

    /**
     * TODO
     */
    addPredicate() {
      const args = { id: this.id, type: "PropertyShape" };
      console.log("ID:", this.id);
      this.$store.commit("togglePredicateModal", args);
    },

    /**
     * Call the store to add a property with the given ID to the current node.
     * @param value the ID of the property that has to be added.
     */
    stopAddingProperty(value) {
      this.adding = false;
      this.$store.dispatch("addPropertyToNode", {
        propertyID: value,
        nodeID: this.$props.id
      });
    },

    /**
     * Call the ReactiveInput component to start editing using the given text node.
     */
    startEditing() {
      if (this.$refs.reactiveInput)
        this.$refs.reactiveInput.startEditing(this.$refs.nodeID.getNode());
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
      this.$refs.reactiveInput.stopEditing();
      if (this.$props.nodeShape) {
        this.$store.dispatch("deleteNodeShape", this.$props.id);
      } else {
        this.$store.dispatch("deletePropertyShape", this.$props.id);
      }
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
      this.$store.commit("updateYValues", this.$props.id);
      this.$store.commit("updateCoordinates", args);
    }
  }
};
</script>

<style scoped></style>
