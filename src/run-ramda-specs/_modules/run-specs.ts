const allDifferences = require('../all-differences.json')
import {readFileSync} from 'fs'
import {exec, log} from 'helpers-fn'
import {resolve} from 'path'
import {glue, map, mapAsync} from 'rambdax'

const baseDir = resolve(__dirname, '../outputs')
const ramdaDir = resolve(__dirname, '../ramda')

const getOutputPath = (x: string) => `${baseDir}/${x}.txt`

const getCommand = (x: string) => {
  const outputPath = getOutputPath(x)
  const command = glue(`
  BABEL_ENV=cjs
  node 
  node_modules/mocha/bin/mocha
  --require 
  @babel/register 
  --reporter
  spec 
  test/${x}.js
  > ${outputPath} 2>&1
  `)

  return {
    command,
    outputPath,
  }
}

const KNOWN_FAILING_TESTS = map<{count: number}, number>(
  x => x.count,
  allDifferences
)

function getNumberFailing(testOutput: string) {
  const [line] = testOutput.split('\n').filter(x => x.includes('failing'))
  const [numberFailing] = line.split('failing')

  return Number(numberFailing.trim())
}

export async function runSingleSpec(method: string) {
  const {command, outputPath} = getCommand(method)
  console.log({methodToRun: method, command})

  await exec({
    cwd: ramdaDir,
    onLog: () => {},
    command,
  })

  const testOutput = readFileSync(outputPath).toString()
  console.log(`testOutput`, testOutput)
  if (testOutput.includes('TypeError')) {
    log(`No possible to test 'R.${method}'`, 'error')

    return false
  }
  if (!testOutput.includes('failing')) {
    log(`All tests are passing for method 'R.${method}'`, 'success')

    return true
  }

  const numberFailing = getNumberFailing(testOutput)

  if (
    !KNOWN_FAILING_TESTS[method] ||
    numberFailing > KNOWN_FAILING_TESTS[method]
  ) {
    log(`'${method}' has '${numberFailing}' tests`, 'error')

    return false
  }

  return true
}

export async function runSpecs(methodsWithSpecs: string[]) {
  return mapAsync(
    async(method: string) => runSingleSpec(method),
    methodsWithSpecs
  )
}
