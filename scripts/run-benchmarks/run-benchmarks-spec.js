const { runAllBenchmarks, runSingleBenchmark } = require('./run-benchmarks')

const RUN_ALL = process.env.RUN_ALL === 'ON'
const method = process.env.METHOD ?? 'includes'

void async function runBenchmarks(){
  if (!RUN_ALL){
    await runSingleBenchmark(method)
    return
  }

  await runAllBenchmarks()
}()
