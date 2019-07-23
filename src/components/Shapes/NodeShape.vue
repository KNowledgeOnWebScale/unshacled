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
        ref="nodeID"
        :config="idTextConfig"
        @click="startEditing"
      ></v-text>
      <v-circle
        v-if="hover"
        :config="deleteNodeConfig"
        @click="deleteNodeShape"
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
    <reactive-input
      ref="addPropInput"
      :is-datalist="true"
      :on-exit="stopAddingProperty"
    ></reactive-input>
  </div>
</template>

<script>
import NodeProperty from "./NodeProperty.vue";
import ReactiveInput from "../FormElements/ReactiveInput.vue";
import { urlToName } from "../../util/nameParser";
import {
  DELETE_NODE_CONFIG,
  DELETE_PROP_CONFIG,
  ADD_PROP_CONFIG,
  ID_TEXT_CONFIG,
  PROP_TEXT_CONFIG,
  PROPERTY_CONFIG,
  NODE_SHAPE_CONFIG
} from "../../util/konvaConfigs";

const DELTA_Y_TEXT = 15;
const DELTA_Y_DELETE = 20;
const NEW_PROPERTY_TEXT = "newProperty";

export default {
  name: "NodeShape",
  components: { ReactiveInput, NodeProperty },
  props: {
    id: {
      type: String,
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
      shapeConfig: NODE_SHAPE_CONFIG,
      deleteNodeConfig: DELETE_NODE_CONFIG,
      idTextConfig: {
        ...ID_TEXT_CONFIG,
        text: urlToName(this.$props.id)
      },
      propertyConfig: PROPERTY_CONFIG,
      propTextConfig: {
        ...PROP_TEXT_CONFIG,
        text: urlToName(this.$props.propKey)
      },
      deletePropConfig: DELETE_PROP_CONFIG,
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
      const propNames = this.$store.getters.nodeProperties(this.$props.id);
      const propertyObjects = this.$store.getters.propertyShapes;
      const propObjects = {};
      for (const prop of propNames) propObjects[prop] = propertyObjects[prop];
      this.setPropConfigs(propObjects);
      return propObjects;
    },

    /**
     * Set the configurations of its children using the updated y values from the state.
     * @param properties a dictionary containing the node shape's properties.
     */
    setPropConfigs(properties) {
      const { id } = this.$props;
      const ys = this.$store.state.yValues[id];
      for (const prop of Object.keys(properties)) {
        // The properties should be listed below eachother.
        this.propertyConfigs[prop] = { ...this.propertyConfig, y: ys[prop] };
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
     * TODO
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
     * @param value
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
      if (newValue !== "" && !this.$store.getters.nodeShapes[newValue]) {
        const args = {
          oldID: this.$props.id,
          newID: newValue
        };
        this.$store.dispatch("editNodeShape", args);
      }
    },

    /**
     * Delete this node shape.
     */
    deleteNodeShape() {
      this.$refs.reactiveInput.stopEditing();
      this.$store.dispatch("deleteNodeShape", this.$props.id);
    },

    /**
     * Takes the coördinates from this node shape and calls store to update them.
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
