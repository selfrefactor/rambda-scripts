import {camelCase} from 'string-fn'
import {readdirSync} from 'fs'
import {remove, head, piped, toLower, split} from 'rambdax'
import {readJsonSync, outputFile, outputJson} from 'fs-extra'
import {resolve} from 'path'

const resultsDir = resolve(
  __dirname,
  '../../scripts/run-benchmarks/benchmarks/benchmark_results'
)

function parseMethodName(input: string) {
  if (!input.endsWith('Curried')) return input

  const methodName = remove('Curried', input)

  return `${methodName} (curried)`
}

function readResults(file: string): {
  name: string,
  results: {name: string}[],
} {
  const {results, name} = readJsonSync(`${resultsDir}/${file}`)

  return {results, name}
}

interface SummaryCounter {
  ramda: number,
  rambda: number,
  lodash: number,
}

export async function benchmarkSummary() {
  const summaryCounter: SummaryCounter = {
    ramda: 0,
    rambda: 0,
    lodash: 0,
  }
  const allResults = readdirSync(resultsDir)

  const tableRows = allResults.map(file => {
    const {results, name} = readResults(file)
    const methodName = camelCase(name)
    let rambda
    let ramda
    let lodash

    results.forEach(result => {
      if (result.name === 'Rambda') rambda = result
      if (result.name === 'Ramda') ramda = result
      if (result.name.includes('Lodash')) lodash = result
    })

    const columns = [rambda, ramda, lodash]
      .map((x: undefined | Record<string, number>) => {
        if (!x) return '🔳'
        if (x.percentSlower === 0) {
          const winner = piped<any, any, any, any>(
            x.name,
            split('.'),
            head,
            toLower
          )
          summaryCounter[winner]++
        }

        return x.percentSlower === 0
          ? '🚀 Fastest'
          : `${x.percentSlower}% slower`
      })
      .join(' | ')

    return ` *${parseMethodName(methodName)}* | ${columns}`
  })

  const toSave = tableRows.join('\n')

  await outputFile(`${__dirname}/summary.txt`, toSave)
  await outputJson(`${__dirname}/summary-counter.json`, summaryCounter, {
    spaces: 2,
  })
}
