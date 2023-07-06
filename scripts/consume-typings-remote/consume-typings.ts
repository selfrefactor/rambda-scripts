import { add, applySpec,  transpose, move, union, path, propEq, sortBy, prop, map } from 'ramda'
// import { add, applySpec,  transpose, move, union, path, propEq, sortBy, prop, map } from 'rambda'
const alois = {name: 'Alois', age: 15, disposition: 'surly'};
 const hasBrownHair = propEq('brown', 'age', alois);
 const age = propEq(15, 'age', alois);
console.log({hasBrownHair, age})
const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];

const sortWithRProp = sortBy(prop('id'), arr);
const sortWithoutRProp = sortBy((item) => item.id, arr);

const mapWithRProp = map(prop('id'), arr);
const mapWithoutRProp = map((item) => item.id, arr);

process.exit(0)  
const moveResult = move(1,2, [1,2,3])
const unionResult = union([1,2,4], [1,2,3])

const applySpecResult = applySpec({
  a: add(1)
})(1)

const transposeResult = transpose([[1,2],[],[1,2,3],[3]])
console.log({applySpecResult, transposeResult, moveResult, unionResult})

interface UnknownThis {
  this: unknown,
}

const object: UnknownThis = {
  this: {
    is: {
      a: 'path',
    },
  },
}
const test1 = path(['this', 'is', 'not', 'a'])(object)
test1 // $ExpectType unknown
const test21 = path(['this', 'is', 'not'], object)
test21 // $ExpectType unknown
