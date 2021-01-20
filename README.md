# UnSHACLed

A visual editor for RDF constraints
currently supporting the visual notations [ShapeUML](https://w3id.org/imec/unshacled/spec/shape-uml/20210118) and [ShapeVOWL](https://w3id.org/imec/unshacled/spec/shape-vowl/20210118/)
and import/export/validation of [SHACL](https://www.w3.org/TR/shacl/) constraints.

The [previous version](https://github.com/oSoc19/unshacled) of UnSHACLed was implemented during the Open Summer of Code 2019 in Belgium under the MIT license.
This is an updated version which adds support for different visual notations to interact visually with RDF constraints.

## Contents
1. [Overview](#Overview)
2. [Setup](#Setup)
3. [Contribute](#Contribute)

## Overview
At the time of writing this editor supports SHACL, future support for ShEx is envisioned. This editor makes abstraction of specific constraint languages and exposes concepts in a simple visual interface.

### Functionalities
- [x] Drag and drop to rearrange the visualized shapes
- [x] Add, remove and edit shapes, constraints and relationships
- [x] View and edit namespaces and prefixes
- [x] Import SHACL files in JSON and Turtle
- [x] Export SHACL files in JSON and Turtle
- [x] Import data files in JSON and Turtle
- [x] View and edit data files in JSON format
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

## Contribute
This section contains information to help contribute to this project.
For more information about the project structure, the internal model et cetera, please consult [the wiki of the previous version](https://github.com/oSoc19/unshacled/wiki/Home).

### Linting
To ensure code style consistency we use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) which are configured in `.eslintrc.js`.

### Testing
Testing is done with [Jest.js](https://jestjs.io/) and [Vue Jest](https://github.com/vuejs/vue-jest). Unit tests are kept in the same directory as the classes they test and share the same filename but with extension e.g. `somefile.js` and `somefile.test.js`. All tests can be executed using the following command: 
```
npm run test
```

### Documentation
Make sure to document your code in [JSDoc style](https://jsdoc.app/). Documentation is generated using the command: 
```
npm run docs
```

```
/* This comment should appear in the HTML documentation. */
// This is just a comment and should not be added to the HTML documentation.
```
