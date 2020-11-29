process.env.BENCHMARK_FOLDER =
  'scripts/run-benchmarks/benchmarks/benchmark_complex_results'
const { createComplexBenchmark, scanFolder  } = require('helpers-fn')
const { parse, resolve  } = require('path')
const { mapAsync  } = require('rambdax')

const benchmarksDir = resolve(__dirname, '../../../rambda/source/complex_benchmarks')

async function getAllBenchmarks(){
  const files = await scanFolder({ folder : benchmarksDir })

  return files
    .filter(filePath => !filePath.includes('benchmark_results'))
    .map(filePath => parse(filePath).name)
}

async function runSingleComplexBenchmark(singleMethod){
  const required = require(`${ benchmarksDir }/${ singleMethod }.js`)
  createComplexBenchmark(required)
}

async function runAllComplexBenchmarks(){
  const methodsWithBenchmarks = await getAllBenchmarks()

  await mapAsync(runSingleComplexBenchmark, methodsWithBenchmarks)
}

exports.runAllComplexBenchmarks = runAllComplexBenchmarks
exports.runSingleComplexBenchmark = runSingleComplexBenchmark
