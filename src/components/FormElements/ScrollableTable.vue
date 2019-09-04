<template>
  <table>
    <tr class="table">
      <td class="table">
        <sui-table class="table">
          <sui-table-header>
            <sui-table-row>
              <sui-table-header-cell class="predicate">
                <div class="clickable" @click="setSorting(true, 'predicate')">
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
                </div>
              </sui-table-header-cell>
              <sui-table-header-cell class="description">
                Description
              </sui-table-header-cell>
              <sui-table-header-cell class="type">
                <span class="clickable" @click="setSorting(true, 'type')">
                  Type
                  <div v-if="$props.sorting.sortBy === 'type'">
                    <sui-icon
                      v-if="$props.sorting.ascending"
                      name="sort up"
                    ></sui-icon>
                    <sui-icon
                      v-if="!$props.sorting.ascending"
                      name="sort down"
                    ></sui-icon>
                  </div>
                </span>
              </sui-table-header-cell>
            </sui-table-row>
          </sui-table-header>
        </sui-table>
      </td>
    </tr>

    <tr>
      <td>
        <div class="table-body">
          <sui-table selectable>
            <sui-table-body>
              <sui-table-row
                v-for="(value, key) of getContents()"
                :key="key"
                :ref="key"
                @click="selectConstraint(key)"
              >
                <sui-table-cell class="predicate">
                  {{ value.predicate }}
                </sui-table-cell>
                <sui-table-cell class="description">
                  {{ value.description }}
                </sui-table-cell>
                <sui-table-cell class="type">
                  {{ value.type.replace(" Constraints", "") }}
                </sui-table-cell>
              </sui-table-row>
            </sui-table-body>
          </sui-table>
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "ScrollableTable",
  props: {
    contents: {
      type: Object,
      required: true
    },
    filter: {
      type: String,
      required: true
    },
    sorting: {
      type: Object,
      required: false,
      default() {
        return {
          sorted: false, // Is the table sorted?
          sortBy: "", // What field is the table sorted with?
          ascending: false // Is the table sorted ascending?
        };
      }
    }
  },
  methods: {
    /**
     * Set the sorting to the given values.
     * @param sorted
     * @param sortBy
     */
    setSorting(sorted, sortBy) {
      console.log("setSorting", JSON.stringify(this.$props.sorting, null, 2));
      this.$store.commit("sortPredicateModal", {
        sorted,
        sortBy,
        ascending: !this.$props.sorting.ascending
      });
    },

    /**
     *
     */
    getContents() {
      return this.sortList(this.filterContents());
    },

    /**
     * TODO
     * @returns {Set<*>[]|any}
     */
    filterContents() {
      const { contents } = this.$props;
      if (this.filter === "") {
        // No filter. Show every entry.
        return contents;
      }
      // Otherwise, filter the table contents.
      const filtered = [];
      for (const obj of Object.values(contents)) {
        const type = obj["type"].replace(" Constraints", "");
        if (this.matches(type) || this.matches(obj["predicate"]))
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
     * TODO
     * @param list
     * @returns {*}
     */
    sortList(list) {
      const { sorted, sortBy, ascending } = this.$props;
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
     * TODO
     * @param key
     */
    selectConstraint(key) {
      console.log("selected", key);
      // TODO
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
  console.log(JSON.stringify(a, null, 2));
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
  console.log(JSON.stringify(a, null, 2));
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
  height: 40vh;
  min-height: 40vh;
  max-height: 40vh;
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
