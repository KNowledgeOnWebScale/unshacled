<template>
  <div>
    <input ref="input" type="text" list="datalist" @blur="stopEditing" />
    <datalist id="datalist" ref="datalist" type="text">
      <option
        v-for="key in getOptions()"
        :key="getOptionID(key)"
        :value="getOptionID(key)"
      ></option>
    </datalist>
  </div>
</template>

<script>
const ENTER = 13;
const MARGIN_TOP = 5;
const MARGIN_LEFT = 20;

export default {
  name: "ReactiveInput",
  props: {
    onExit: {
      required: true,
      type: Function
    },
    isDatalist: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      editing: false
    };
  },
  methods: {
    /**
     * Start editing using the given text.
     * Create an input field on top of the text node.
     * Add an event listener to stop editing when pressing the ENTER key.
     * @param textNode the Konva node which contains the text we need to edit.
     */
    startEditing(textNode) {
      const { input, datalist } = this.$refs;
      const bool = this.$props.isDatalist;
      const field = bool ? input : datalist;
      const stage = this.$store.state.editor;

      // Get the position of the original text node to put the field on top.
      const textPosition = textNode.getAbsolutePosition();
      const stageBounds = stage.container().getBoundingClientRect();
      const fieldPosition = {
        x: stageBounds.left + textPosition.x,
        y: stageBounds.top + textPosition.y
      };

      // Add the field to the document.
      document.getElementById("app").appendChild(field);

      // Set the field properties.
      field.id = "reactiveInput";
      // Properties specific to the simple input.
      input.type = "text";
      input.value = textNode.text();
      field.style.position = "absolute";
      field.style.top = `${fieldPosition.y - MARGIN_TOP}px`;
      field.style.left = `${fieldPosition.x + MARGIN_LEFT}px`;
      field.focus(); // Select the field.

      this.editing = true;

      // Add a listener to stop editing on ENTER button press.
      const self = this;
      field.addEventListener("keydown", e => {
        if (e.keyCode === ENTER) self.stopEditing();
      });
    },

    /**
     * Call the exit function with the entered value and remove the field from the page.
     */
    stopEditing() {
      if (this.editing) {
        this.editing = false;
        this.$props.onExit(this.$refs.input.value);
        document.getElementById("app").removeChild(this.$refs.input);
      }
    },

    /**
     * Get the possible options for the datalist object.
     * @returns {getters.propertyShapes}
     */
    getOptions() {
      return this.$store.getters.propertyShapes;
    },

    /**
     * Get the ID of the given option.
     * @param key
     * @returns {*}
     */
    getOptionID(key) {
      return key["@id"];
    }
  }
};
</script>

<style scoped></style>
