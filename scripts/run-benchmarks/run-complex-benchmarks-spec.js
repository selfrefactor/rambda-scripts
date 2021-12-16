const {runAllBenchmarks , runSingleBenchmark } = require('./run-complex-benchmarks')
const {fixPackageJson, restorePackageJson } = require('./modules/fix-package-json')

const method = process.env.METHOD ?? 'sort'
const runAllMode = process.env.RAMBDA_UPDATE_ALL_BENCHMARKS === 'ON'
const disableOldFormat = process.env.RAMBDA_UPDATE_NEW_BENCHMARKS === 'ON'
console.log(`disableOldFormat`, disableOldFormat )
console.log(`runAllMode`, runAllMode )
console.log(`method`, method )

void async function runBenchmarks(){
  await fixPackageJson()

  if(runAllMode){
    await runAllBenchmarks(disableOldFormat)
  }else{
    await runSingleBenchmark(method)
  }
  await restorePackageJson()
}()
