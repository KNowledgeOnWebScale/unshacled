import { clone } from "ramda";
import Vue from "vue";
import Vuex from "vuex";
import EXAMPLE from "./util/examples";
import { HEIGHT } from "./util/konvaConfigs";
import { format } from "./util/enums/format";
import { getConstraints } from "./util/constraintSelector";
import { urlToName, extractUrl } from "./util/nameParser";
import { getNonOverlappingCoordinates } from "./util";
import { ParserManager } from "./parsing/parserManager";
import { TranslatorManager } from "./translation/translatorManager";
import ValidatorManager from "./validation/validatorManager";
import { SerializerManager } from "./parsing/serializerManager";
import { ETF } from "./util/enums/extensionToFormat";
import ShaclDictionary from "./translation/shaclDictionary";
import { possiblePredicates, possibleObjects } from "./util/vocabulary";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: null,
    model: [],
    format: format.SHACL,
    // relationships: {}, // TODO remove this
    yValues: {},
    coordinates: {},
    showNodeShapeModal: false,
    showClearModal: false,
    showValidationReportModal: false,
    predicateModal: {
      show: false,
      id: String,
      type: String,
      predicate: String
    },
    validationReport: "hello",
    dataFile: {},
    dataFileExtension: String
  },
  mutations: {
    /**
     * Takes a file, reads the extension and depending on the format uses the correct parser to turn it into an intern model
     * @param state
     * @param file The uploaded file
     * */
    uploadSchemaFile(state, file) {
      const reader = new FileReader();
      const fileExtension = file.name.split(".").pop();
      reader.readAsText(file);
      reader.onload = function(event) {
        ParserManager.parse(event.target.result, fileExtension).then(e => {
          state.model = e;
        });
      };
    },

    addPredicate(state, args) {
      const propertyShapeId = args.id;
      const predicate = args.pred;
      const valueType = args.vt;
      const obj = state.model.filter(e => e["@id"] === propertyShapeId).pop();
      if (valueType === "id") {
        obj[predicate] = [];
        obj[predicate].push({ "@id": args.input });
      }
      if (valueType === "type") {
        obj[predicate] = [];
        obj[predicate].push({ "@type": args.object, "@value": args.input });
      }
      if (valueType === "lists") {
        obj[predicate] = [];
        obj[predicate].push({ "@id": args.input });
      }
      state.predicateModal.show = !state.predicateModal.show;
    },

    togglePredicateModal(state, args) {
      state.predicateModal.show = !state.predicateModal.show;
      state.predicateModal.id = args.id;
      state.predicateModal.type = args.type;
    },

    changePredicate(state, pred) {
      state.predicateModal.predicate = pred;
    },

    /**
     * Recieves a datafile and takes its content to the state
     * @param state
     * @param file The file containing data to check on
     * */
    uploadDataFile(state, file) {
      const reader = new FileReader();
      state.dataFileExtension = file.name.split(".").pop();
      reader.readAsText(file);
      reader.onload = function(event) {
        state.dataFile = event.target.result;
      };
    },

    validate(state) {
      SerializerManager.serialize(state.model, ETF.ttl).then(e => {
        ValidatorManager.validate(state.dataFile, e, state.format)
          .then(e => {
            state.validationReport = e;
            state.showValidationReportModal = true;
          })
          .catch(e => console.log(`failure : ${e}`));
      });
    },

    /**
     * Save a reference to the editor.
     * @param state
     * @param reference
     */
    setEditor(state, reference) {
      state.editor = reference;
    },

    /**
     * Load in some example data
     * @param state
     */
    loadExample(state) {
      console.log("Loading example...");
      this.commit("clear"); // Clear the existing data first.

      const example = EXAMPLE.model[0];
      state.model = [];
      for (const element of example) {
        state.model.push(clone(element)); // Deep copy
      }

      // Update y values and set coordinates to zero
      for (const shape of state.model) {
        this.commit("updateYValues", shape["@id"]);
        const { x, y } = getNonOverlappingCoordinates({
          coordinates: state.coordinates
        });
        Vue.set(state.coordinates, shape["@id"], { x, y });
      }
    },

    /* ADD ========================================================================================================== */

    /**
     * Add the given shape to the state and set its coordinates to zero.
     * @param state
     * @param object
     */
    addShape(state, object) {
      state.model.push(object);
      const { x, y } = getNonOverlappingCoordinates({
        coordinates: state.coordinates
      });
      Vue.set(state.coordinates, object["@id"], { x, y });
      this.commit("updateYValues", object["@id"]);
    },

    /**
     * Add a property with the given ID and value to the node with the given ID.
     * @param state
     * @param args
     */
    addPropertyToShape(state, args) {
      const { nodeID, propertyID, propertyValue } = args;
      // FIXME should not be put in list if it is a list already
      Vue.set(state.model[nodeID], propertyID, [propertyValue]);
      // TODO complete this
    },

    /**
     * Add the given property ID to the given shape.
     * @param state
     * @param args
     *            propertyID the ID of the property that should be added.
     *            shape the shape the property should be added to.
     */
    addPropertyIDToShape(state, args) {
      const { propertyID, shape } = args;
      // FIXME this assumes properties, not constraints or targetNodes or sth
      const p = shape["https://2019.summerofcode.be/unshacled#property"];
      if (!p) {
        shape["https://2019.summerofcode.be/unshacled#property"] = [];
      }
      shape["https://2019.summerofcode.be/unshacled#property"].push({
        "@id": propertyID
      });
    },

    /* EDIT ========================================================================================================= */

    /**
     * Update the shape's id.
     * @param state
     * @param args
     *            index the index of the shape that should be updated.
     *            newID the shape's new ID.
     */
    updateShapeID(state, args) {
      const { index, newID } = args;
      Vue.set(state.model[index], "@id", newID);
    },

    /**
     * Update the given property shape's ID.
     * @param state
     * @param args
     *            shape the property shape that should be updated,
     *            newID the shape's new ID.
     */
    updatePropertyShapeID(state, args) {
      const { shape, newID } = args;
      Vue.set(shape, "@id", newID);

      // Update the path with the new ID.
      const name = urlToName(newID);
      shape["https://2019.summerofcode.be/unshacled#path"][0][
        "@id"
      ] = `http://example.org/ns#${name}`;
    },

    /**
     * TODO
     * @param state
     */
    toggleValidationReport(state) {
      event.preventDefault();
      state.showValidationReportModal = !state.showValidationReportModal;
    },

    /**
     * Update the coordinates and values of the given shape.
     * @param state
     * @param args
     *            oldID the shape's old ID.
     *            newID the shape's new ID.
     */
    updateLocations(state, args) {
      const { oldID, newID } = args;

      // Update coordinates
      Vue.set(state.coordinates, newID, state.coordinates[oldID]);
      if (oldID !== newID) Vue.delete(state.coordinates, oldID);

      // Update yValues
      Vue.set(state.yValues, newID, state.yValues[oldID]);
      if (oldID !== newID) Vue.delete(state.yValues, oldID);
    },

    /* DELETE ======================================================================================================= */

    /**
     * Delete the shape at the given index.
     * @param state
     * @param index
     */
    deleteShapeAtIndex(state, index) {
      Vue.delete(state.model, index);
    },

    /**
     * Delete the coordinates and y values of the shape with the given id.
     * @param state
     * @param id
     */
    deleteShapeLocations(state, id) {
      Vue.delete(state.coordinates, id);
      Vue.delete(state.yValues, id);
    },

    /**
     * Delete the property with the given ID from the given shape.
     * @param state
     * @param args
     *            shape the shape from which the property should be removed..
     *            propertyID the ID of the property that should be removed.
     */
    deletePropertyFromShape(state, args) {
      const { shape, propertyID } = args;
      const properties =
        shape["https://2019.summerofcode.be/unshacled#property"];
      for (const p in properties) {
        if (properties[p]["@id"] === propertyID) Vue.delete(properties, p);
      }
    },

    /* HELPERS ====================================================================================================== */

    /**
     * Update the y values of the properties of the given node.
     * @param state
     * @param nodeID
     */
    updateYValues(state, nodeID) {
      // Update the y values of the properties.
      Vue.set(state.yValues, nodeID, {});

      let node;
      for (const item of state.model) {
        if (item["@id"] === nodeID) node = item;
      }

      // FIXME code duplication, find a way to use `shapeProperties` >.<
      const propertyObjects =
        node["https://2019.summerofcode.be/unshacled#property"];

      // Get the references to property shapes.
      const properties = [];
      if (propertyObjects) {
        for (const p of propertyObjects) properties.push(p["@id"]);
      }

      // The other properties.
      const ignored = [
        "@id",
        "@type",
        "https://2019.summerofcode.be/unshacled#property"
      ];

      // Get the IDs form all the constraints.
      const constraints = [];
      for (const c in node) {
        if (!ignored.includes(c)) constraints.push(c);
      }

      // Get the IDs from all the properties.
      for (const p in node) {
        if (!ignored.includes(p)) properties.push(p[0]["@id"]);
      }

      // Calculate their y values.
      let i = 1;
      for (const con of constraints) {
        Vue.set(state.yValues[nodeID], con, i * HEIGHT);
        i += 2; // Constraints need twice the height.
      }
      for (const prop of properties) {
        Vue.set(state.yValues[nodeID], prop, i * HEIGHT);
        i += 1;
      }
      // Add y values for the add button.
      Vue.set(state.yValues[nodeID], "newProperty", i * HEIGHT);
      Vue.set(state.yValues[nodeID], "addButton", i * HEIGHT + HEIGHT / 4);
    },

    /**
     * Update the coordinates of the given shape.
     * @param state
     * @param args
     *    node: the ID of the node shape whose location should be updated.
     *    x: the new x coordinate.
     *    y: the new y coordinate.
     */
    updateCoordinates(state, args) {
      const { node, x, y } = args;
      const coords = { x, y };
      Vue.set(state.coordinates, node, coords);

      /*
      for (const prop in state.relationships) {
        if (prop.includes(node)) {
          const changedKey = node;
          const otherKey = prop.replace(changedKey, "");
          state.relationships[prop].coords = [
            state.coordinates[otherKey].x,
            state.coordinates[otherKey].y,
            state.coordinates[changedKey].x,
            state.coordinates[changedKey].y
          ];
        }
      }
       */
    },

    /**
     * Toggle the visibility of the node shape modal.
     * @param state
     */
    toggleShapeModal(state) {
      event.preventDefault();
      state.showNodeShapeModal = !state.showNodeShapeModal;
    },

    /**
     * Toggle the visibility of the clear modal.
     * @param state
     */
    toggleClearModal(state) {
      event.preventDefault();
      state.showClearModal = !state.showClearModal;
    },

    /**
     * Clear all shapes and properties from the current state.
     * @param state the current state
     */
    clear(state) {
      console.log("Clear!");
      state.model = [];
      state.coordinates = {};
      state.yValues = {};
    }
  },
  actions: {
    /* ADD ========================================================================================================== */

    /**
     * Add an empty node shape with the given id.
     * @param store
     * @param id
     */
    addNodeShape(store, id) {
      this.commit("addShape", {
        "@id": id,
        "@type": ["https://2019.summerofcode.be/unshacled#NodeShape"],
        "https://2019.summerofcode.be/unshacled#property": [],
        "https://2019.summerofcode.be/unshacled#targetNode": []
      });
    },

    /**
     * Add a property shape with the given id.
     * @param store
     * @param id
     */
    addPropertyShape(store, id) {
      this.commit("addShape", {
        "@id": id,
        "https://2019.summerofcode.be/unshacled#path": [
          `http://example.org/ns#${id}`
        ]
      });
    },

    /**
     * Add a property with the given id and value to the node with the given id.
     * @param store
     * @param args
     *              nodeID id of the node
     *              propertyID id of the property we want to add
     *              propertyValue object with the value of the property we want to add
     */
    addPropertyToNode(store, args) {
      const { nodeID, propertyID } = args;

      if (propertyID !== "newProperty" && propertyID !== "") {
        // Check if the new property name is already an existing PropertyShape.
        if (!store.getters.propertyShapes[propertyID]) {
          // If not, create a new PropertyShape that is a copy of the original one.
          const property = {
            "@id": propertyID,
            "https://2019.summerofcode.be/unshacled#path": [
              { "@id": `http://example.org/ns#${propertyID}` } // TODO PascalCase
            ]
          };

          // Add the shape to the state.
          this.commit("addShape", property); // this works as intended
        }

        const shape = store.getters.shapeWithID(nodeID);
        // Put the new value in the list of shape properties
        this.commit("addPropertyIDToShape", { propertyID, shape });
        // Update the y values
        this.commit("updateYValues", nodeID);
      }
    },

    /**
     * Takes two keys from nodeshapes and uses them to add a relationship to the state
     * @param state
     * @param keys contains two keys, which can be queried using keys.one and keys.two.
     */
    /*
    addRelationship(state, keys) {
      Vue.set(state.relationships, keys.one + keys.two, {
        "@id": keys.one + keys.two,
        one: keys.one,
        two: keys.two,
        coords: [
          state.coordinates[keys.two].x,
          state.coordinates[keys.two].y,
          state.coordinates[keys.one].y,
          state.coordinates[keys.one].x
        ]
      });
    },
     */

    /* EDIT ========================================================================================================= */

    /**
     * Edit the id of the given node shape.
     * @param store
     * @param args
     *    oldID: the old ID we want to change.
     *    newID: the new ID for the node shape.
     */
    editNodeShape(store, args) {
      const { oldID, newID } = args;
      const newURL = extractUrl(oldID) + newID;

      // If the ID has changed
      if (oldID !== newURL) {
        // Update the shape's ID
        const index = store.getters.indexWithID(oldID);
        this.commit("updateShapeID", { index, newID: newURL }); // OK

        // Update Relationships TODO
        /*
        for (let prop in state.relationships) {
          if (state.relationships[prop].one === oldID)
            state.relationships[prop].one = newID;
          if (state.relationships[prop].two === oldID)
            state.relationships[prop].two = newID;
          prop = state.relationships[prop].one + state.relationships[prop].two;
        }
         */

        // Update the coordinates and y values.
        this.commit("updateLocations", { oldID, newID: newURL });
      }
    },

    /**
     * Edit the given property in the given node shape.
     * If the new property ID already exists, this will make a copy
     * @param store
     * @param args
     */
    editPropertyInNode(store, args) {
      const { nodeID, oldID, newID } = args;

      // Check if the new property name is already an existing PropertyShape.
      if (!store.getters.propertyShapes[newID]) {
        // If not, create a new PropertyShape that is a copy of the original one.
        const copied = Vue.util.extend({}, store.getters.propertyShapes[oldID]);
        copied["@id"] = newID;

        const name = urlToName(newID);
        copied["https://2019.summerofcode.be/unshacled#path"][0][
          "@id"
        ] = `http://example.org/ns#${name}`; // TODO dromedarisCaseOrSomething

        // Add the shape to the state.
        this.commit("addShape", copied);
      }

      const shape = store.getters.shapeWithID(nodeID);
      // Put the new value in the list of shape properties
      this.commit("addPropertyIDToShape", { propertyID: newID, shape });
      // Remove the old value from the list of shape properties.
      this.commit("deletePropertyFromShape", { shape, propertyID: oldID });
      // Update the y values
      this.commit("updateYValues", nodeID);
    },

    /**
     * Edit the ID of a property shape.
     * This will update the property list of every node shape that contains this property shape.
     * @param store
     * @param args
     */
    editPropertyShape(store, args) {
      const { oldID, newID } = args;

      // Update the state's shapes.
      const shape = store.getters.shapeWithID(oldID);
      this.commit("updatePropertyShapeID", { shape, newID });
      for (const node of store.state.model) {
        if (store.getters.shapeProperties(node["@id"]).indexOf(oldID) !== -1) {
          this.commit("deletePropertyFromShape", {
            shape: node,
            propertyID: oldID
          });
          this.commit("addPropertyIDToShape", {
            shape: node,
            propertyID: newID
          });
          this.commit("deletePropertyFromShape", {
            shape: node,
            propertyID: oldID
          });
        }
      }
      this.commit("updateLocations", { oldID, newID });

      // Update the y values of the properties.
      for (const node of store.state.model) {
        this.commit("updateYValues", node["@id"]);
      }
    },

    /* DELETE ======================================================================================================= */

    /**
     * Delete the node shape with the given id.
     * @param store
     * @param id
     */
    deleteNodeShape(store, id) {
      this.commit("deleteShapeAtIndex", store.getters.indexWithID(id));
      this.commit("deleteShapeLocations", id);
    },

    /**
     * Delete the property shape with the given id.
     * @param store
     * @param id
     */
    deletePropertyShape(store, id) {
      // Check every nodeShape if it contains the given property.
      for (const shape of store.state.model) {
        const properties =
          shape["https://2019.summerofcode.be/unshacled#property"];

        for (const p in properties) {
          if (properties[p]["@id"] === id) {
            // Delete the property from the node and update the y values.
            properties.splice(p, 1);
            this.commit("updateYValues", shape["@id"]);
          }
        }
      }
      // Remove the property from the state
      this.commit("deleteShapeAtIndex", store.getters.indexWithID(id));
      this.commit("deleteShapeLocations", id);
    },

    /**
     * Delete the given property from the given node shape.
     * @param store
     * @param args
     *            node the id of the node shape
     *            prop the id of the property that should be removed from the shape
     */
    deletePropFromNode(store, args) {
      const { node, prop } = args;

      const shape = store.getters.shapeWithID(node);
      const properties =
        shape["https://2019.summerofcode.be/unshacled#property"];

      for (const p in properties) {
        if (properties[p]["@id"] === prop) {
          // Delete the property from the node and update the y values.
          properties.splice(p, 1);
        }
      }

      // Update the y values
      this.commit("updateYValues", node);
    },

    /**
     * TODO
     * @param store
     * @param args
     */
    deleteConstraintFromShape(store, args) {
      const { shapeID, constraint } = args;
      const shape = this.getters.shapeWithID(shapeID);
      Vue.delete(shape, constraint);
    }
  },
  getters: {
    /**
     * Get all the constraints for the current format.
     * @param state
     * @returns {null}
     */
    validators: state => {
      return getConstraints(state.format);
    },

    /**
     * Get the shape object with the given ID.
     * @param state
     * @returns {null}
     */
    shapeWithID: state => id => {
      for (const item of state.model) {
        if (item["@id"] === id) return item;
      }
      return null;
    },

    /**
     * Get the index of the shape object with the given ID.
     * @param state
     * @returns {string|number}
     */
    indexWithID: state => id => {
      for (const i in state.model) {
        if (state.model[i]["@id"] === id) return i;
      }
      return -1;
    },

    /**
     * Returns a map of the shape ID's to their respective objects.
     * @param state
     */
    shapes: state => {
      const shapes = {};
      for (const item of state.model) {
        shapes[item["@id"]] = item;
      }
      return shapes;
    },

    /**
     * Get a dictionary mapping ID's to the respective node shape objects.
     * @param state
     */
    nodeShapes: state => {
      const nodeShapes = {};
      for (const item of state.model) {
        if (item["@type"]) {
          nodeShapes[item["@id"]] = item;
        }
      }
      return nodeShapes;
    },

    /**
     * Get a dictionary mapping ID's to the respective property shape objects.
     * @param state
     */
    propertyShapes: state => {
      const propertyShapes = {};
      for (const item of state.model) {
        if (!item["@type"]) {
          propertyShapes[item["@id"]] = item;
        }
      }
      return propertyShapes;
    },

    /**
     * Get a list of property ID's for the node with the given ID.
     * @param state
     * @returns {function(*): Array}
     */
    shapeProperties: state => shapeID => {
      let node;
      for (const shape of state.model) {
        if (shape["@id"] === shapeID) {
          node = shape;
        }
      }

      const propertyObjects =
        node["https://2019.summerofcode.be/unshacled#property"];
      const properties = [];

      if (propertyObjects) {
        // Get the references to property shapes
        for (const p of propertyObjects) {
          properties.push(p["@id"]);
        }
        // Get the other properties
        const ignored = [
          "@id",
          "@type",
          "https://2019.summerofcode.be/unshacled#property",
          "https://2019.summerofcode.be/unshacled#targetNode"
        ];
        for (const p in node) {
          if (!ignored.includes(p)) properties.push(p[0]["@id"]);
        }
      }
      return properties;
    },

    /**
     * Get a map of the constraints of the shape with the given ID.
     * @param state
     * @returns {Function}
     */
    shapeConstraints: state => shapeID => {
      const constraints = {};
      let node;
      for (const shape of state.model) {
        if (shape["@id"] === shapeID) {
          node = shape;
        }
      }

      const ignored = [
        "@id",
        "@type",
        "https://2019.summerofcode.be/unshacled#property"
      ];
      for (const prop in node) {
        // Only handle the constraints that are not ignored
        if (ignored.indexOf(prop) < 0) {
          if (node[prop].length > 1) {
            // Get the ID of every element in the list
            const properties = [];
            for (const p of node[prop]) {
              properties.push(p["@id"]);
            }
            constraints[prop] = properties;
          } else {
            constraints[prop] = node[prop];
          }
        }
      }
      return constraints;
    },

    /**
     * TODO
     * @param state
     * @returns {string}
     */
    getValidationReport: state => {
      return state.ValidationReport;
    },

    /**
     * Returns the Json Internal model.
     * @param state
     * @returns {state.internalModel|{}|string}
     */
    getInternalModelInJson: state => {
      return state.model;
    },

    /**
     * Returns the internal model in ttl format.
     * @param state
     * @returns {any}
     */
    getInternalModelInTurtle: state => {
      return TranslatorManager.translateToLanguage(state.model, state.format);
    },

    /**
     * Returns the data to validate.
     * @param state
     * @returns {state.dataFile|{}}
     */
    getDataFile: state => {
      return state.dataFile;
    },

    predicates: () => type => {
      return possiblePredicates(ShaclDictionary.TERM[type]);
    },
    objects: state => {
      return possibleObjects(state.predicateModal.predicate);
    }
  }
});
