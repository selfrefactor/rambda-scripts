import {existsSync, readFile} from 'fs-extra'
import {resolve} from 'path'
import {remove, mapToObjectAsync} from 'rambdax'
import {PATHS} from '../../constants'
import {getMethods} from '../extract-from-typings/get-methods'
import {benchmarkSummary as benchmarkSummaryMethod} from '../../read-benchmarks/benchmark-summary'

const clean = remove([
  "const _ = require('lodash')",
  "const R = require('../../../dist/rambda.js')",
  "const Ramda = require('ramda')",
  /module\.exports =.+/,
])

const cleanSummary = remove(' slower')

const FASTEST = '🚀 Fastest'

function getMethodSummary(method: string, benchmarkSummary: string) {
  const line = benchmarkSummary
    .split('\n')
    .find(x => x.trim().startsWith(`*${method}*`))
  if (!line) return ''

  const [, thisLibrary, ramda, lodash] = line
    .split('|')
    .map(x => x.trim())
    .map(cleanSummary)

  if (lodash === '🔳') {
    if (thisLibrary === FASTEST) {
      return `Rambda is faster than Ramda with ${ramda}`
    }

    return `Rambda is slower than Ramda with ${thisLibrary}`
  }
  if (thisLibrary === FASTEST) {
    return `Rambda is fastest. Ramda is ${ramda} slower and Lodash is ${lodash} slower`
  }
  if (ramda === FASTEST) {
    return `Ramda is fastest. Rambda is ${thisLibrary} slower and Lodash is ${lodash} slower`
  }

  return `Lodash is fastest. Rambda is ${thisLibrary} slower and Ramda is ${ramda} slower`
}

export async function benchmarkInfo() {
  console.log(`benchmarkInfo`)
  await benchmarkSummaryMethod()
  const benchmarkSummary = (
    await readFile(resolve(__dirname, '../../read-benchmarks/summary.txt'))
  ).toString()

  const result = await mapToObjectAsync(async (method: string) => {
    const filePath = `${PATHS.source}/benchmarks/${method}.js`
    const okExists = existsSync(filePath)

    if (!okExists) return false
    const benchmarkContentRaw = await readFile(filePath)
    const benchmarkContent = clean(benchmarkContentRaw.toString().trim())
    const methodSummary = getMethodSummary(method, benchmarkSummary)

    return {
      [method]: {
        benchmarkContent,
        methodSummary,
      },
    }
  }, getMethods())

  return result as Record<string, string>
}
