<template>
  <div>
    <table class="table">
      <tr>
        <td>
          <sui-table color="green" inverted>
            <sui-table-header>
              <sui-table-row>
                <sui-table-header-cell class="predicate">
                  <span
                    class="clickable"
                    @click="setSorting(true, 'predicate')"
                  >
                    Predicate
                    <span v-if="$props.sorting.sortBy === 'predicate'">
                      <sui-icon
                        v-if="$props.sorting.ascending"
                        name="sort up"
                      ></sui-icon>
                      <sui-icon
                        v-if="!$props.sorting.ascending"
                        name="sort down"
                      ></sui-icon>
                    </span>
                    <span v-if="$props.sorting.sortBy !== 'predicate'">
                      <sui-icon name="sort"></sui-icon>
                    </span>
                  </span>
                </sui-table-header-cell>

                <sui-table-header-cell class="description">
                  Description
                </sui-table-header-cell>
                <sui-table-header-cell class="type">
                  <span class="clickable" @click="setSorting(true, 'type')">
                    Type
                    <span v-if="$props.sorting.sortBy === 'type'">
                      <sui-icon
                        v-if="$props.sorting.ascending"
                        name="sort up"
                      ></sui-icon>
                      <sui-icon
                        v-if="!$props.sorting.ascending"
                        name="sort down"
                      ></sui-icon>
                    </span>
                    <span v-if="$props.sorting.sortBy !== 'type'">
                      <sui-icon name="sort"></sui-icon>
                    </span>
                  </span>
                </sui-table-header-cell>
              </sui-table-row>
            </sui-table-header>
          </sui-table>
        </td>
      </tr>

      <tr>
        <td>
          <div :class="{ 'table-body': !editing }">
            <sui-table :selectable="!editing">
              <sui-table-body>
                <sui-table-row
                  v-for="object of sortList(filterContents())"
                  :key="object.id"
                  :ref="object.id"
                  :active="!editing && selected === object.id"
                  @click="selectConstraint(object.id)"
                >
                  <sui-table-cell class="predicate">
                    {{ object.predicate }}
                  </sui-table-cell>
                  <sui-table-cell class="description">
                    {{ object.description }}
                  </sui-table-cell>
                  <sui-table-cell class="type">
                    {{ object.type.replace(" Constraints", "") }}
                  </sui-table-cell>
                </sui-table-row>
              </sui-table-body>
            </sui-table>
          </div>
        </td>
      </tr>
    </table>

    <sui-segment v-if="editing && clicked" emphasis="secondary">
      <!-- TODO allow predicate editing -->
      <div>
        You cannot change the predicate while editing.
      </div>
      <div>
        To change it, remove this constraint and add the wanted predicate.
      </div>
    </sui-segment>
  </div>
</template>

<script>
export default {
  name: "PredicateTable",
  props: {
    contents: {
      type: Array,
      required: true
    },
    filter: {
      type: String,
      required: true
    },
    selected: {
      type: String,
      required: false,
      default: ""
    },
    editing: {
      type: Boolean,
      required: true
    },
    sorting: {
      type: Object,
      required: false,
      default() {
        return {
          sorted: true, // Is the table sorted?
          sortBy: "predicate", // What field is the table sorted with?
          ascending: true // Is the table sorted ascending?
        };
      }
    }
  },
  data() {
    return {
      clicked: false
    };
  },
  mounted() {
    const self = this;
    this.$store.watch(
      () => self.$store.state.mShape.mConstraint.mModal.selected,
      () => {
        self.clicked = false;
      }
    );
  },
  methods: {
    /**
     * Set the sorting to the given values.
     * @param sorted
     * @param sortBy
     */
    setSorting(sorted, sortBy) {
      const p = this.$props.sorting;
      // Invert the order if the sorting criterium stays the same, otherwise sort ascendingly.
      const ascending = p.sortBy === sortBy ? !p.ascending : true;
      this.$store.commit("sortPredicateModal", {
        sorted,
        sortBy,
        ascending
      });
    },

    /**
     * Filter the table contents according to the entered search term.
     * If the user is editing the constraint, only show the selected constraint.
     * If no search term is entered, show everything.
     * Otherwise, check for each row if the search term occurs in the predicate or type.
     * The selected predicate will always be shown.
     * @returns {[]} List of constraint objects: {id, predicate, description, type}
     */
    filterContents() {
      const { contents, selected } = this.$props;
      if (this.editing) {
        return contents.filter(obj => obj.id === selected);
      }
      if (this.filter === "") {
        // No filter. Show every entry.
        return Object.values(contents);
      }
      // Otherwise, filter the table contents.
      const filtered = [];
      for (const obj of contents) {
        const type = obj["type"].replace(" Constraints", "");
        if (
          obj.id === selected || // Always show the selected predicate.
          this.matches(type) || // Check if the search term matches the type.
          this.matches(obj.predicate) // Check if the search term matches the predicate.
        )
          filtered.push(obj);
      }
      return filtered;
    },

    /**
     * Check if the given string matches the current filter.
     * Make the string and filter lowercase and remove the whitespace and non-alphanumeric characters first.
     */
    matches(string) {
      const matchString = string.toLowerCase().replace(/[^0-9a-z]/gi, "");
      const search = this.filter.toLowerCase().replace(/[^0-9a-z]/gi, "");
      return matchString.includes(search);
    },

    /**
     * Sort the given list using the sorting properties.
     * `sorted` {boolean} indicates if the list should be sorted.
     * `sortBy` {string} indicates which field the list should be sorted with.
     * `ascending` {boolean} indicates if the list should be sorted ascendingly.
     * @param list
     * @returns {*}
     */
    sortList(list) {
      const { sorted, sortBy, ascending } = this.$props.sorting;
      if (sorted) {
        // Sort the list.
        sortBy === "predicate"
          ? list.sort(comparePredicates)
          : sortBy === "type"
          ? list.sort(compareType)
          : null;

        // Reverse the list if needed.
        if (!ascending) list.reverse();
      }
      return list;
    },

    /**
     * Select the constraint with the given key.
     * This will activate the row.
     * Only allow selecting if the user is not editing the constraint.
     * @param key
     */
    selectConstraint(key) {
      if (!this.editing) {
        this.$store.commit("selectRow", { key });
      } else {
        this.clicked = true;
      }
    }
  }
};

/**
 * Compare the given objects by predicate.
 * @param a
 * @param b
 * @returns {number}
 */
function comparePredicates(a, b) {
  if (a["predicate"] < b["predicate"]) return -1;
  if (a["predicate"] > b["predicate"]) return 1;
  return 0;
}

/**
 * Compare the given objects by type.
 * @param a
 * @param b
 * @returns {number}
 */
function compareType(a, b) {
  if (a["type"] < b["type"]) return -1;
  if (a["type"] > b["type"]) return 1;
  return 0;
}
</script>

<style scoped>
.table {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
}
.table-body {
  height: 35vh;
  min-height: 20vh;
  max-height: 35vh;
  overflow: auto;
}

.clickable {
  cursor: pointer;
}
.predicate {
  width: 25%;
}
.description {
  width: 55%;
}
.type {
  width: 20%;
}
</style>
