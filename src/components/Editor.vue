<template>
  <v-stage ref="stage" :config="configKonva" @wheel="scroll">
    <v-layer>
      <div v-for="(obj, key) in this.$store.getters.nodeShapes" :key="key">
        <shape :id="key" :node-shape="true"></shape>
      </div>
      <div v-for="(obj, key) in this.$store.getters.propertyShapes" :key="key">
        <shape :id="key" :node-shape="false"></shape>
      </div>
    </v-layer>
  </v-stage>
</template>

<script>
import Shape from "./Shapes/Shape.vue";

export default {
  name: "Editor",
  components: { Shape },

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
