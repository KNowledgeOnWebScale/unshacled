<template>
  <div>
    <sui-modal
      v-model="$store.state.mShape.shapeModal.show"
      @submit.prevent="cancel"
    >
      <sui-modal-header>
        Edit Shape
      </sui-modal-header>
      <sui-modal-content>
        <sui-form>
          <sui-form-field>
            <label for="id">IRI</label>
            <input id="id" v-model="values.id" @keyup="handleKeyPress" />
            <sui-label
              v-if="values.id !== '' && error()"
              basic
              pointing
              color="red"
            >
              Please enter a valid IRI
            </sui-label>
            <sui-label
              v-if="values.id !== '' && !unique()"
              basic
              pointing
              color="red"
            >
              Please enter a unique IRI
            </sui-label>
          </sui-form-field>
          <sui-form-fields class="two">
            <sui-form-field class="twelve wide">
              <label for="label">
                <!-- Node shape has a label, property shape has a name. -->
                {{ this.$props.modalProperties.nodeShape ? "Label" : "Name" }}
              </label>
              <input
                id="label"
                v-model="values.label"
                @keyup="handleKeyPress"
              />
            </sui-form-field>
            <sui-form-field class="four wide">
              <label for="labelLang">Language</label>
              <select
                id="labelLang"
                v-model="values.labelLang"
                class="ui fluid dropdown"
              >
                <option
                  v-for="language of getLanguageTags()"
                  :key="language"
                  :value="language"
                >
                  {{ getLanguages()[language].name }}
                </option>
              </select>
            </sui-form-field>
          </sui-form-fields>

          <sui-form-fields class="two">
            <sui-form-field class="twelve wide">
              <label for="description">Description</label>
              <input
                id="description"
                v-model="values.description"
                @keyup="handleKeyPress"
            /></sui-form-field>
            <sui-form-field class="four wide">
              <label for="descrLang">Language</label>
              <select
                id="descrLang"
                v-model="values.descrLang"
                class="ui fluid dropdown"
              >
                <option
                  v-for="language of getLanguageTags()"
                  :key="language"
                  :value="language"
                >
                  {{ getLanguages()[language].name }}
                </option>
              </select>
            </sui-form-field>
          </sui-form-fields>
        </sui-form>
      </sui-modal-content>
      <sui-modal-actions>
        <sui-button tab-index="0" @click="cancel">Cancel</sui-button>
        <sui-button tab-index="0" positive :disabled="error()" @click="confirm">
          Confirm
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import { XML_DATATYPES } from "../../util";
import { TERM } from "../../translation/terminology";
import { BLANK_REGEX, ENTER, IRI_REGEX, LABEL } from "../../util/constants";
import getValueType from "../../util/enums/ValueType";
import isoLangs, { isoLangsByName } from "../../util/enums/isoLangs";

export default {
  name: "EditShapeModal",
  props: {
    modalProperties: {
      required: true,
      type: Object
    }
  },
  /**
   * ID {string} the IRI of the shape.
   * Label {string} the label/name of the shape.
   * LabelLang {string} the language tag of the label.
   * Description {string} the description of the shape.
   * DescLang {string} the language tag of the description.
   * @returns {{values: {labelLang: string, descrLang: string, description: string, id: string, label: string}}}
   */
  data() {
    return {
      values: {
        id: "",
        label: "",
        labelLang: "en",
        description: "",
        descrLang: "en"
      }
    };
  },
  mounted() {
    /*
    The reason this watch is implemented is that this modal cannot work with `v-model="$props.something`.
    A component should not edit his properties directly, since a re-render in the parent component causes them
    to update (and override) their values. That's why this component keeps a copy of his properties, which he actually
    can modify directly. With every update of his properties (in `mConstraint.predicateModal`), he copies these values
    to his own state.
     */
    const self = this;
    this.$store.watch(
      () => self.$store.state.mShape.shapeModal,
      () => self.updateValues()
    );

    /* Focus the id input field when the modal is called. */
    this.$store.watch(
      () => self.$store.state.mShape.shapeModal.show,
      () => {
        if (self.$store.state.mShape.shapeModal.show)
          document.getElementById("id").focus();
      }
    );
  },
  methods: {
    /**
     * Get a list of language tags.
     * @returns {[string]}
     */
    getLanguageTags() {
      const sortedLangs = Object.keys(isoLangsByName()).sort();
      return sortedLangs.map(lang => isoLangsByName()[lang]);
    },
    /**
     * Get the language tags mapped to their language object.
     * `isoLangs` cannot be called directly from HTML.
     * @returns {object} map of language tags to language object.
     */
    getLanguages() {
      return isoLangs;
    },

    /**
     * Confirm when the user presses the enter key.
     * @param {any} e key press event
     */
    handleKeyPress(e) {
      if (e.keyCode === ENTER && !this.error()) this.confirm();
    },

    /**
     * Confirm the modal.
     * Update the shape ID, name/label and description accordingly.
     */
    confirm() {
      const { id, label, labelLang, description, descrLang } = this.values;
      const modProps = this.$props.modalProperties;

      /* Close the modal. */
      this.$store.commit("toggleEditShapeModal", {});

      /* Update the shape ID. */
      this.$store.dispatch("editShape", {
        oldID: modProps.id,
        newID: id
      });
      /* Update the shape label (in case of a node shape) or name (in case of a property shape). */
      this.handleConstraint(
        modProps.nodeShape ? LABEL : TERM.name,
        label,
        labelLang
      );
      /* Update the shape description. */
      this.handleConstraint(TERM.description, description, descrLang);
    },

    /**
     * Handle the update of the given constraint.
     * @param {string} constraintID the key of the constraint.
     * @param {string} value the value of the constraint.
     * @param {string} language the language tag for this value.
     */
    handleConstraint(constraintID, value, language) {
      const shapeID = this.values.id;

      /* Check if the user has filled in a value. */
      if (value && value !== "") {
        const shape = this.$store.getters.shapeWithID(shapeID);

        /* Update or add the value accordingly. */
        if (shape[constraintID]) {
          /* Update the value of the existing constraint if the shape already has this predicate. */
          this.$store.dispatch("updateConstraint", {
            shapeID,
            constraintID,
            newValue: [{ "@value": value, "@language": language }]
          });
        } else {
          /* Add the predicate to the shape if needed. */
          this.$store.dispatch("addPredicate", {
            shapeID,
            predicate: constraintID,
            valueType: getValueType(constraintID),
            input: value,
            object: XML_DATATYPES.string,
            language
          });
        }
      } else {
        /* Delete the value if the user has not filled in anything. */
        this.$store.dispatch("deleteConstraintFromShapeWithID", {
          shapeID,
          constraintID
        });
      }
    },

    /**
     * Cancel and close the modal.
     */
    cancel() {
      this.$store.commit("toggleEditShapeModal", {});
    },

    /**
     * Update the data values using the properties.
     * This method is called whenever `this.$props.modalProperties` changes.
     */
    updateValues() {
      const {
        id,
        label,
        labelLang,
        description,
        descrLang
      } = this.$props.modalProperties;
      this.values = { id, label, labelLang, description, descrLang };
    },

    /**
     * Checks if the entered values are valid.
     * @returns {boolean} value to indicate if the entered value is valid.
     */
    error() {
      return !(
        IRI_REGEX.test(this.values.id) || BLANK_REGEX.test(this.values.id)
      );
    },

    /**
     * Checks if the entered ID is unique.
     * @returns {boolean} value to indicate if the entered id is unique.
     */
    unique() {
      return (
        this.values.id === this.$props.modalProperties.id || // The ID hasn't changed.
        !Object.keys(this.$store.getters.shapes).includes(this.values.id) // The changed ID is unique.
      );
    }
  }
};
</script>

<style scoped></style>
