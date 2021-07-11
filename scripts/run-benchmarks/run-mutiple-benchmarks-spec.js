const { runMultipleBenchmarks } = require('./run-multiple-benchmarks')

const method = 'type'

void async function runBenchmarks(){

  await runMultipleBenchmarks(method)
}()
