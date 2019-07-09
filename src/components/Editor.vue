<template>
  <v-stage
    ref="stage"
    :config="configKonva"
    style="background-color: lightgrey;"
    @wheel="scroll"
  >
    <v-layer>
      <div v-for="(obj, key) in this.$store.state.shapes" :key="key">
        <shape :id="key" @click="print(key)"></shape>
      </div>
    </v-layer>
  </v-stage>
</template>

<script>
import Shape from "./Shape.vue";

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
      },
      // TODO Remove this hard coded circle
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: "red",
        stroke: "black",
        strokeWidth: 4,
        draggable: "true"
      }
    };
  },
  mounted() {
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
