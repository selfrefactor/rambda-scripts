process.env.BENCHMARK_FOLDER =
  'scripts/run-benchmarks/benchmarks/benchmark_results'
const { existsSync } = require('fs')
const { parse, resolve } = require('path')
const { readJson } = require('fs-extra')
const { mapAsyncLimit, paths, take, range } = require('rambdax')
const { snakeCase } = require('string-fn')
const { createBenchmark, log, scanFolder  } = require('helpers-fn')

const benchmarksDir = resolve(__dirname, '../../../rambda/source/benchmarks')

async function getAllBenchmarks(){
  const files = await scanFolder({ folder : benchmarksDir })

  return files
    .filter(filePath => !filePath.includes('benchmark_results'))
    .map(filePath => parse(filePath).name)
}

async function runSingleBenchmark(singleMethod){
  console.time(`run.${ singleMethod }.benchmark`)
  const methodsWithBenchmarks = await getAllBenchmarks()

  if (!methodsWithBenchmarks.includes(singleMethod)){
    throw new Error('this method has no benchmark')
  }
  const { winner: prevWinner, loser: prevLoser } = await getPreviousBenchmark(singleMethod)

  const required = require(`${ benchmarksDir }/${ singleMethod }.js`)
  const result = await createBenchmark({ [ singleMethod ] : required })

  const { winner: currentWinner, loser: currentLoser } = extractWinnerLoser(result)

  console.timeEnd(`run.${ singleMethod }.benchmark`)
  if (prevWinner === undefined)
    return console.log(`No previous benchmark "${ singleMethod }"`)
  if (prevWinner !== currentWinner){
    log({
      method : singleMethod,
      prevWinner,
      prevLoser,
      currentLoser,
      currentWinner,
    },
    'obj')
  }
}

async function getPreviousBenchmark(singleMethod){
  const resultPath = `${ __dirname }/benchmarks/benchmark_results/${ snakeCase(singleMethod) }.json`
  if (!existsSync(resultPath)) return {}

  const result = await readJson(resultPath)

  return extractWinnerLoser(result)
}

function extractWinnerLoser(input){
  const [ winner, loser ] = paths([ 'fastest.name', 'slowest.name' ])(input)

  return {
    winner,
    loser,
  }
}

const humanizedNumbers = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
}

async function runMultipleBenchmarks(methodName){
  console.time('run.multiple.benchmarks')
  const allMethods = await getAllBenchmarks()
  const numberVariants = process.argv[2]
  if(Number.isNaN(Number(numberVariants))){
    throw new Error('Number.isNaN(Number(numberVariants))')
  }
  if(!allMethods.includes(methodName)){
    throw new Error('!allMethods.includes(methodName)')
  }

  const iterable = async i => {
    console.log({i})
    const humanNumber = humanizedNumbers[i]
    const required = require(`${ benchmarksDir }/${ methodName }.js`)
    await createBenchmark({ [ `${methodName}.${humanNumber}` ] : required })
  }

  await mapAsyncLimit(
    iterable, 5, range(0, Number(numberVariants))
  )
  console.timeEnd('run.multiple.benchmarks')
}

exports.runMultipleBenchmarks = runMultipleBenchmarks
exports.runSingleBenchmark = runSingleBenchmark
