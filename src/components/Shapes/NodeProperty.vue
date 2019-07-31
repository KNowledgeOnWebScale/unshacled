<template>
  <div>
    <reactive-input
      ref="reactiveInput"
      :is-datalist="true"
      :on-exit="stopEditing"
    ></reactive-input>
    <v-group>
      <v-rect :config="this.$props.propertyConfig"></v-rect>
      <v-text
        ref="propKey"
        :config="this.$props.propTextConfig"
        @click="startEditing"
      ></v-text>
      <v-circle
        v-if="this.$props.hover"
        :config="this.$props.deletePropConfig"
        @click="deleteProperty"
      ></v-circle>
    </v-group>
  </div>
</template>

<script>
import ReactiveInput from "../FormElements/ReactiveInput.vue";

export default {
  name: "NodeProperty",
  components: { ReactiveInput },
  props: {
    node: {
      required: true,
      type: String
    },
    propKey: {
      required: true,
      type: String
    },
    hover: {
      required: true,
      type: Boolean
    },
    propertyConfig: {
      required: true,
      type: Object
    },
    constraintTextConfig: {
      required: true,
      type: Object
    },
    deleteConstraintConfig: {
      required: true,
      type: Object
    }
  },
  methods: {
    /**
     * Call the ReactiveInput component to start editing using the given text node.
     */
    startEditing() {
      if (this.$refs.reactiveInput) {
        this.$refs.reactiveInput.startEditing(
          this.$refs.propKey.getNode(),
          this.$props.propKey
        );
      }
    },

    /**
     * Stop editing.
     * Check if the filled in value is valid and unique.
     * Call the store to edit the property if possible.
     */
    stopEditing(newValue) {
      // Check if the new value is valid and unique.
      const properties = this.$store.getters.nodeShapes[this.$props.node][
        "https://2019.summerofcode.be/unshacled#property"
      ];
      if (newValue !== "" && properties.indexOf(newValue) === -1) {
        const args = {
          nodeID: this.$props.node,
          oldID: this.$props.propKey,
          newID: newValue
        };
        this.$store.dispatch("editPropertyInNode", args);
      }
    },

    /**
     * Delete the current property from its node shape.
     */
    deleteProperty() {
      const args = {
        node: this.$props.node,
        prop: this.$props.propKey
      };
      this.$store.dispatch("deletePropFromNode", args);
    }
  }
};
</script>

<style scoped></style>
