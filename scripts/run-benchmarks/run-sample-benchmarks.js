const {existsSync} = require('fs')
const {readJson, outputJson} = require('fs-extra')
const {mapAsync, range} = require('rambdax')
const {snakeCase} = require('string-fn')
const {createBenchmark} = require('./modules/create-benchmark')

const benchmarksDir = `${__dirname}/assets-sample-benchmarks`

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
  await createBenchmark(applyableTests, methodName, 'scripts/run-benchmarks/assets-sample-benchmarks')
  
  const outputFilePath = `${benchmarksDir}/${snakeCase(methodName)}.json`
  const benchmarkResult = await readJson(outputFilePath)
  return {
    benchmarkResult,
    newKnownLength: length === undefined ? modes.length : undefined,
  }
}

async function runSampleBenchmark(methodName) {
  const filePath = `${benchmarksDir}/${methodName}.js`
  if (!existsSync(filePath)) {
    throw new Error(`!existsSync(filePath) ${filePath}`)
  }
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

  await mapAsync(iterable, range(0, 30))
  await outputJson(`${finalDir}/${methodName}.json`, data, {spaces: 2})
}

exports.runSampleBenchmark = runSampleBenchmark
