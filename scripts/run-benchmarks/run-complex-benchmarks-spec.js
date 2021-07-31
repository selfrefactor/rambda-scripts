const { runSingleBenchmark } = require('./run-complex-benchmarks')

const method = process.env.METHOD ?? 'uniq'

void async function runBenchmarks(){
  await runSingleBenchmark(method)
}()
