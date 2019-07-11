<template>
  <input ref="input" type="text" @blur="stopEditing" />
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
      const { input } = this.$refs;
      const stage = this.$store.state.editor;

      // Get the position of the original text node to put the input field on top.
      const textPosition = textNode.getAbsolutePosition();
      const stageBounds = stage.container().getBoundingClientRect();
      const fieldPosition = {
        x: stageBounds.left + textPosition.x,
        y: stageBounds.top + textPosition.y
      };

      // Add the input field to the document.
      document.getElementById("app").appendChild(input);

      // Set the input field properties.
      input.id = "reactiveInput";
      input.type = "text";
      input.value = textNode.text();
      input.style.position = "absolute";
      input.style.top = `${fieldPosition.y - MARGIN_TOP}px`;
      input.style.left = `${fieldPosition.x + MARGIN_LEFT}px`;
      input.focus(); // Select the input field.

      this.editing = true;

      // Add a listener to stop editing on ENTER button press.
      const self = this;
      input.addEventListener("keydown", e => {
        if (e.keyCode === ENTER) self.stopEditing();
      });
    },

    /**
     * Call the exit function and remove the input field from the page.
     */
    stopEditing() {
      if (this.editing) {
        this.editing = false;
        this.$props.onExit(this.$refs.input.value);
        document.getElementById("app").removeChild(this.$refs.input);
      }
    }
  }
};
</script>

<style scoped></style>
