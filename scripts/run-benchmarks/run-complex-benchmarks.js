const {existsSync} = require('fs')
const {readJson, readFile, outputJson, emptyDir} = require('fs-extra')
const {scanFolder} = require('helpers-fn')
const {resolve, parse} = require('path')
const {mapAsync, range, equals, map} = require('rambdax')
const {snakeCase, kebabCase} = require('string-fn')
const {createBenchmark} = require('./modules/create-benchmark')

const benchmarksDir = resolve(__dirname, '../../../rambda/source/benchmarks')
const outputDir = resolve(__dirname, '../../benchmark-results')
const finalDir = resolve(__dirname, 'benchmark-results')
const allIndexesDir = resolve(__dirname, 'benchmarks/benchmark_results')

function checkSingleResults({index, filePath}) {
  if (index === -1) return
  const {tests, modes, applyBenchmark} = require(filePath)
  const currentMode = modes[index]
  if (!currentMode) return
  const allResults = tests.map(singleTest => {
    const result = applyBenchmark(singleTest.fn, currentMode)

    return {
      label: singleTest.label,
      result,
    }
  })
  const labels = allResults.map(({label}) => label)

  const firstResult = equals(allResults[0].result, allResults[1].result)
  if (tests.length === 3) {
    const secondResult = equals(allResults[1].result, allResults[2].result)
    return {firstResult, secondResult, labels}
  }
  return {result: firstResult, labels, allResults}
}

async function checkResults({filePath: filePathInput, methodName}) {
  const filePath = filePathInput ? filePathInput : `${benchmarksDir}/${methodName}.js`

  const {
    modes: {length: modesLength},
  } = require(filePath)

  const iterable = index => {
    return checkSingleResults({
      index,
      filePath,
    })
  }

  const allResults = await map(iterable, range(0, modesLength))
  const warnings = allResults.filter(({result, firstResult, secondResult}) =>
    [result, firstResult, secondResult].includes(false)
  )
  console.log(`allResults`, allResults)
  console.log(`warnings`, warnings)
  const resultFilePath = `${outputDir}/results-check-${kebabCase(
    methodName
  )}.json`
  await outputJson(resultFilePath, {warnings, allResults, numWarnings: warnings.length}, {spaces: 2})
}

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
  await emptyDir(outputDir)
}

async function runSingleBenchmark(methodName, disableOldFormat = false) {
  const filePath = `${benchmarksDir}/${methodName}.js`
  if (!existsSync(filePath)) {
    throw new Error(`!existsSync(filePath) ${filePath}`)
  }
  const fileContent = (await readFile(filePath)).toString()
  const isNewFormat = fileContent.includes('const modes =')
  if (!isNewFormat) {
    if (disableOldFormat) return
    return applyOldFormat(filePath, methodName)
  }
  await checkResults({filePath, methodName})

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
exports.checkResults = checkResults
exports.benchmarksDir = benchmarksDir
