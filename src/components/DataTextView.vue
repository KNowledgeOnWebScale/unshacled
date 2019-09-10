<template>
  <div>
    <textarea
      v-if="getTextualData()"
      v-model="dataText"
      :style="getStyle()"
    ></textarea>
    <div v-if="!getTextualData()">
      No data loaded.
    </div>
  </div>
</template>

<script>
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
        height: `${this.$props.height - 6}px`,
        width: "100%"
      };
    }
  }
};
</script>

<style scoped></style>
