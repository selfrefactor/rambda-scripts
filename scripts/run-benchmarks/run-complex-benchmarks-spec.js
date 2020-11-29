const { runAllComplexBenchmarks, runSingleComplexBenchmark } = require('./run-complex-benchmarks')

const RUN_ALL = false
const method = 'forEach'

void async function runBenchmarks(){
  if (!RUN_ALL){
    await runSingleComplexBenchmark(method)
    return
  }

  await runAllComplexBenchmarks()
}()
