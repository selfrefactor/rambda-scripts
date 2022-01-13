const allDifferences = require('../all-differences.json')
import * as R from 'rambda'
import {emptyDirSync, writeJson} from 'fs-extra'
import {getIndent, indent} from 'string-fn'
import {readFileSync, writeFileSync, existsSync} from 'fs'
import {remove, replace, map, filter, piped, mapToObject} from 'rambdax'
import {resolve} from 'path'

const BASE = resolve(__dirname, '../')
const OUTPUT = `${BASE}/failing_tests`

const getOutputPath = (x: string) => `${BASE}/outputs/${x}.txt`
const getTestPath = (x: string) => `${BASE}/ramda/test/${x}.js`

function withSingleMethod(method: string): FailingTest | false {
  const outputPath = getOutputPath(method)
  if (!existsSync(outputPath)) return false

  const content: string = readFileSync(outputPath).toString()
  const testContent = readFileSync(getTestPath(method)).toString()

  const [goodTestsRaw] = content.split('passing')
  const goodTests = goodTestsRaw
    .split('\n')
    .filter(line => line.includes('✓'))
    .map(line => remove('✓', line).trim())

  const badTests = piped<string[]>(
    content.split('passing'),
    ([first]) => first,
    x => x.split('\n'),
    filter((x: string) => x.includes(')')),
    map((x: string) => x.split(')')[1].trim())
  )

  let flag = false
  let flagBad = false
  let counter = 0
  let badCounter = 0
  let indentCount = 0
  const holder: string[] = []

  testContent.split('\n').forEach(line => {
    if (badTests[badCounter] && line.includes(badTests[badCounter])) {
      indentCount = getIndent(line)

      holder.push(line)
      flagBad = true

      return flag = false
    }

    if (goodTests[counter] && line.includes(goodTests[counter])) {
      indentCount = getIndent(line)

      return flag = true
    }

    if (line === `${indent('});', indentCount)}` && !flagBad) {
      counter++
      flagBad = false

      return flag = false
    }

    if (line === `${indent('});', indentCount)}` && flagBad) {
      if (!flag) holder.push(line)

      badCounter++
      flagBad = false

      return flag = false
    }

    if (!flag) {
      const lineToPush = line.includes('../source')
        ? replace('../source', 'rambda', line)
        : line

      holder.push(lineToPush)
    }
  })
  let goodTestsRawipFirstEmptyLine = true

  const toReturn = holder.filter(x => {
    if (!x && goodTestsRawipFirstEmptyLine) {
      goodTestsRawipFirstEmptyLine = false

      return true
    }

    return x
  })

  writeFileSync(`${OUTPUT}/${method}.js`, toReturn.join('\n'))

  const differencePayload = allDifferences[method]
    ? {diffReason: allDifferences[method].reason}
    : {}

  return {
    ...differencePayload,
    method,
    content: toReturn.join('\n'),
  }
}

interface FailingTest {
  content: string,
  method: string,
  diffReason?: string,
}

function failingTestPredicate(x: FailingTest | false): x is FailingTest {
  if (x === false) return false
  return true
}

export async function writeSummary() {
  const dir = `${BASE}/failing_tests`
  emptyDirSync(dir)

  const allMethods = Object.keys(R)
  const summary: string[] = []

  const allFailingTests = allMethods
    .map(method => withSingleMethod(method))
    .filter(failingTestPredicate)

  const summaryJson = mapToObject(x => ({[x.method]: x}), allFailingTests)
  await writeJson(`${BASE}/summary.json`, summaryJson)

  allFailingTests.forEach((input: FailingTest) => {
    const {content, method, diffReason} = input
    const reasoning = diffReason
      ? `\nReason for failing:  ${diffReason}\n`
      : ''

    const toAdd = `> ${method}\n${reasoning}\n\`\`\`javascript\n${content}\n\`\`\`\n\n`

    summary.push(toAdd)
  })

  writeFileSync(`${BASE}/_SUMMARY.md`, summary.join(''))
}
