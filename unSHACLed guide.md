# unSHACLed beginner's guide
There are 2 big parts to unSHACLed, the store and the components.
The store is kind of like a backend, but in the frontend, it stores all the data for the app to work. When a model gets loaded in, it is stored in there, along with all necessary data for it to render, i.e. the coordinates.

All of the files relating to the store are kept in the folder named store. The store is split up in smaller files, with every part being responsible for handling their own part of the data, these files are called modules (for example the shapeModule contains the model description, so the shapes and their constraints, this module is also responsible for any changes to that data).
These modules consist of:
- __state__, containing the data in that module
- __mutations__, all methods that get called for changing that module's state
- __actions__, a sort of in between point of methods where some data is handled from that module and then passed on to another module
- __getters__, these get called when the components need data from this module
- __modules__, a module can possibly also have sub-modules

I personally found that if you need to change something, it's often easier to go to the component that executes those changes and then see what interactions it has with the store to change those methods as well, if necessary, rather than starting in the store and then going to the components.

The components are the parts that make sure everything gets rendered correctly. They get their data from the store and represent it in a meaningful way. They look the way they do because this is configured in the `config` that's passed to the elements of their template. These elements are mainly Vue-Konva components, this is a library to draw on a canvas with Vue. Many of the layout settings are defined as constants in _config/konvaConfigs.js_ and imported in the locally defined components.

The biggest part of unSHACLed are the visual notations. To render these, everything starts in the _Editor.vue_ component. This components checks in the store what the visual notation is (with `this.$store.getters.visualNotation`) and then based on that, renders different components. The components to represent ShapeUML are located in components/Shapes/UML and the components for ShapeVOWL are in components/Shapes/VOWL. These are similar, but different enough to split them up in two separate folders.

#### Editor
The editor component calls a store getter for each of the big components to be rendered (Shape, Relationship and LogicalRelationship) and then iterates over them with the Vue directive v-for to render an instance of that component for each of them. This can be seen in the _Editor.vue_ template at the top of the file. Often, props get passed to the components to let the components know what exactly they are representing. Each of these components can be found in the Vue files with the same name.

The rendering of the Shape components is split up in 3 different v-for's, one for node shapes, one for property shapes and one for 'shapes', these don't have a specified type.
This is not something introduced in unSHACLed, but a distinction made in shacl. Splitting this up in 3 v-for's allows us to pass the Shape components the correct props to let them know what type of shape they represent. The Shape components then use this information to possibly render parts of the component in different ways.

These components then render their own sub-components to represent the data properly, according to the visual notation.

### ShapeUML
#### Shape
The ShapeUML Shape.vue component consists of several parts. There's the title block, the shape information block, the shape constraints block and the buttons.
The title block contains a human readable title and description and an IRI, the shape information and shape constraints contain Constraint components for each constraint they receive from `this.$store.getters.shapeInfo` and `this.$store.getters.shapeConstraints`. The buttons serve to add constraints to the shape and to delete the shape, both of these actions are also realized by sending instructions to the store, then these changes will automatically be rendered.

#### Constraint
A simpler component, this represents a single constraint and a button to delete that constraint. The main complexity in this component is making sure the constraint gets shown correctly. Some constraints have to go through some modification before they can get rendered, like the `sh:path` constraint, which might consists of multiple constraints combined. For ShapeUML however, constraints are mostly a straightforward key/value representation.

#### Relationship
An arrow, going from one shape to another. This arrow can have a label with the `sh:path` on it if the relationship it represents is `sh:property`. It can also have a cardinality, to represent the `sh:minCount` and `sh:maxCount` or `sh:qualifiedMinCount` and `sh:qualifiedMaxCount` constraints. The ShapeUML arrow consists of a line and a custom UMLArrowHead component, since Konva doesn't allow the customization of the v-arrow component's arrowhead. I won't give a separate paragraph for the UMLArrowHead component, this is literally just a line drawing made in Vue-Konva and placed and rotated correctly by the Relationship component.

The most important part of the Relationship component is probably the _getConfigs()_ and _getEndPoints()_ functions, the former calls the latter to get the the start- and endpoint of the arrow and then places the arrow correcly, _getConfigs()_ also takes care of most of the rest of the layout for the relationship component. _getEndPoints()_ uses the functions defined in _calculations.js_ for most of it's calculations, to avoid clutter in this component.

#### LogicalRelationship
This represents the `sh:or`, `sh:and` and `sh:xone` relationships (`sh:not` is just rendered as a normal Relationship, with a dash array). At the moment, this works a lot like a Relationship component, it also calculates endpoints and then draws a dotted line through them, except here the endpoints are the centers of the relationship arrows. This component gets the location of the relationship arrows from the store (`this.$store.state.mShape.mCoordinate.relationshipCoordinates`). This component will however very likely be changed to a representation more like ShapeVOWL.

### ShapeUML
#### Shape
The ShapeVOWL Shapes are different in a few ways from the ShapeUML ones. 

These shapes can take a few different.. well.. shapes. The way this shape looks is defined by the computed property _shapeKind_ (if you don't know what a computed Vue property is, Google probably has a better explanation than me). This _shapeKind_ is defined in _constants.js_ (along with a few other constants, mainly used in the store) and can be a RDF_RESOURCE, a LITERAL and a RELATIONSHIP (I'll explain about the last one in the LogicalRelationship component explanation). If the shape is an RDF_RESOURCE, it should look like a blue ellipse, if it's a LITERAL, it should look like a yellow rectangle. The distinction can be found in this shapeKind computed property.

The main shape itself contains way less information than the ShapeUML version, the only things shown within the main shape are an upper label for showing the human readable label for node shapes and a center label with an IRI for node shapes or the IRI from `sh:class` or `sh:datatype` if that property is present (property shapes don't have an IRI of their own, if you were to check their IRI, you'd find they have a "blank node" IRI, this is formatted as "_:bx" with x being a number, this is an id given to them by the N3 parser we use, to identify them within the model). If the shape has a `sh:class` or `sh:datatype` property, an icon is also shown (these icons can be found in public/icons).

The reason a lot less information is shown in the ShapeVOWL main shape, is because ShapeVOWL uses a sort of card representation for its constraints. The rendering of the constraints in these cards is handled completely by a child component of the Shape, PropertyGroup. This PropertyGroup is passed the shape id and whether the shape is a nodeshape and then retrieves all necessary information itself. This PropertyGroup component can be dragged around the shape. Based on the shapeKind, a boundary calculation method from _calculations.js_ is used to snap the PropertyGroup to the edges of the shape.

The last part of the Shape component are the buttons. These do the exact same thing as the buttons in the ShapeUML shape.

#### PropertyGroup
As mentioned before, this shows the constraints for a ShapeVOWL shape. The constraints here are split up in 3 groups:
- The "single note" constraints, these are shown in 1 single big note card
- The "concatted" constraints, these constraints have their own note and consists of multiple constraints combined (i.e. length, consisting of `sh:minLength` and `sh:maxLength` combined), these also have an icon
- The "separate" constraints, these constraints get their own note and also have an icon
Deciding which constraints get put in which group gets done in the store, with some constants from _constants.js_.

The note mentioned above is also a component, this can be found in _Note.vue_, similar to the UMLArrowHead, this is just a line drawing, drawn in Vue-Konva, however this component is a tiny bit more complex, since it has an adjustable height, to accomodate for the bigger note needed for the "single note" constraints and it can also display an icon if the constraint it is destined for has one.

The constraints themselves are again rendered with the Constraint component.

#### Constraint
This component is again pretty simple, however it is a little more complex than the one from ShapeUML. Instead of just showing the constraint as a key-value pair, the constraints in ShapeVOWL are formatted as `constraint(value)` and sometimes, the constraint is also mapped to a different name than the name it has in shacl. This is all handled in the _getTextConfig()_ method. Apart from that, the constraint also has a delete button, this works the same way as the ShapeUML one, it sends the store a request to remove the constraint from its shape, the rendered constraint then automatically dissapears.

#### Relationship
This is pretty much the exact same component as the one in ShapeUML, the only difference is that the label in the center is now in a rectangle of its own and the endpoints get calculated in a slightly different way, since the arrow has to start and stop at different points, depending on the shapeKind and whether or not there's a PropertyGroup component in the way.

#### LogicalRelationship (WIP)
One of the more complex components in ShapeVOWL.
This again represents the `sh:or`, `sh:and` and `sh:xone` relationships, but contains a lot more than just a single line.

At the core, this component is a combination a simplified Shape component and a simplified Relationship component. For each of the logical relationships in the model, this draws a shape that has the layout corresponding to the RELATIONSHIP shapeKind (a smaller ellipse, with the relationship in uppercase and an icon beneath), with an arrow, coming from the source of the logical relationship, going into this shape.

The work on this component isn't finished yet. The steps that still have to be done to make this work are:
- Making the initial positioning of these shapes work, there is already some code for this in the component's `mounted` (if you don't know what this is, look up what mounted and created are in Vue), but something isn't working yet. The idea here was to use the same method that gets used to place the model shapes once they get parsed and that way, place the logical relationship "shapes" on this same "grid".
- Making the Relationhip arrows going into the destination shape recognize the LogicalRelationship shape as their source coordinates. This is possible through the `this.$store.state.mShape.mCoordinate.coordinates`, which now contains the coordinates of both the regular Shape components and of the LogicalRelationship components. For this to work, the previous part will probably have to work first.

#### Contact
If you are working on unSHACLed and something is unclear or you have any questions, feel free to contact me (Ruben Wambacq) through mattermost or by mail ( ruben.wambacq@gmail.com ).
