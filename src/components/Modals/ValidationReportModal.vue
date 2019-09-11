<template>
  <div>
    <sui-modal
      v-model="$store.state.mData.showValidationReportModal"
      @submit.prevent="toggleModal"
    >
      <sui-modal-header>
        Validation report
      </sui-modal-header>
      <sui-modal-content :scrolling="true">
        <sui-segment basic>
          <div v-if="!conforms()">
            <h3 is="sui-header">
              <sui-icon name="cog" />
              <sui-header-content>General</sui-header-content>
            </h3>
            <sui-divider></sui-divider>
          </div>

          <sui-segment v-if="conforms()" color="green">
            This data conforms to the given model.
          </sui-segment>

          <div v-if="!conforms()">
            <sui-segment color="red">
              This data does not conform to the given model.
            </sui-segment>

            <p>The following shapes do not conform:</p>
            <ul>
              <li v-for="value of getGeneralReport().nodes" :key="value">
                {{ getPrefixedUri(value) }}
              </li>
            </ul>
            <p>More details can be found below.</p>
          </div>
        </sui-segment>

        <sui-segment v-if="!conforms()" basic>
          <h3 is="sui-header">
            <sui-icon name="cogs" />
            <sui-header-content>Details</sui-header-content>
          </h3>

          <sui-divider></sui-divider>

          <sui-segment
            v-for="(results, node) of getResultsByNode()"
            :key="node"
            basic
          >
            <h4 is="sui-header">{{ node }}</h4>
            <sui-segments>
              <sui-segment v-for="result of results" :key="result.shape">
                <sui-grid>
                  <sui-grid-row v-for="(value, key) of result" :key="key">
                    <sui-grid-column :width="1"></sui-grid-column>

                    <sui-grid-column :width="3">
                      <h5 is="sui-header">{{ cfl(key) }}</h5>
                    </sui-grid-column>

                    <sui-grid-column :width="12">{{ value }}</sui-grid-column>
                  </sui-grid-row>
                </sui-grid>
              </sui-segment>
            </sui-segments>
          </sui-segment>
        </sui-segment>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button id="close" tab-index="0" @click="toggleModal">
          Close
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import { SHACL_URI } from "../../util/constants";
import { uriToPrefix } from "../../util/urlParser";
import { groupBy } from "../../util";
import { capitalizeFirstLetter } from "../../util/strings";

export default {
  name: "ValidationReportModal",
  props: {
    report: {
      required: true,
      type: Object
    }
  },
  mounted() {
    /* Focus the clear button when the modal is called. */
    const self = this;
    this.$store.watch(
      () => self.$store.state.mData.showValidationReportModal,
      () => {
        if (self.$store.state.mData.showValidationReportModal)
          document.getElementById("close").focus();
      }
    );
  },
  methods: {
    /**
     * Toggle the visibility of the modal.
     */
    toggleModal() {
      this.$store.commit("toggleValidationReport");
    },

    /**
     * Check if the data conforms to the model.
     * @returns {boolean} indicates whether the data conforms to the model.
     */
    conforms() {
      return (
        this.getGeneralReport().conforms &&
        this.getGeneralReport().conforms === "true"
      );
    },

    /**
     * Capitalize the first letter of the given string.
     * Used because `capitalizeFirstLetter` cannot be called directly from the HTML.
     * @param string {string} the string we want to edit.
     * @returns {string} the given string with its first letter capitalized.
     */
    cfl(string) {
      return capitalizeFirstLetter(string);
    },

    /**
     * Get the general report of the validation report as an object.
     * This object is used to populate the validation modal.
     * @returns {{}} a report object.
     */
    getGeneralReport() {
      const { validationNode } = this.$props.report;
      if (validationNode) {
        const generalReport = {};
        generalReport.conforms =
          validationNode[`${SHACL_URI}conforms`][0]["@value"];

        /* Only generate the results if the data does not conform. */
        if (generalReport.conforms !== "true") {
          generalReport.nodeIDs = [];
          generalReport.nodes = [];

          for (const node of validationNode[`${SHACL_URI}result`]) {
            generalReport.nodeIDs.push(node["@id"]);
            generalReport.nodes.push(
              this.getSimpleResults()[node["@id"]]["node"]
            );
          }
          generalReport.nodeIDs = new Set(generalReport.nodeIDs);
          generalReport.nodes = new Set(generalReport.nodes);
        }
        return generalReport;
      }
      return {}; // No validation report.
    },

    /**
     * Get the validation results as a dictionary.
     * This object is used to populate the validation modal.
     * @returns {{}} a dictionary of the shape IDs to their validation results.
     */
    getValidationResults() {
      const { graph } = this.$props.report;
      if (graph) {
        const validationResults = {};
        for (const result of graph) {
          if (result["@type"][0].includes("Result")) {
            validationResults[result["@id"]] = {
              node: result[`${SHACL_URI}focusNode`][0]["@id"],
              message: result[`${SHACL_URI}resultMessage`][0]["@value"],
              path: result[`${SHACL_URI}resultPath`][0]["@id"],
              severity: result[`${SHACL_URI}resultSeverity`][0]["@id"],
              constraint:
                result[`${SHACL_URI}sourceConstraintComponent`][0]["@id"],
              shape: result[`${SHACL_URI}sourceShape`][0]["@id"],
              valueType: result[`${SHACL_URI}value`][0]["@type"],
              value: result[`${SHACL_URI}value`][0]["@value"]
            };
          }
        }
        return validationResults;
      }
      return {};
    },

    /**
     * Get the validation results as a dictionary without URIs.
     * This object is used to populate the validation modal.
     * @returns {{}}
     */
    getSimpleResults() {
      const results = this.getValidationResults();
      if (results) {
        const simple = {};
        for (const key of Object.keys(results)) {
          const r = results[key];
          simple[key] = {};
          for (const constr of Object.keys(r)) {
            if (r[constr]) {
              const name = uriToPrefix(
                this.$store.state.mConfig.namespaces,
                r[constr]
              );
              if (name !== "(undefined)") simple[key][constr] = name;
            }
          }
          simple[key].message = r.message;
        }
        return simple;
      }
      return {};
    },

    /**
     * Get the validation results grouped by node.
     * @returns {{}} the validation result object grouped using the "node" key.
     */
    getResultsByNode() {
      return groupBy(this.getSimpleResults(), "node", true);
    },

    /**
     * Change the URI in the given string to a prefix.
     * @param string {string} the string we want to change.
     * @returns {string} the given string with the namespace replaced by the corresponding prefix.
     */
    getPrefixedUri(string) {
      return uriToPrefix(this.$store.getters.namespaces, string);
    }
  }
};
</script>

<style scoped></style>
