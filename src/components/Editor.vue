<template>
  <v-stage ref="stage" :config="configKonva" @wheel="scroll">
    <v-layer>
      <div v-for="(obj, key) in this.$store.state.nodeShapes" :key="key">
        <node-shape :id="key" @click="print(key)"></node-shape>
      </div>
      <div v-for="(obj, key) in this.$store.state.relationships" :key="key">
        <relationship :coords="obj.coords"></relationship>
      </div>
    </v-layer>
  </v-stage>
</template>

<script>
import NodeShape from "./Shapes/NodeShape.vue";
import Relationship from "./Relationship.vue";

export default {
  name: "Editor",
  components: { NodeShape, Relationship },

  data() {
    const marginTop = 40;
    return {
      marginTop, // Provide space for the NavBar
      configKonva: {
        width: window.innerWidth,
        height: window.innerHeight - marginTop
      }
    };
  },

  mounted() {
    this.$store.commit("setEditor", this.$refs.stage.getNode());
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  methods: {
    print(sth) {
      console.log(sth);
    },

    /**
     * Resize the canvas on resizing of the window.
     */
    handleResize() {
      const stage = this.$refs.stage.getNode();
      this.configKonva.height = window.innerHeight - this.marginTop;
      this.configKonva.width = window.innerWidth;
      this.$nextTick(() => stage.draw()); // Resize on the next tick
    },

    /**
     * Scale the canvas depending on the pointer position when scrolling.
     * @param e scoll event
     */
    scroll(e) {
      const stage = this.$refs.stage.getNode();
      const scaleBy = 1.01;
      const oldScale = stage.scaleX();
      e.evt.preventDefault();

      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
      };

      const newScale =
        e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x:
          -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
      };
      stage.position(newPos);
      stage.batchDraw();
    }
  }
};
</script>

<style scoped></style>
