<template>
  <v-stage
    id="stage"
    ref="stage"
    :config="configKonva"
    :draggable="true"
    @wheel="scroll"
    @mouseover="handleResize"
  >
    <v-layer>
      <v-group
        v-for="(obj, key) in this.$store.getters.relationships"
        :key="relationshipUID(obj)"
        ref="relationships"
      >
        <relationship-u-m-l
          v-if="visualNotation === 'ShapeUML'"
          :id="key"
          :from="obj.from"
          :to="obj.to"
          :constraint-i-d="obj.constraintID"
          :on-click-props="obj.onClick"
        ></relationship-u-m-l>
        <relationship-v-o-w-l
          v-else-if="visualNotation === 'ShapeVOWL'"
          :id="key"
          :from="obj.from"
          :to="obj.to"
          :constraint-i-d="obj.constraintID"
          :on-click-props="obj.onClick"
        ></relationship-v-o-w-l>
      </v-group>

      <!-- The one-to-many indication for the logical relationships have to be rendered after the normal relationships,
      since these depend on the coordinates of the arrows-->
      <v-group
        v-for="(obj, key) in this.$store.getters.logicalRelationships"
        :key="logicalRelationshipUID(obj)"
        ref="logicalRelationships"
      >
        <logical-relationship-u-m-l
          v-if="visualNotation === 'ShapeUML'"
          :id="key"
          :from="obj.from"
          :to="obj.to"
          :constraint-i-d="obj.constraintID"
        ></logical-relationship-u-m-l>
        <logical-relationship-v-o-w-l
          v-if="visualNotation === 'ShapeVOWL'"
          :id="logicalRelationshipUID(obj)"
          :from="obj.from"
          :to="obj.to"
          :constraint-i-d="obj.constraintID"
        ></logical-relationship-v-o-w-l>
      </v-group>

      <div
        v-for="(obj, key) in this.$store.getters.nonSpecifiedShapes"
        :key="key"
      >
        <shape-u-m-l
          v-if="visualNotation === 'ShapeUML'"
          :id="key"
          :ref="key"
          :has-type="false"
        ></shape-u-m-l>
        <shape-v-o-w-l
          v-else-if="visualNotation === 'ShapeVOWL'"
          :id="key"
          :ref="key"
          :has-type="false"
        ></shape-v-o-w-l>
      </div>
      <div v-for="(obj, key) in this.$store.getters.propertyShapes" :key="key">
        <shape-u-m-l
          v-if="visualNotation === 'ShapeUML'"
          :id="key"
          :ref="key"
          :has-type="true"
          :node-shape="false"
        ></shape-u-m-l>
        <shape-v-o-w-l
          v-else-if="visualNotation === 'ShapeVOWL'"
          :id="key"
          :ref="key"
          :has-type="true"
          :node-shape="false"
        ></shape-v-o-w-l>
      </div>
      <div v-for="(obj, key) in this.$store.getters.nodeShapes" :key="key">
        <shape-u-m-l
          v-if="visualNotation === 'ShapeUML'"
          :id="key"
          :ref="key"
          :has-type="true"
          :node-shape="true"
        ></shape-u-m-l>
        <shape-v-o-w-l
          v-else-if="visualNotation === 'ShapeVOWL'"
          :id="key"
          :ref="key"
          :has-type="true"
          :node-shape="true"
        ></shape-v-o-w-l>
      </div>
    </v-layer>
  </v-stage>
</template>
<script>
import { MARGIN_TOP } from "../config/konvaConfigs";
import {
  relationshipUID,
  logicalRelationshipUID
} from "../util/relationshipUID";

/** Imports UML-style shape under different name */
const ShapeUML = () => import("./Shapes/UML/Shape");
/** Imports UML-style relationship under different name */
const RelationshipUML = () => import("./Shapes/UML/Relationship");
/** Imports UML-style logical relationship under different name */
const LogicalRelationshipUML = () => import("./Shapes/UML/LogicalRelationship");

/** Imports VOWL-style shape under different name */
const ShapeVOWL = () => import("./Shapes/VOWL/Shape");
/** Imports VOWL-style relationship under different name */
const RelationshipVOWL = () => import("./Shapes/VOWL/Relationship");
/** Imports VOWL-style logical relationship under different name */
const LogicalRelationshipVOWL = () => import("./Shapes/VOWL/LogicalRelationship");

export default {
  name: "Editor",
  components: {
    ShapeUML,
    RelationshipUML,
    LogicalRelationshipUML,
    ShapeVOWL,
    RelationshipVOWL,
    LogicalRelationshipVOWL
  },

  /**
   * ConfigKonva {{width: number, height: number}} the configuration for the Konva stage.
   * @returns {{configConva: object}}}
   */
  data() {
    return {
      configKonva: {
        width: window.innerWidth,
        height: window.innerHeight - MARGIN_TOP
      },
      visualNotation: this.$store.getters.visualNotation
    };
  },

  mounted() {
    /* Save a reference to the stage when it's loaded. */
    this.$store.commit("setEditor", this.$refs.stage.getNode());
    /* React to window resizing. */
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    const self = this;
    /* React to undo operations. */
    this.$store.subscribe(mutation => {
      /* Update the shape's positions to make sure the relationship arrows are updated accordingly. */
      if (mutation.type === "undo")
        for (const shape of Object.values(self.getShapeObjects()))
          if (shape) shape.updatePosition();
      if (mutation.type === "updateVisualNotation")
        this.visualNotation = this.$store.getters.visualNotation;
    });
  },

  updated() {
    /* Put the arrows on the bottom layer. */
    const layer = this.$refs.relationships;
    if (layer && layer.getNode) layer.getNode.zIndex(0);
  },

  methods: {
    /**
     * Resize the canvas on resizing of the window or when the div has resized.
     * Redraw the canvas on the next tick.
     */
    handleResize() {
      if (this.$refs.stage) {
        const editorContainer = document.getElementById("editorContainer");
        const dataContainer = document.getElementById("dataTextView");
        const navbar = document.getElementById("navbar");

        const stage = this.$refs.stage.getNode();
        const newWidth = window.innerWidth - dataContainer.offsetWidth;

        editorContainer.style.width = newWidth.toString();
        this.configKonva.height = window.innerHeight - navbar.offsetHeight;
        this.configKonva.width = newWidth;
        this.$nextTick(() => stage.draw());
      }
    },

    /**
     * Scale the canvas depending on the pointer position when scrolling.
     * This will zoom in on scrolling up and zoom out on scrolling down.
     * @param {any} e scoll event
     */
    scroll(e) {
      const stage = this.$refs.stage.getNode();
      const scaleBy = 0.99; // 1.01 for other direction (down = zoom in, up = zoom out)
      const oldScale = stage.scaleX();
      e.evt.preventDefault();

      /* Determine where the mouse points to. */
      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
      };

      /* Determine the new scale of the stage. */
      const newScale =
        e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale }); /* Rescale the stage. */

      /* Determine the new position of the stage. */
      const newPos = {
        x:
          -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
      };

      stage.position(newPos); /* Reposition the stage. */
      stage.batchDraw(); /* Redraw the stage. */
    },

    /**
     * Return all the shape objects that are currently visualized in the editor.
     */
    getShapeObjects() {
      const output = {};
      for (const ref of Object.keys(this.$refs))
        if (!["relationships", "stage"].includes(ref))
          output[ref] = this.$refs[ref][0];
      return output;
    },

    relationshipUID,
    logicalRelationshipUID
  }
};
</script>

<style scoped></style>
