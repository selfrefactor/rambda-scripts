const { resolve } = require("path")

const benchmarksDir = resolve(__dirname, '../../../rambda/source/benchmarks')
const outputDir = resolve(__dirname, '../../benchmark-results')
const finalDir = resolve(__dirname, 'benchmark-results')
const allIndexesDir = resolve(__dirname, 'benchmarks/benchmark_results')

exports.allIndexesDir = allIndexesDir
exports.finalDir = finalDir
exports.outputDir = outputDir
exports.benchmarksDir = benchmarksDir
