<template>
  <input ref="input" type="text" @blur="stopEditing" />
</template>

<script>
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
    startEditing(textNode) {
      const textfield = this.$refs.input;
      const stage = this.$store.state.editor;
      const textPosition = textNode.getAbsolutePosition();
      const stageBounds = stage.container().getBoundingClientRect();
      const fieldPosition = {
        x: stageBounds.left + textPosition.x,
        y: stageBounds.top + textPosition.y
      };

      document.getElementById("app").appendChild(textfield);

      textfield.id = "reactiveInput";
      textfield.type = "text";
      textfield.value = textNode.text();
      textfield.style.position = "absolute";
      textfield.style.top = `${fieldPosition.y - 5}px`;
      textfield.style.left = `${fieldPosition.x + 20}px`;
      textfield.focus();

      this.editing = true;
      textfield.addEventListener("keydown", e => {
        if (e.keyCode === 13) self.stopEditing();
      });
    },

    stopEditing() {
      if (this.editing) {
        this.editing = false;
        // this.$props.onExit(this.$refs.input.value);
        document.getElementById("app").removeChild(this.$refs.input);
      }
    }
  }
};
</script>

<style scoped></style>
