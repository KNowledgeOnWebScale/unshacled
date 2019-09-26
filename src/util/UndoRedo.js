const EMPTY_STATE = "emptyState";

module.exports = {
  install(Vue, options = {}) {
    if (!Vue._installedPlugins.find(plugin => plugin.Store)) {
      throw new Error(
        "VuexUndoRedo plugin must be installed after the Vuex plugin."
      );
    }
    Vue.mixin({
      data() {
        return {
          done: [],
          undone: [],
          newMutation: true,
          ignoreMutations: options.ignoreMutations || []
        };
      },
      computed: {
        canRedo() {
          return this.undone.length;
        },
        canUndo() {
          return this.done.length;
        }
      },
      created() {
        if (this.$store) {
          this.$store.subscribe(mutation => {
            if (
              mutation.type !== EMPTY_STATE &&
              this.ignoreMutations.indexOf(mutation.type) === -1
            ) {
              this.done.push(mutation);
              console.log(JSON.stringify(this.done.map(m => m.type), null, 2));
            }
            if (this.newMutation) {
              this.undone = [];
            }
          });
        }
      },
      methods: {
        redo() {
          console.log("=== REDO ===");
          const commit = this.undone.pop();
          console.log(commit.payload);
          this.newMutation = false;
          switch (typeof commit.payload) {
            case "object":
              this.$store.commit(`${commit.type}`, { ...commit.payload });
              break;
            default:
              this.$store.commit(`${commit.type}`, commit.payload);
          }
          this.newMutation = true;
        },
        undo() {
          console.log("=== UNDO ===");
          this.undone.push(this.done.pop());
          this.newMutation = false;
          this.$store.commit(EMPTY_STATE);
          this.done.forEach(mutation => {
            console.log(mutation.payload);
            switch (typeof mutation.payload) {
              case "object":
                this.$store.commit(`${mutation.type}`, { ...mutation.payload });
                break;
              default:
                this.$store.commit(`${mutation.type}`, mutation.payload);
            }
            this.done.pop();
          });
          this.newMutation = true;
        }
      }
    });
  }
};
