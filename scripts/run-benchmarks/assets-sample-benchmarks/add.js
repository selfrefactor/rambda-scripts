const R = require('rambdax')
const limit = 100

const modes = [Array(limit).fill(1), [1]]

const applyBenchmark = (fn, input) => fn(input)

const tests = [
  {
    label: 'Rambda',
    fn: R.flatten,
  },
  {
    label: 'Rambda alt',
    fn: R.add,
  },
]

module.exports = {
  tests,
  applyBenchmark,
  modes,
}
