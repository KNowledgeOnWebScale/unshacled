/**
 * Generates a unique identifier for a relationship by putting together
 * the constraintID, the shapeID of the "from" shape and the shapeID of the "to" shape
 * @param {object} relationship
 * @returns {string} A unique identifier for a relationship
 */
export function relationshipUID(relationship) {
  return `${relationship.constraintID} - ${relationship.from} - ${relationship.to}`;
}

/**
 * Generates a unique identifier for a logical relationship by putting together
 * the constraintID, the shapeID of the "from" shape and the shapeID's of the 2 "to" shapes
 * @param {object} logicalRelationship
 * @returns {string} A unique identifier for a logical relationship
 */
export function logicalRelationshipUID(logicalRelationship) {
  return `${logicalRelationship.constraintID} - ${logicalRelationship.from} - ${logicalRelationship.to[0]} / ${logicalRelationship.to[1]}`;
}
