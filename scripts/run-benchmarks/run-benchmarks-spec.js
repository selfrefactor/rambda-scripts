const { runAllBenchmarks, runSingleBenchmark } = require('./run-benchmarks')

const RUN_ALL = false
const method = 'map'

void async function runBenchmarks(){
  if (!RUN_ALL){
    await runSingleBenchmark(method)
    return
  }

  await runAllBenchmarks()
}()
