const {checkResults } = require('./run-complex-benchmarks')

const method = process.env.METHOD ?? 'uniq'
console.log(`method`, method )

void async function checkResultsSpec(){
  checkResults({methodName: method})
}()
