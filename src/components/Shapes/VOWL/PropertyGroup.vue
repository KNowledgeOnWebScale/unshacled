<template>
  <v-group>
    <!-- The first note, this contains all properties in constants > VOWL_SAME_NOTE -->
    <v-group v-if="singleNotePresent">
      <note :shape-id="$props.shapeId" :calculate-length="true" />
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
        :config="constraint.config.note"
      >
        <note
          :shape-id="$props.shapeId"
          :calculate-length="false"
          :icon="constraint.icon"
        />
        <v-group :config="constraint.config.constraint">
          <constraint
            :constraint-i-d="constraint.id"
            :shape-i-d="$props.shapeId"
            :node-shape="$props.nodeShape"
            :is-concat="true"
            :has-icon="true"
          ></constraint>
        </v-group>
      </v-group>
    </v-group>

    <!-- A group of notes, each containing singular constraints, this contains all properties in constants > VOWL_SEPARATE_NOTE -->
    <v-group :config="separate.config">
      <v-group
        v-for="constraint in separate.constraints"
        :key="constraint.id"
        :config="constraint.config.note"
      >
        <note
          :shape-id="$props.shapeId"
          :calculate-length="false"
          :icon="constraint.icon"
        />
        <v-group :config="constraint.config.constraint">
          <constraint
            :constraint-i-d="constraint.id"
            :shape-i-d="$props.shapeId"
            :node-shape="$props.nodeShape"
            :has-icon="true"
          ></constraint>
        </v-group>
      </v-group>
    </v-group>
  </v-group>
</template>

<script>
import {
  NOTE_HEIGHT,
  NOTE_HEIGHT_CALC,
  NOTE_ICON_SIZE_VOWL,
  NOTE_MARGIN_VOWL,
  NOTE_WIDTH_VOWL,
  TEXT_OFFSET
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
      singleNote: { constraints: [] },
      concatted: { constraints: [] },
      separate: { constraints: [] },
      updateConfigs: [
        "deleteConstraintFromShape",
        "addPredicate",
        "updateShape"
      ]
    };
  },
  mounted() {
    this.setConfigs();
    this.$store.subscribe(mutation => {
      if (this.updateConfigs.includes(mutation.type)) {
        this.setConfigs();
      }
    });
  },
  methods: {
    setConfigs() {
      const { shapeId } = this.$props;

      const singleNoteKeys = Object.keys(this.$store.getters.singleNoteVOWLConstraints(shapeId));
      const separateKeys = Object.keys(this.$store.getters.separateNotesVOWLConstraints(shapeId));
      const rangeConstraints = this.$store.getters.rangeVOWLConstraints(shapeId);
      const lengthConstraints = this.$store.getters.lengthVOWLConstraints(shapeId);

      this.singleNotePresent = singleNoteKeys.length;

      const singleNoteHeight = this.setSingleNoteConfigs(singleNoteKeys);

      const concatHeight = this.setConcatConfigs(
        { rangeConstraints, lengthConstraints },
        singleNoteHeight
      );

      const separateHeight = this.setSeparateConfigs(
        separateKeys,
        singleNoteHeight,
        concatHeight
      );

      this.emitHeight(singleNoteHeight, concatHeight, separateHeight);
    },

    setSingleNoteConfigs(singleNoteKeys) {
      /* Collect all required info for the first note */
      let singleNoteHeight = 0;
      if (singleNoteKeys.length) {
        singleNoteHeight =
          singleNoteKeys.length * NOTE_HEIGHT + NOTE_MARGIN_VOWL;
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
      } else {
        this.singleNote.constraints = [];
      }

      return singleNoteHeight;
    },

    setConcatConfigs(constraints, singleNoteHeight) {
      const { lengthConstraints, rangeConstraints } = constraints;

      const concatConstraints = [];

      /* Collect all required info for the range note */
      let concatHeight = 0;
      const rangeKeys = Object.keys(rangeConstraints);

      if (rangeKeys.length) {
        concatHeight += NOTE_HEIGHT_CALC;

        concatConstraints.push({
          id: "range",
          config: {
            note: {
              x: 0,
              y: 0,
              width: NOTE_WIDTH_VOWL,
              height: NOTE_HEIGHT_CALC
            },
            constraint: {
              x: NOTE_ICON_SIZE_VOWL + NOTE_MARGIN_VOWL,
              width: NOTE_WIDTH_VOWL - (2 * TEXT_OFFSET + NOTE_ICON_SIZE_VOWL),
              height: NOTE_HEIGHT_CALC
            }
          },
          icon: "range"
        });
      }

      /* Collect all required info for the length note */
      const lengthKeys = Object.keys(lengthConstraints);

      if (lengthKeys.length) {
        concatHeight += concatHeight
          ? NOTE_HEIGHT_CALC + NOTE_MARGIN_VOWL
          : NOTE_HEIGHT_CALC;

        concatConstraints.push({
          id: "length",
          config: {
            note: {
              x: 0,
              y: rangeKeys.length ? NOTE_HEIGHT_CALC + NOTE_MARGIN_VOWL : 0,
              width: NOTE_WIDTH_VOWL,
              height: NOTE_HEIGHT_CALC
            },
            constraint: {
              x: NOTE_ICON_SIZE_VOWL + NOTE_MARGIN_VOWL,
              width: NOTE_WIDTH_VOWL - (2 * TEXT_OFFSET + NOTE_ICON_SIZE_VOWL),
              height: NOTE_HEIGHT_CALC
            }
          },
          icon: "length"
        });
      }

      this.concatted.constraints = concatConstraints;

      this.concatted.config = {
        x: 0,
        y: singleNoteHeight ? singleNoteHeight + NOTE_MARGIN_VOWL : 0,
        width: NOTE_WIDTH_VOWL,
        height: concatHeight
      };

      return concatHeight;
    },

    setSeparateConfigs(separateKeys, singleNoteHeight, concatHeight) {
      if (separateKeys.length) {
        const separateConstraints = [];
        for (const [index, constraint] of separateKeys.entries()) {
          separateConstraints.push({
            id: constraint,
            config: {
              note: {
                x: 0,
                y: index * (NOTE_HEIGHT_CALC + NOTE_MARGIN_VOWL),
                width: NOTE_WIDTH_VOWL,
                height: NOTE_HEIGHT_CALC
              },
              constraint: {
                x: NOTE_ICON_SIZE_VOWL + NOTE_MARGIN_VOWL,
                width:
                  NOTE_WIDTH_VOWL - (2 * TEXT_OFFSET + NOTE_ICON_SIZE_VOWL),
                height: NOTE_HEIGHT_CALC
              }
            },
            icon: this.getIcon(constraint)
          });
        }

        this.separate.constraints = separateConstraints;
      } else {
        this.separate.constraints = [];
      }

      const separateY = singleNoteHeight
        ? concatHeight
          ? singleNoteHeight + concatHeight + 2 * NOTE_MARGIN_VOWL
          : singleNoteHeight + NOTE_MARGIN_VOWL
        : concatHeight
        ? concatHeight + NOTE_MARGIN_VOWL
        : 0;

      const separateHeight =
        separateKeys.length * (NOTE_HEIGHT_CALC + NOTE_MARGIN_VOWL);

      this.separate.config = {
        x: 0,
        y: separateY,
        height: separateHeight,
        width: NOTE_WIDTH_VOWL
      };

      return separateHeight;
    },

    emitHeight(singleNoteHeight, concatHeight, separateHeight) {
      let totalHeight = singleNoteHeight + concatHeight + separateHeight;
      const marginAmount =
        Number(Boolean(singleNoteHeight)) +
        Number(Boolean(concatHeight)) +
        Number(Boolean(separateHeight));
      if (marginAmount > 1) {
        totalHeight += (marginAmount - 1) * NOTE_MARGIN_VOWL;
      }
      this.$emit("new-height", totalHeight);
      this.$store.commit("updateVOWLConstraintHeights", {
        shapeID: this.$props.shapeId,
        height: totalHeight
      });
    },

    getIcon(constraint) {
      const iconMap = {
        [TERM.equals]: "eq",
        [TERM.disjoint]: "neq",
        [TERM.lessThan]: "lt",
        [TERM.lessThanOrEquals]: "le"
      };

      return iconMap[constraint];
    }
  }
};
</script>

<style scoped></style>
