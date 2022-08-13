const {
  runSampleBenchmark,
} = require('./run-sample-benchmarks')

const method = process.env.METHOD ?? 'add'

void (async function runBenchmarks() {
    await runSampleBenchmark(method)
})()
