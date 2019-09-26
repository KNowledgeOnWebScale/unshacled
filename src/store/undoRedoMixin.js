// Adapted from https://github.com/anthonygore/vuex-undo-redo/blob/master/src/plugin.js

import emptyState from "../util/emptyState";

const undoRedoMixin = {
  data() {
    return {
      done: [],
      undone: [],
      newMutation: []
    };
  },
  created() {
    this.$store.subscribe(mutation => {
      if (mutation.type === "saveState") {
        console.log(mutation.type, mutation.payload.mutations);
        this.done.push(mutation.payload.mutations);
      }
      if (
        this.newMutation &&
        !["updateYValues", "updateCoordinates"].includes(mutation.type) // Moving a shape won't trigger this.
      ) {
        this.undone = [];
      }
    });
  },
  methods: {
    canUndo() {
      return this.done.length > 0;
    },
    canRedo() {
      return this.undone.length > 0;
    },
    undo() {
      if (this.canUndo()) {
        console.log("=== UNDO ===");
        this.undone.push(this.done.pop());
        this.newMutation = false;
        this.$store.replaceState(JSON.parse(JSON.stringify(emptyState))); // Parse the stringified version to create a new object.
        this.done.forEach(step =>
          step.forEach(mutation =>
            this.$store.commit(`${mutation.type}`, mutation.payload)
          )
        );
        this.newMutation = true;
      } else {
        console.err("Nothing to undo!");
      }
    },
    redo() {
      if (this.canRedo()) {
        console.log("=== REDO ===");
        const operation = this.undone.pop();
        this.newMutation = false;
        operation.forEach(step =>
          this.$store.commit(`${step.type}`, step.payload)
        );
        this.done.push(operation);
        this.newMutation = true;
      } else {
        console.err("Nothing to redo!");
      }
    }
  }
};

export { undoRedoMixin as default };
