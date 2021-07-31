const { existsSync } = require('fs')
const { readJson, outputJson, emptyDir } = require('fs-extra')
const { resolve  } = require('path')
const { mapAsync, range  } = require('rambdax')
const { createBenchmark } = require('./modules/create-benchmark')
const { replaceInFile } = require('./modules/replace-in-file')

const benchmarksDir = resolve(__dirname, '../../../rambda/source/benchmarks')
const outputDir = resolve(__dirname, '../../benchmark-results')
const finalDir = resolve(__dirname, 'benchmark-results')
const allIndexesDir = resolve(__dirname, 'benchmarks/benchmark_results')

async function applyRunBenchmark({methodName, limit, index, filePath}){
  if(limit !== undefined && index > limit - 1) return {done: true}

  await replaceInFile({
    filePath,
    target: /const\sINDEX.+/,
    replacer: `const INDEX = ${index}`,
  })
  const required = require(filePath)
  
  console.log(index, 'required')

  await createBenchmark(required.tests, methodName)
  const outputFilePath = `${ outputDir }/${ methodName }.json`
  const benchmarkResult = await readJson(outputFilePath)
  console.log(index, 'done')
  return {benchmarkResult, newKnownLimit: limit === undefined ? required.len : undefined}
}

async function runSingleBenchmark(methodName){
  const filePath = `${ benchmarksDir }/${ methodName }.js`
  if(!existsSync(filePath)){
    throw new Error(`!existsSync(filePath) ${filePath}`)
  }
  const data = {}
  let knownLimit = undefined
  let shouldStop = undefined
  const iterable = async (index) => {
    if(shouldStop) return
    const {newKnownLimit, benchmarkResult, done} =await applyRunBenchmark({methodName, limit: knownLimit, index, filePath})
    if(done){
      shouldStop = true
      return
    } 
    if(newKnownLimit) knownLimit = newKnownLimit
    
    data[`${methodName}-${index}`] = benchmarkResult
    console.log(index, 'done')
  }
  
  await mapAsync(iterable, range(0, 20))

  const {benchmarkResult} =await applyRunBenchmark({methodName, limit: 0, index:-1, filePath})
  data[`${methodName}-ALL`] = benchmarkResult

  await outputJson(`${ finalDir }/${ methodName }.json`, data, {spaces: 2})
  await outputJson(`${ allIndexesDir }/${ methodName }.json`, benchmarkResult, {spaces: 2})
  await emptyDir(outputDir)
}

exports.runSingleBenchmark = runSingleBenchmark
