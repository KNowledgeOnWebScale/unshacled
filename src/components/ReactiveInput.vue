<template>
  <input ref="input" type="text" />
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
      console.log("startEditing");
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

      const self = this;
      document.addEventListener("click", e => {
        if (this.editing && e.target !== textfield) {
          self.stopEditing();
        }
      });
      textfield.addEventListener("keydown", e => {
        if (this.editing && e.keyCode === 13) {
          self.stopEditing();
        }
      });
      this.editing = true;
    },

    stopEditing() {
      if (this.editing) {
        this.editing = false;
        console.log("stopEditing");
        // this.$props.onExit(this.$refs.input.value);
        document.getElementById("app").removeChild(this.$refs.input);
      }
    }
  }
};
</script>

<style scoped></style>
