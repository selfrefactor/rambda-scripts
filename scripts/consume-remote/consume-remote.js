const { add, applySpec,  transpose, move, union, equals } = require('rambda')

const moveResult = move(1,2, [1,2,3])
const unionResult = union([1,2,4], [1,2,3])

const applySpecResult = applySpec({
  a: add(1)
})(1)

const transposeResult = transpose([[1,2],[],[1,2,3],[3]])
console.log({applySpecResult, transposeResult, moveResult, unionResult})

const rEquals = equals(
  {
    a: { b: 1 },
  },
  {
    a: { b: 1 },
  },
);
console.log(rEquals);