import { add, applySpec,  transpose, move, union, path, propEq } from 'rambda'
import {propEq as propEqR} from 'ramda'
const alois = {name: 'Alois', age: 15, disposition: 'surly'};
 const hasBrownHair = propEq('brown', 'age', alois);
 const age = propEq(15, 'age', alois);
console.log({hasBrownHair, age})
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
