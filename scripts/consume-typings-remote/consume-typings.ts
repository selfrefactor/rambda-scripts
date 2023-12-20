import { add, applySpec,  transpose, move, union, path, propEq, sortBy, prop, map, without } from 'ramda'
import { partial } from 'rambdax'

let pipeResult = without(['abc'], ['abc'])

console.log(pipeResult, `pipeResult`)

const alois = {name: 'Alois', age: 15, disposition: 'surly'};
 const hasBrownHair = propEq(12, 'age', alois);
 const age = propEq(15, 'age', alois);
console.log({hasBrownHair, age})

 function foo(a:any,b:any,c:any) {
}

console.log(partial(foo, [1,2]), `partial(foo, [1,2])`)
console.log(partial(foo, [1,2])(3), `partial(foo, [1,2])(3)`)

const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];

const sortWithRProp = sortBy(prop('id'), arr);
const sortWithoutRProp = sortBy((item) => item.id, arr);

const mapWithRProp = map(prop('id'), arr);
const mapWithoutRProp = map((item) => item.id, arr);
console.log('sortWithRProp', sortWithRProp)
console.log('sortWithoutRProp', sortWithoutRProp)
console.log('mapWithRProp', mapWithRProp)
console.log('mapWithoutRProp', mapWithoutRProp)
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
