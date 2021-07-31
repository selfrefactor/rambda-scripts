const {existsSync} = require('fs')
const {readJson, readFile, outputJson, emptyDir} = require('fs-extra')
const { scanFolder } = require('helpers-fn')
const {resolve, parse} = require('path')
const {mapAsync, range} = require('rambdax')
const { snakeCase } = require('string-fn')
const {createBenchmark} = require('./modules/create-benchmark')

const benchmarksDir = resolve(__dirname, '../../../rambda/source/benchmarks')
const outputDir = resolve(__dirname, '../../benchmark-results')
const finalDir = resolve(__dirname, 'benchmark-results')
const allIndexesDir = resolve(__dirname, 'benchmarks/benchmark_results')

async function applyRunBenchmark({methodName, length, index, filePath}) {
  const {tests, modes, applyBenchmark} = require(filePath)

  const applyableTests = tests.map(singleTest => {
    if (index === -1) {
      return {
        label: singleTest.label,
        fn: () => {
          modes.forEach(mode => {
            applyBenchmark(singleTest.fn, mode)
          })
        },
      }
    }

    return {
      label: singleTest.label,
      fn: () => {
        applyBenchmark(singleTest.fn, modes[index])
      },
    }
  })
  await createBenchmark(applyableTests, methodName)
  const outputFilePath = `${outputDir}/${snakeCase(methodName)}.json`
  const benchmarkResult = await readJson(outputFilePath)
  return {
    benchmarkResult,
    newKnownLength: length === undefined ? modes.length : undefined,
  }
}

const RUN_ALL = process.env.RAMBDA_RUN_ALL !== 'OFF'
const RUN_INDEXES = process.env.RAMBDA_RUN_INDEXES !== 'OFF'
console.log(`RUN_INDEXES`, RUN_INDEXES)
console.log(`RUN_ALL`, RUN_ALL)

async function applyOldFormat(filePath, methodName){
  const required = require(filePath)
  await createBenchmark(required, methodName)
  const outputFilePath = `${outputDir}/${snakeCase(methodName)}.json`
  const benchmarkResult = await readJson(outputFilePath)
  const benchmarkResultFilePath = `${allIndexesDir}/${methodName}.json`
  await outputJson(benchmarkResultFilePath, benchmarkResult, {
    spaces: 2,
  })
}

async function runSingleBenchmark(methodName) {
  const filePath = `${benchmarksDir}/${methodName}.js`
  if (!existsSync(filePath)) {
    throw new Error(`!existsSync(filePath) ${filePath}`)
  }
  const fileContent = (await readFile(filePath)).toString()
  const isNewFormat = fileContent.includes('const modes =')
  if(!isNewFormat){
    return applyOldFormat(filePath, methodName)
  }

  const data = {}
  let knownLength = undefined
  const iterable = async index => {
    if (knownLength !== undefined && index >= knownLength) return
    console.time(methodName)
    const {newKnownLength, benchmarkResult} = await applyRunBenchmark({
      methodName,
      length: knownLength,
      index,
      filePath,
    })
    console.timeEnd(methodName)
    if (newKnownLength) knownLength = newKnownLength

    data[`${methodName}-${index}`] = benchmarkResult
  }

  if (RUN_INDEXES) await mapAsync(iterable, range(0, 20))

  const onEnd = async () => {
    await outputJson(`${finalDir}/${methodName}.json`, data, {spaces: 2})
    await emptyDir(outputDir)
  }

  if (!RUN_ALL) {
    await onEnd()
    return
  }
  const {benchmarkResult} = await applyRunBenchmark({
    methodName,
    length: 1,
    index: -1,
    filePath,
  })
  data[`${methodName}-ALL`] = benchmarkResult

  await outputJson(`${allIndexesDir}/${methodName}.json`, benchmarkResult, {
    spaces: 2,
  })
  await onEnd()
}

async function getAllBenchmarks(){
  const files = await scanFolder({ folder : benchmarksDir })

  return files
    .filter(filePath => !filePath.includes('benchmark_results'))
    .map(filePath => parse(filePath).name)
}

async function runAllBenchmarks(){
  const all = await getAllBenchmarks()
  console.log(`all benchmarks: ${all}`)
}

exports.runAllBenchmarks = runAllBenchmarks
exports.runSingleBenchmark = runSingleBenchmark
