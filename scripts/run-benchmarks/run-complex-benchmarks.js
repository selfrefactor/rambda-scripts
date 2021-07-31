const {existsSync} = require('fs')
const {readJson, outputJson, emptyDir} = require('fs-extra')
const {resolve} = require('path')
const {mapAsync, range} = require('rambdax')
const {createBenchmark} = require('./modules/create-benchmark')
const {replaceInFile} = require('./modules/replace-in-file')

const benchmarksDir = resolve(__dirname, '../../../rambda/source/benchmarks')
const outputDir = resolve(__dirname, '../../benchmark-results')
const finalDir = resolve(__dirname, 'benchmark-results')
const allIndexesDir = resolve(__dirname, 'benchmarks/benchmark_results')

async function applyRunBenchmark({methodName, length, index, filePath}) {
  const {tests, modes, applyBenchmark} = require(filePath)

  console.log(index, 'index applyRunBenchmark')
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
  const outputFilePath = `${outputDir}/${methodName}.json`
  const benchmarkResult = await readJson(outputFilePath)
  console.log(index, length, 'done')
  return {
    benchmarkResult,
    newKnownLength: length === undefined ? modes.length : undefined,
  }
}

const RUN_ALL = process.env.RAMBDA_RUN_ALL !== 'OFF'
const RUN_INDEXES = process.env.RAMBDA_RUN_INDEXES !== 'OFF'
console.log(`RUN_INDEXES`, RUN_INDEXES)
console.log(`RUN_ALL`, RUN_ALL)

async function runSingleBenchmark(methodName) {
  const filePath = `${benchmarksDir}/${methodName}.js`
  if (!existsSync(filePath)) {
    throw new Error(`!existsSync(filePath) ${filePath}`)
  }
  const data = {}
  let knownLength = undefined
  const iterable = async index => {
    console.log(`iterable index`, index)
    if (knownLength !== undefined && index >= knownLength) return
    console.log(`iterable index after`, index)
    const {newKnownLength, benchmarkResult} = await applyRunBenchmark({
      methodName,
      length: knownLength,
      index,
      filePath,
    })
    console.log(`knownLimit,done`, knownLength, newKnownLength)
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

exports.runSingleBenchmark = runSingleBenchmark
