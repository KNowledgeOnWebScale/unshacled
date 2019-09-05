<template>
  <div>
    <table class="table">
      <tr>
        <td>
          <sui-table color="green" inverted>
            <sui-table-header>
              <sui-table-row>
                <sui-table-header-cell class="prefix">
                  Prefix
                </sui-table-header-cell>
                <sui-table-header-cell class="uri">
                  URI
                </sui-table-header-cell>
              </sui-table-row>
            </sui-table-header>
          </sui-table>
        </td>
      </tr>
      <tr>
        <td>
          <div class="table-body">
            <sui-table>
              <sui-table-body>
                <sui-table-row
                  v-for="(uri, prefix) of getNamespaces()"
                  :key="prefix"
                >
                  <sui-table-cell class="prefix">{{ prefix }}</sui-table-cell>
                  <sui-table-cell class="uri">{{ uri }}</sui-table-cell>
                </sui-table-row>
              </sui-table-body>
            </sui-table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import namespaces from "../../config/config";

export default {
  name: "NamespaceTable",
  methods: {
    getNamespaces() {
      return namespaces;
    }
  }
};
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

.prefix {
  width: 20%;
}
.uri {
  width: 80%;
}
</style>
