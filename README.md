# [UnSHACLed](https://osoc19.github.io/unshacled/)
Visual editor for shape constraint languages.
## Contents
1. [Overview](#Overview)
2. [Setup](#Setup)
3. [Concepts](#Concepts)
4. [Contribute](#Contribute)

## Overview
At the time of writing this editor supports SHACL, future support for ShEx is envisioned. This editor makes abstraction of specific constraint languages and exposes concepts in a simple visual interface.

### Functionalities
- [x] Import SHACL files
- [x] Add, remove and edit shapes
- [x] Add, remove and edit properties
- [x] Add, remove and edit constraints
- [x] Export SHACL files
- [x] Validate data files

### Concepts
An [internal model](#Model) is used to represent shapes which can be edited in the browser. Using existing shape files requires these to be imported and [translated to this model](#Translation) before use. Editing is done in a [visual editor](#Interface).

## Setup
To start the application, run the following commands:
1. Install dependencies
```
npm install
```
2. Compile and hot-reload for development
```
npm run serve
```

The documentation can be generated in `/docs` using the following command:
```
npm run docs
```

### Useful while developing: testing and linting
```
npm run test // Run tests
npm run lint // Check and fix code style
```

### Compile and minify for production
Execute this command, then move the contents of `/dist` into the `gh-pages` branch. The application will be automatically deployed to [UnSHACLed.com](https://unshacled.com).
```
npm run build
```

## Concepts
### Model
The internal model used is based on SHACL in JSON-LD format. An example:
```json
[
  {
    "@id": "_:b1",
    "https://2019.summerofcode.be/unshacled#path": [
      {
        "@id": "http://schema.org/birthDate"
      }
    ],
    "https://2019.summerofcode.be/unshacled#lessThan": [
      {
        "@id": "http://schema.org/deathDate"
      }
    ],
    "https://2019.summerofcode.be/unshacled#maxCount": [
      {
        "@value": "1",
        "@type": "http://www.w3.org/2001/XMLSchema#integer"
      }
    ]
  },
  {
    "@id": "_:b2",
    "https://2019.summerofcode.be/unshacled#path": [
      {
        "@id": "http://schema.org/gender"
      }
    ],
    "https://2019.summerofcode.be/unshacled#in": [
      {
        "@list": [
          {
            "@value": "female"
          },
          {
            "@value": "male"
          }
        ]
      },
    "https://2019.summerofcode.be/unshacled#name": [
      {
        "@value": "gender",
        "@language": "en
      }
    ]
  },
  {
    "@id": "_:b6",
    "https://2019.summerofcode.be/unshacled#path": [
      {
        "@id": "http://schema.org/streetAddress"
      }
    ],
    "https://2019.summerofcode.be/unshacled#datatype": [
      {
        "@id": "http://www.w3.org/2001/XMLSchema#string"
      }
    ]
  },
  {
    "@id": "http://schema.org/AddressShape",
    "@type": [
      "https://2019.summerofcode.be/unshacled#NodeShape"
    ],
    "https://2019.summerofcode.be/unshacled#closed": [
      {
        "@value": "true",
        "@type": "http://www.w3.org/2001/XMLSchema#boolean"
      }
    ],
    "https://2019.summerofcode.be/unshacled#property": [
      {
        "@id": "_:b6"
      },
      {
        "@id": "_:b7"
      }
    ]
  }
]
```

### Translation
Existing shape files need to be translated to the internal model before use. This translation consists of two steps:
1. [Parse](#Parsing-and-serialization) to JSON-LD: the internal model structure is based on SHACL in JSON-LD format.
2. [Translate](#Convert-terminology) SHACL specific terminology to interal terminology.

#### Parsing and serialization
Classes responsible for parsing or serialization are in `src/parsing`. Parsing can be done from various formats such as Turtle or N3 to a JSON-LD object via the `parserManager` which is responsible for assigning a compatible parser. The same holds for the `serializerManager` which allows to serialize from JSON-LD to other formats.

#### Convert terminology
Replacing specific terminology with our own is the responsibility of the `translatorManager` in `src/translation` e.g. `http://www.w3.org/ns/shacl#and` becomes `https://2019.summerofcode.be/unshacled#and`.


Translate between internal uris and SHACL uris. `TranslatorManager` is responsible for choosing the correct translator e.g. `ShaclTranslator` translates from and to SHACL.

### Interface
[Vue.js](https://vuejs.org/) is used to wire the application. It comes with libraries that allow state management and drawing on a canvas. The [VueX](https://vuex.vuejs.org/) state management library is used to maintain a model and keeps components loosely coupled. Data is kept in the store and can only be modified using [mutations](https://vuex.vuejs.org/guide/mutations.html) and [actions](https://vuex.vuejs.org/guide/actions.html). [Konva.js](https://konvajs.org/) is used to easily draw on the canvas via the [Vue Konva](https://github.com/konvajs/vue-konva) library.

## Contribute
This section contains information to help contribute to this project.

### Linting
To ensure code style consistency we use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) which are configured in `.eslintrc.js`.

### Testing
Testing is done with [Jest.js](https://jestjs.io/) and [Vue Jest](https://github.com/vuejs/vue-jest). Unit tests are kept in the same directory as the classes they test and share the same filename but with extension e.g. `somefile.js` and `somefile.test.js`. All tests can be executed using the following command: `npm run test`

### Documentation
Make sure to document your code in [JSDoc style](https://jsdoc.app/). Documentation is generated using the command: `npm run docs`

### `main`
Wires libraries and configuration.

### `store`
Contains application logic such as the the state which maintains the internal model and methods to access or modify the model.

#### State
Globally shared data accessible by components in the application. This data can be modified through mutations and accessed via getters (see below).

#### Mutations
Mutations are responsible for changing the global state. They should only be called by actions and not used directly in components.

#### Actions
Methods that expose changes to the global state. Components that wish to change the state should rely on actions which in turn call mutations.

#### Getters
Expose objects in the state.

### Vue Components

#### Editor
A component that represents the canvas which renders all the shapes and their properties.
Any component you want to add and represent visually should be rendered in this component.

#### NavBar
Contains the UI elements that start the following processes in the store:
* Loading example
* Selecting a file with data to validate
* Selecting a file containing SHACL
* Clear canvas
* Validate data

#### Shape
Component that represents shapes. Always contains an identifier and a boolean "nodeShape" to differentiate between a NodeShape or PropertyShape. Has following functionality:
* Edit identifier
* Calculate coordinates of children.
* Alert store about position changes.
* Add a new predicate.
* Selfdestruct 💥

#### Modals
Modals are used to enter specific information such as adding constraints to a PropertyShape or to ask for confirmation.

### Translation
Responsible for translating URIs from SHACL or ShEx to URIs used in the model. Translation from and to SHACL uses the `shaclTranslator` which in turn relies on the `shaclDictionary`. The `translatorManager` is responsible for assigning a translation job to the correct translator.
Note: makes use of [traverse](#Traverse) helper function

### Validation
Validates RDF data using the shapes in the editor. SHACL data is validated by the `shaclValidator` which produces a SHACL report. The `validatorManager` assigns the correct validator to a job. Currently no unified reporting is supported (ShEx and SHACL produce different types of report). Adding such support should be done in the `validatorManager` by introducing a translation step from SHACL/ShEx report to a unified report.

### Util
Contains helper functions used throughout the project.

#### Dictionaries
<dl>
  <dt><strong>extensionToFormat</strong></dt>
  <dd>Returns the corresponding media type for a file extension e.g. "ttl" to "text/turtle".</dd>
  <dt><strong>languages</strong></dt>
  <dd>Contains shape constraint languages such as SHACL and ShEx. Used to ensure no string mismatches happen.</dd>
  <dt><strong>terminology</strong></dt>
  <dd>Contains all existing terms. Classes and predicates such as NodeShape, properties, ...</dd>
</dl>

#### Konva configuration
Contains all the configuration objects.
These are used to determine the colors, position, stroke... in konva figures.
#### Traverse
<dl>
  <dt><strong>traverse(o, func, ...args)</strong></dt>
  <dd>Helper function to traverse over an object and apply a function. Can be used to rename properties of an object or change values of certain properties.</dd>
</dl>

#### Vocabulary
Contains functions to determine possible options when adding new shapes or constraints.
<dl>
  <dt><strong>Vocabulary#isClass(uri)</strong></dt>
  <dd>Returns whether uri is a class.</dd>
  <dt><strong>Vocabulary#isPredicate(uri)</strong></dt>
  <dd>Returns whether uri is a predicate.</dd>
  <dt><strong>Vocabulary#isInDictionary(id)</strong></dt>
  <dd>Returns whether id is a known term. Used to distinguish between model uris and external uris.</dd>
  <dt><strong>Vocabulary#listType(predicate, state)</strong></dt>
  <dd>Returns an array with possible values for @List of predicate</dd>
  <dt><strong>Vocabulary#possiblePredicates(subject)</strong></dt>
  <dd>Returns an array with possible predicates for a given subject.</dd>
  <dt><strong>Vocabulary#possibleObjects(predicate)</strong></dt>
  <dd>Returns an array with possible objects for a given predicate.</dd>
</dl>
