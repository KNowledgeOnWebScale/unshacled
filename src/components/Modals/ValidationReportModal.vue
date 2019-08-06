<template>
  <div>
    <sui-modal
      v-model="this.$store.state.mData.showValidationReportModal"
      @submit.prevent="confirmNodeShape"
    >
      <sui-modal-header>
        Validation report
      </sui-modal-header>
      <sui-modal-content :scrolling="true">
        <div>
          <h4>General</h4>

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
                {{ value }}
              </li>
            </ul>
            <p>More details can be found below.</p>
          </div>
        </div>

        <sui-divider></sui-divider>

        <div>
          <h4>Details</h4>
          <p v-for="(value, key) of getSimpleResults()" :key="key">
            {{ key }}: {{ JSON.stringify(value, null, 2) }}
          </p>
        </div>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button @click="toggleModal">Close</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import { SHACL_URI } from "../../util/constants";
import { urlToName } from "../../parsing/urlParser";

export default {
  name: "ValidationReportModal",
  props: {
    report: {
      required: true,
      type: Object
    }
  },
  methods: {
    toggleModal() {
      this.$store.commit("toggleValidationReport");
    },

    conforms() {
      return (
        this.getGeneralReport().conforms &&
        this.getGeneralReport().conforms === "true"
      );
    },

    /**
     * Get the general report of the validation report as an object.
     */
    getGeneralReport() {
      const { validationNode } = this.$props.report;
      if (validationNode) {
        const generalReport = {};
        generalReport.conforms =
          validationNode[`${SHACL_URI}conforms`][0]["@value"];
        generalReport.nodeIDs = [];
        generalReport.nodes = [];

        for (const node of validationNode[`${SHACL_URI}result`]) {
          generalReport.nodeIDs.push(node["@id"]);
          generalReport.nodes.push(this.getSimpleResults()[node["@id"]]["node"]);
        }

        generalReport.nodeIDs = new Set(generalReport.nodeIDs);
        generalReport.nodes = new Set(generalReport.nodes);

        return generalReport;
      }
      return {};
    },

    /**
     * Get the validation results as a dictionary.
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
     */
    getSimpleResults() {
      const results = this.getValidationResults();
      if (results) {
        const simple = {};
        for (const key of Object.keys(results)) {
          const r = results[key];
          simple[key] = {};
          for (const constr of Object.keys(r)) {
            const name = urlToName(r[constr]);
            simple[key][constr] = name === "(undefined)" ? undefined : name;
          }
          simple[key].message = r.message;
        }
        return simple;
      }
      return {};
    }
  }
};
</script>

<style scoped></style>
