const JSONids =
  '{"https://2019.summerofcode.be/unshacled#path":true,"https://2019.summerofcode.be/unshacled#class":true,"https://2019.summerofcode.be/unshacled#property":true,"https://2019.summerofcode.be/unshacled#targetNode":true,"https://2019.summerofcode.be/unshacled#datatype":true,"https://2019.summerofcode.be/unshacled#nodeKind":true,"https://2019.summerofcode.be/unshacled#targetObjectsOf":true,"https://2019.summerofcode.be/unshacled#equals":true,"https://2019.summerofcode.be/unshacled#disjoint":true,"https://2019.summerofcode.be/unshacled#lessThan":true,"https://2019.summerofcode.be/unshacled#lessThanOrEquals":true,"https://2019.summerofcode.be/unshacled#not":true,"https://2019.summerofcode.be/unshacled#targetClass":true,"https://2019.summerofcode.be/unshacled#node":true}';
const JSONtypes =
  '{"https://2019.summerofcode.be/unshacled#minCount":true,"https://2019.summerofcode.be/unshacled#maxCount":true,"https://2019.summerofcode.be/unshacled#minExclusive":true,"https://2019.summerofcode.be/unshacled#minInclusive":true,"https://2019.summerofcode.be/unshacled#maxExclusive":true,"https://2019.summerofcode.be/unshacled#maxInclusive":true,"https://2019.summerofcode.be/unshacled#minLength":true,"https://2019.summerofcode.be/unshacled#maxLength":true,"https://2019.summerofcode.be/unshacled#uniqueLang":true}';
const JSONlists =
'{"https://2019.summerofcode.be/unshacled#languageIn":true,"https://2019.summerofcode.be/unshacled#and":true,"https://2019.summerofcode.be/unshacled#or":true,"https://2019.summerofcode.be/unshacled#xone":true}';
export default function isIn(url) {
  const ids = JSON.parse(JSONids);
  const types = JSON.parse(JSONtypes);
  const lists = JSON.parse(JSONlists);
  if (ids[url]) return "id";
  if (types[url]) return "type";
  if (lists[url]) return "list";
}
