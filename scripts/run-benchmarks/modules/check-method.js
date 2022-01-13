const {outputJson} = require('fs-extra')
const {range, equals, map} = require('rambdax')
const {benchmarksDir, outputDir} = require('../constants')
const {kebabCase} = require('string-fn')

function checkSingleResults({index, filePath}) {
  if (index === -1) return
  const {tests, modes, applyBenchmark} = require(filePath)
  const currentMode = modes[index]
  if (!currentMode) return
  const allResults = tests.map(singleTest => {
    try {
      const result = applyBenchmark(singleTest.fn, currentMode)

      return {
        label: singleTest.label,
        result,
      }
    } catch (error) {
      return {
        label: singleTest.label,
        result:
          error && error.message
            ? `ERROR: ${error.message}`
            : 'UNKNOWN ERROR',
      }
    }
  })
  const labels = allResults.map(({label}) => label)

  const firstResult = equals(allResults[0].result, allResults[1].result)
  if (tests.length === 3) {
    const secondResult = equals(allResults[1].result, allResults[2].result)
    return {firstResult, secondResult, labels, index}
  }
  return {result: firstResult, labels, allResults, index}
}

async function checkResults({filePath: filePathInput, methodName}) {
  const filePath = filePathInput
    ? filePathInput
    : `${benchmarksDir}/${methodName}.js`

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
  console.log(`warnings`, warnings)
  const resultFilePath = `${outputDir}/results-check-${kebabCase(
    methodName
  )}.json`
  await outputJson(
    resultFilePath,
    {warnings, allResults, numWarnings: warnings.length},
    {spaces: 2}
  )
}

exports.checkResults = checkResults
exports.benchmarksDir = benchmarksDir
