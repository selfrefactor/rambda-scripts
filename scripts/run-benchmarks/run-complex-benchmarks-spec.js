const {runAllBenchmarks , runSingleBenchmark } = require('./run-complex-benchmarks')

const method = process.env.METHOD ?? 'uniq'
const runAllMode = process.env.RAMBDA_UPDATE_ALL_BENCHMARKS === 'ON'

void async function runBenchmarks(){
  if(runAllMode){
    await runAllBenchmarks()

    return
  }
  await runSingleBenchmark(method)
}()
