// Based on https://github.com/anthonygore/vuex-undo-redo/blob/master/src/plugin.js

import emptyState from "../util/emptyState";
import { MAX_NUM_OPERATIONS } from "../util/constants";

const undoRedoMixin = {
  /**
   * `done`: list of operations that have been executed. Contains 100 operations.
   * `undone`: list of operations that have been undone.
   * `newOperation`: indicates if the next operation is a new one.
   * @returns {{newOperation: boolean, done: [], undone: []}}
   */
  data() {
    return {
      done: [],
      undone: [],
      newOperation: false
    };
  },
  created() {
    /* Bind its methods. */
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.canUndo = this.canUndo.bind(this);
    this.canRedo = this.canRedo.bind(this);

    /* Listen to mutations. */
    this.$store.subscribe(mutation => {
      if (mutation.type === "saveOperation") {
        /* Only for `saveOperation` mutations, the payload will be added to the list of operations. */
        this.done.push(JSON.parse(JSON.stringify(mutation.payload)));
        const ops = this.done.length;
        if (ops > MAX_NUM_OPERATIONS) {
          /* Limit the number of undoable operations. */
          this.done = this.done.slice(ops - MAX_NUM_OPERATIONS);
        }
      }
      if (
        this.newOperation &&
        !["updateYValues", "updateCoordinates", "undo"].includes(mutation.type) // Moving a shape won't trigger this.
      ) {
        /* Clear the list of operations that have been undone. */
        this.undone = [];
      }
    });
  },
  methods: {
    /**
     * Indicates if there are any operations that can be undone.
     * @returns {boolean}
     */
    canUndo() {
      return this.done.length > 0;
    },
    /**
     * Indicates if there are any operations that can be redone.
     * @returns {boolean}
     */
    canRedo() {
      return this.undone.length > 0;
    },

    /**
     * Undo the most recent operation.
     */
    undo() {
      if (this.canUndo()) {
        const operation = this.done.pop();
        this.undone.push(operation); // Add this operation to the list of operations that have been undone.
        this.newOperation = false;

        /* Determine the new state. */
        const n = this.done.length;
        let newState = emptyState;
        if (n > 0) newState = this.done[this.done.length - 1].state;

        /* Parse the stringified version to create a new object. */
        this.$store.replaceState(JSON.parse(JSON.stringify(newState)));
        this.newOperation = true;
        this.$store.commit("undo"); // Event
      }
    },

    /**
     * Redo the last operation that has been undone.
     */
    redo() {
      if (this.canRedo()) {
        const operation = this.undone.pop();
        this.newOperation = false;
        this.$store.replaceState(JSON.parse(JSON.stringify(operation.state)));
        this.done.push(operation); // Add this operation to the list of operations that have been done.
        this.newOperation = true;
      }
    }
  }
};

export { undoRedoMixin as default };
