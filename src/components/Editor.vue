<template>
  <v-stage
    id="stage"
    ref="stage"
    :config="configKonva"
    :draggable="true"
    @wheel="scroll"
  >
    <v-layer>
      <v-group
        v-for="(obj, key) in this.$store.getters.relationships"
        :key="key"
        ref="relationships"
      >
        <relationship
          :id="key"
          :from="obj.from"
          :to="obj.to"
          :constraint-i-d="obj.constraintID"
          :on-click-props="obj.onClick"
        ></relationship>
      </v-group>
      <div v-for="(obj, key) in this.$store.getters.propertyShapes" :key="key">
        <shape :id="key" :node-shape="false"></shape>
      </div>
      <div v-for="(obj, key) in this.$store.getters.nodeShapes" :key="key">
        <shape :id="key" :node-shape="true"></shape>
      </div>
    </v-layer>
  </v-stage>
</template>

<script>
import Shape from "./Shapes/Shape.vue";
import Relationship from "./Shapes/Relationship.vue";

export default {
  name: "Editor",
  components: { Relationship, Shape },

  data() {
    const marginTop = 40;
    return {
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
    window.addEventListener("resize", this.handleResize); // React to window resizing.
    this.handleResize();
  },

  updated() {
    // Put the arrows on the bottom layer.
    const layer = this.$refs.relationships;
    if (layer && layer.getNode) layer.getNode.zIndex(0);
  },

  methods: {
    /**
     * Resize the canvas on resizing of the window.
     */
    handleResize() {
      if (this.$refs.stage) {
        const stage = this.$refs.stage.getNode();
        this.configKonva.height = window.innerHeight - this.marginTop;
        this.configKonva.width = window.innerWidth;
        this.$nextTick(() => stage.draw()); // Resize on the next tick
      }
    },

    /**
     * Scale the canvas depending on the pointer position when scrolling.
     * This will zoom in on scrolling up and zoom out on scrolling down.
     * @param e scoll event
     */
    scroll(e) {
      const stage = this.$refs.stage.getNode();
      const scaleBy = 0.99; // 1.01 for other direction (down = zoom in, up = zoom out)
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
