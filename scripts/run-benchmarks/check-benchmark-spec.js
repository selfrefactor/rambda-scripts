const {checkResults } = require('./modules/check-method')

const method = process.env.METHOD ?? 'uniq'
console.log(`method`, method )

void async function checkResultsSpec(){
  checkResults({methodName: method})
}()
