// Based on https://github.com/anthonygore/vuex-undo-redo/blob/master/src/plugin.js

import emptyState from "../util/emptyState";

const undoRedoMixin = {
  /**
   * `done`: list of operations that have been executed.
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
      }
      if (
        this.newOperation &&
        !["updateYValues", "updateCoordinates"].includes(mutation.type) // Moving a shape won't trigger this.
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
        console.log(this.done);

        const n = this.done.length;
        let newState = emptyState;
        if (n > 0) {
          const last = this.done[this.done.length - 1];
          newState = last.state;
        }
        console.log(JSON.stringify(newState.mShape.model, null, 2));
        this.$store.replaceState(JSON.parse(JSON.stringify(newState))); // Parse the stringified version to create a new object.

        /* Execute the mutations that have been executed in every executed operation. */
        // this.done.forEach(operation => {
        //   this.$store.dispatch(
        //     `${operation.action.type}`,
        //     operation.action.args
        //   );
        // });
        this.newOperation = true;
      }
    },

    /**
     * Redo the last operation that has been undone.
     * FIXME Not operational yet.
     */
    redo() {
      if (this.canRedo()) {
        const operation = this.undone.pop();
        this.newOperation = false;
        // FIXME this does not work due to different ID's!
        operation.forEach(step => {
          this.$store.commit(`${step.type}`, step.payload);
        });
        this.done.push(operation); // Add this operation to the list of operations that have been done.
        this.newOperation = true;
      }
    }
  }
};

export { undoRedoMixin as default };
