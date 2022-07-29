const {existsSync} = require('fs')
const {readJson, readFile, outputJson} = require('fs-extra')
const {scanFolder} = require('helpers-fn')
const {parse} = require('path')
const {mapAsync, range} = require('rambdax')
const {snakeCase} = require('string-fn')
const {createBenchmark} = require('./modules/create-benchmark')
const {
  outputDir,
  allIndexesDir,
  benchmarksDir,
  finalDir,
} = require('./constants')
const {checkResults} = require('./modules/check-method')

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
console.log(`will run with index mode`, RUN_INDEXES)
console.log(`will have final round with all indexes`, RUN_ALL)

async function applyOldFormat(filePath, methodName) {
  const required = require(filePath)
  await createBenchmark(required, methodName)
  const outputFilePath = `${outputDir}/${snakeCase(methodName)}.json`
  const benchmarkResult = await readJson(outputFilePath)
  const benchmarkResultFilePath = `${allIndexesDir}/${methodName}.json`
  await outputJson(benchmarkResultFilePath, benchmarkResult, {
    spaces: 2,
  })
}

async function runSingleBenchmark(methodName, disableOldFormat = false) {
  const filePath = `${benchmarksDir}/${methodName}.js`
  if (!existsSync(filePath)) {
    throw new Error(`!existsSync(filePath) ${filePath}`)
  }
  const fileContent = (await readFile(filePath)).toString()
  const isNewFormat = fileContent.includes('const modes =')
  console.log(`isNewFormat`, isNewFormat, methodName)
  if (!isNewFormat) {
    if (disableOldFormat) return console.log(`disableOldFormat`)
    return applyOldFormat(filePath, methodName)
  }
  console.log(`methodName is being checked`, methodName)
  await checkResults({filePath, methodName})
  console.log(`methodName is fine`, methodName)

  const data = {}
  let knownLength = undefined
  const iterable = async index => {
    if (knownLength !== undefined && index >= knownLength) return
    const label = `${methodName}-${index}`
    console.time(label)
    const {newKnownLength, benchmarkResult} = await applyRunBenchmark({
      methodName,
      length: knownLength,
      index,
      filePath,
    })
    console.timeEnd(label)
    if (newKnownLength) {
      console.log(`newKnownLength`, newKnownLength)
      knownLength = newKnownLength
    }

    data[`${methodName}-${index}`] = benchmarkResult
  }

  if (RUN_INDEXES) await mapAsync(iterable, range(0, 30))

  const onEnd = async () => {
    await outputJson(`${finalDir}/${methodName}.json`, data, {spaces: 2})
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

async function getAllBenchmarks() {
  const files = await scanFolder({folder: benchmarksDir})

  return files
    .filter(filePath => {
      if (filePath.includes('benchmark_results')) return false
      if (filePath.includes('_utils')) return false
      return true
    })
    .map(filePath => parse(filePath).name)
}

async function runAllBenchmarks(disableOldFormat) {
  const all = await getAllBenchmarks()
  const iterable = async methodName => {
    await runSingleBenchmark(methodName, disableOldFormat)
  }
  await mapAsync(iterable, all)
}

exports.runAllBenchmarks = runAllBenchmarks
exports.runSingleBenchmark = runSingleBenchmark
