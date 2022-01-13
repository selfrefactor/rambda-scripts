const {add, complete, cycle, save, suite} = require('benny')
const {ok} = require('rambdax')
const {snakeCase, constantCase} = require('string-fn')

const folder = 'benchmark-results'

async function createBenchmark(tests, suiteLabel) {
  ok(tests, suiteLabel)(
    [
      {
        label: String,
        fn: Function,
      },
    ],
    String
  )
  if (tests.length > 3) throw new Error(`tests.length > 3 ${tests.length}`)

  if (tests.length === 1) {
    return suite(
      constantCase(suiteLabel),
      add(tests[0].label, tests[0].fn),
      cycle(),
      complete(),
      save({
        file: snakeCase(suiteLabel),
        folder,
      })
    )
  }
  if (tests.length === 2) {
    return suite(
      constantCase(suiteLabel),
      add(tests[0].label, tests[0].fn),
      add(tests[1].label, tests[1].fn),
      cycle(),
      complete(),
      save({
        file: snakeCase(suiteLabel),
        folder,
      })
    )
  }

  return suite(
    constantCase(suiteLabel),
    add(tests[0].label, tests[0].fn),
    add(tests[1].label, tests[1].fn),
    add(tests[2].label, tests[2].fn),
    cycle(),
    complete(),
    save({
      file: snakeCase(suiteLabel),
      folder,
    })
  )
}

exports.createBenchmark = createBenchmark
