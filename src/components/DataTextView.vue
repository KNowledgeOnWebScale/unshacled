<template>
  <div v-if="dataText !== ''">
    <sui-header id="header">Data</sui-header>
    <textarea
      v-if="getTextualData()"
      v-model="dataText"
      :style="getStyle()"
      @change="getTextualData()"
    ></textarea>
    <div v-if="!getTextualData()">
      No data loaded.
    </div>
  </div>
</template>

<script>
import { MARGIN, MARGIN_TOP } from "../config/konvaConfigs";

export default {
  name: "DataTextView",
  props: {
    height: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      dataText: {
        type: String,
        required: true
      }
    };
  },
  methods: {
    getTextualData() {
      const { dataText } = this.$store.state.mData;
      if (dataText.length > 0) {
        this.dataText = dataText;
        return dataText.replace(/\n/g, "<br />");
      }
      return undefined;
    },
    getStyle() {
      return {
        height: `${this.$props.height - MARGIN_TOP - 2 * MARGIN}px`,
        width: "100%"
      };
    }
  }
};
</script>

<style scoped>
#header {
  margin: 1vh;
}
textarea {
  border-color: white;
  border-width: 0;
  padding: 0 0 0 2vh;
  font-family: monospace;
}
</style>
