<template>
  <div>
    <input ref="input" type="text" @blur="stopEditing" />
    <input ref="listInput" type="text" list="datalist" @blur="stopEditing" />
    <datalist id="datalist" ref="datalist" type="text">
      <option
        v-for="key in getSelectOptions()"
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
  mounted() {
    this.getSelectOptions();
  },
  methods: {
    /**
     * Start editing using the given text.
     * Create an input field on top of the text node.
     * Add an event listener to stop editing when pressing the ENTER key.
     * @param textNode the Konva node which contains the text we need to edit.
     * @param propKey the id of the property we need to edit.
     */
    startEditing(textNode, propKey) {
      const { input, datalist, listInput } = this.$refs;
      const bool = this.$props.isDatalist;
      const field = bool ? listInput : input;
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
      if (bool) {
        // Add the datalist object if needed.
        document.getElementById("app").appendChild(datalist);
        listInput.value = propKey;
      }

      // Set the field properties.
      field.id = "reactiveInput";
      if (!bool) {
        // Properties specific to the simple input.
        input.type = "text";
        input.value = textNode.text();
      }
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
        if (this.$props.isDatalist) {
          this.$props.onExit(this.$refs.listInput.value);
          document.getElementById("app").removeChild(this.$refs.datalist);
          document.getElementById("app").removeChild(this.$refs.listInput);
        } else {
          this.$props.onExit(this.$refs.input.value);
          document.getElementById("app").removeChild(this.$refs.input);
        }
      }
    },

    getSelectOptions() {
      return this.$store.getters.propertyShapes;
    },

    getOptionID(key) {
      return key["@id"];
    }
  }
};
</script>

<style scoped></style>
