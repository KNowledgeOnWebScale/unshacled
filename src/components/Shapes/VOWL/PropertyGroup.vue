<template>
  <v-group>
    <!-- The first note, this contains all properties in constants > VOWL_SAME_NOTE -->
    <v-group v-if="singleNotePresent">
      <note :shape-id="this.$props.shapeId" :calculate-length="true" />
      <v-group :config="singleNote.config">
        <v-group
          v-for="constraint in singleNote.constraints"
          :key="constraint.id"
          :config="constraint.config"
        >
          <constraint
            :constraint-i-d="constraint.id"
            :shape-i-d="$props.shapeId"
            :node-shape="$props.nodeShape"
          ></constraint>
        </v-group>
      </v-group>
    </v-group>

    <!-- A group of notes, consisting of concatenated constraints, this contains all properties in constants > VOWL_CONCATTED_NOTE -->
    <v-group :config="concatted.config">
      <v-group
        v-for="constraint in concatted.constraints"
        :key="constraint.id"
        :config="constraint.config"
      >
        <note :shape-id="$props.shapeId" :calculate-length="false" :icon="constraint.icon" />
        <v-text :config="constraint.textConfig"/>
      </v-group>
    </v-group>

    <!-- A group of notes, each containing singular constraints, this contains all properties in constants > VOWL_SEPARATE_NOTE -->
    <v-group :config="separate.config">
      <v-group
        v-for="constraint in separate.constraints"
        :key="constraint.id"
        :config="constraint.config"
      >
        <note :shape-id="this.$props.shapeId" :calculate-length="false" :icon="constraint.icon" />
        <constraint
          :constraint-i-d="constraint.id"
          :shape-i-d="$props.shapeId"
          :node-shape="$props.nodeShape"
        ></constraint>
      </v-group>
    </v-group>
  </v-group>
</template>

<script>
import {
  NOTE_CORNER_INSET_VOWL,
  NOTE_HEIGHT,
  NOTE_ICON_SIZE_VOWL,
  NOTE_MARGIN_VOWL,
  NOTE_WIDTH_VOWL,
  TEXT_OFFSET,
  TEXT_SIZE
} from "../../../config/konvaConfigs";
import { TERM } from "../../../translation/terminology";
import Constraint from "./Constraint.vue";
import Note from "./Note.vue";

export default {
  name: "PropertyGroup",
  components: { Note, Constraint },
  props: {
    shapeId: {
      type: String,
      required: true
    },
    nodeShape: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      singleNotePresent: false,
      singleNote: {},
      concatted: {},
      separate: {}
    };
  },
  mounted() {
    this.getConfigs();
    this.$store.subscribe(mutation => {
      this.getConfigs();
    });
  },
  methods: {
    getConfigs() {
      const shapeId = this.$props.shapeId;

      const singleNoteKeys = Object.keys(this.$store.getters.singleNoteVOWLConstraints(shapeId));
      const separateKeys = Object.keys(this.$store.getters.separateNotesVOWLConstraints(shapeId));
      const rangeConstraints = this.$store.getters.rangeVOWLConstraints(shapeId);
      const lengthConstraints = this.$store.getters.lengthVOWLConstraints(shapeId);

      this.singleNotePresent = singleNoteKeys.length;

      const NOTE_HEIGHT_CALC = NOTE_HEIGHT + NOTE_MARGIN_VOWL;

      /* Collect all required info for the first note */
      let singleNoteHeight = 0;
      if (singleNoteKeys.length) {
        singleNoteHeight = singleNoteKeys.length * NOTE_HEIGHT + NOTE_MARGIN_VOWL;
        this.singleNote.config = {
          x: 0,
          y: 0,
          height: singleNoteHeight,
          width: NOTE_WIDTH_VOWL
        };

        const singleNoteConstraints = [];
        for (const [index, constraint] of singleNoteKeys.entries()) {
          singleNoteConstraints.push({
            id: constraint,
            config: {
              x: 0,
              y: index * NOTE_HEIGHT,
              height: NOTE_HEIGHT,
              width: NOTE_WIDTH_VOWL
            }
          });
        }
        this.singleNote.constraints = singleNoteConstraints;
      }
      
      let concatConstraints = [];

      /* Collect all required info for the range note */
      let concatHeight = 0;
      const rangeKeys = Object.keys(rangeConstraints);

      if (rangeKeys.length) {
        concatHeight += NOTE_HEIGHT_CALC;
        let start = 0;
        let end = "*";
        if (rangeKeys.includes(TERM.minExclusive)) {
          start = Number.parseInt(rangeConstraints[TERM.minExclusive][0]["@value"]) + 1;
        } else if (rangeKeys.includes(TERM.minInclusive)) {
          start = Number.parseInt(rangeConstraints[TERM.minInclusive][0]["@value"]);
        }

        if (rangeKeys.includes(TERM.maxExclusive)) {
          end = Number.parseInt(rangeConstraints[TERM.maxExclusive][0]["@value"]) - 1;
        } else if (rangeKeys.includes(TERM.maxInclusive)) {
          end = Number.parseInt(rangeConstraints[TERM.maxInclusive][0]["@value"]);
        }

        const rangeLabel = `range(${start}..${end})`;

        concatConstraints.push({
          id: "range",
          config: {
            x: 0,
            y: 0,
            width: NOTE_WIDTH_VOWL,
            height: concatHeight,
          },
          icon: "tachometer alternate",
          textConfig: {
            text: rangeLabel,
            align: "left",
            fontSize: TEXT_SIZE,
            x: 2 * TEXT_OFFSET + NOTE_ICON_SIZE_VOWL,
            y: NOTE_HEIGHT_CALC / 2 - (TEXT_SIZE/2),
            width: NOTE_WIDTH_VOWL - (2 * TEXT_OFFSET + NOTE_ICON_SIZE_VOWL)
          }
        });
      }

      /* Collect all required info for the length note */
      const lengthKeys = Object.keys(lengthConstraints);
      let lengthLabel;
      if (lengthKeys.length) {
        concatHeight += concatHeight
          ? NOTE_HEIGHT_CALC + NOTE_MARGIN_VOWL
          : NOTE_HEIGHT_CALC
        let start = 0;
        let end = "*";
        if (lengthKeys.includes(TERM.minLength)) {
          start = Number.parseInt(lengthConstraints[TERM.minLength][0]["@value"]);
        }
        if (lengthKeys.includes(TERM.maxLength)) {
          end = Number.parseInt(lengthConstraints[TERM.maxLength][0]["@value"]);
        }

        lengthLabel = `length(${start}..${end})`;

        concatConstraints.push({
          id: "length",
          config: {
            x: 0,
            y: rangeKeys.length ? NOTE_HEIGHT_CALC + NOTE_MARGIN_VOWL : 0,
            width: NOTE_WIDTH_VOWL,
            height: concatHeight
          },
          icon: "text width",
          textConfig: {
            text: lengthLabel,
            align: "left",
            fontSize: TEXT_SIZE,
            x: 2 * TEXT_OFFSET + NOTE_ICON_SIZE_VOWL,
            y: NOTE_HEIGHT_CALC / 2 - (TEXT_SIZE/2),
            width: NOTE_WIDTH_VOWL - (2 * TEXT_OFFSET + NOTE_ICON_SIZE_VOWL)
          }
        });
      }

      this.concatted.constraints = concatConstraints;

      this.concatted.config = {
        x: 0,
        y: singleNoteHeight ? singleNoteHeight + NOTE_MARGIN_VOWL : 0,
        width: NOTE_WIDTH_VOWL,
        height: concatHeight
      };

      this.separate = {
        config: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        constraints: []
      };
    }
  }
};
</script>

<style scoped></style>
