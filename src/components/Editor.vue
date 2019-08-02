<template>
  <v-stage
    ref="stage"
    :config="configKonva"
    @wheel="scroll"
    @mousedown="startPan"
    @mousemove="pan"
    @mouseup="stopPan"
  >
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
      panning: false,
      previousPosition: undefined,
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
     * Determine the current position and start panning.
     */
    startPan() {
      this.panning = true;
      this.previousPosition = this.$refs.stage.getNode().getPointerPosition();
    },

    /**
     * Stop panning.
     */
    stopPan() {
      this.panning = false;
      this.previousPosition = undefined;
    },

    /**
     * Move the whole stage while the user is dragging the canvas.
     */
    pan() {
      if (this.panning) {
        const stage = this.$refs.stage.getNode();
        // Determine the current position and the difference with the previous one.
        const newPosition = stage.getPointerPosition();
        const delta = {
          x: newPosition.x - this.previousPosition.x,
          y: newPosition.y - this.previousPosition.y
        };

        // Calculate the new position of the stage.
        const sp = {
          x: stage.x() + delta.x,
          y: stage.y() + delta.y
        };

        // Set the stage to this position and draw the contents.
        stage.position(sp);
        stage.batchDraw();
        this.previousPosition = newPosition;
      }
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
