import {outputJSON} from 'fs-extra'
import {map, piped, sortObject} from 'rambdax'

import {extractAllDefinitions} from './extract-from-typings/extract-all-definitions'
import {extractCategories} from './extract-from-typings/extract-categories'
import {extractDefinition} from './extract-from-typings/extract-definition'
import {extractExample} from './extract-from-typings/extract-example'
import {extractExplanation} from './extract-from-typings/extract-explanation'
import {extractNotes} from './extract-from-typings/extract-notes'
import {benchmarkInfo as benchmarkInfoMethod} from './extracts/benchmark-info'
import {failedRamdaTests} from './extracts/failed-ramda-tests'
import {failedTestsCount} from './extracts/failed-tests-count'
import {failedTestsReasons} from './extracts/failed-tests-reasons'
import {rambdaSource as rambdaSourceMethod} from './extracts/rambda-source'
import {rambdaSpecs as rambdaSpecsMethod} from './extracts/rambda-specs'
import {typingsTests as typingsTestsMethod} from './extracts/typings-tests'

function initiateData(definitions: Record<string, string>, key: string) {
  return map(x => ({[key]: x}), definitions)
}

interface AppendData {
  hash: Record<string, any>
  prop: string
  input: Record<string, any>
}

function appendData(appendDataInput: AppendData): Record<string, string> {
  const {input, prop, hash} = appendDataInput
  return map((x: any, methodName: string) => {
    if (!hash[methodName]) return x

    return {
      ...x,
      [prop]: hash[methodName],
    }
  }, input)
}

interface Save {
  toSave: Record<string, any>
}

async function save(input: Save) {
  const { toSave} = input
  const output = `${__dirname}/data.json`

  await outputJSON(output, toSave, {spaces: 2})
}

const pipedMethod: any = piped

function getSortedInput(pipedInput: any) {
  const predicate = (propA, propB) => (propA < propB ? -1 : 1)
  return sortObject(predicate, pipedInput)
}

export async function populateDocsData() {
  const definitions = extractDefinition()
  const categories = extractCategories()
  const allDefinitions = extractAllDefinitions()
  const rambdaSource = await rambdaSourceMethod()
  const rambdaSpecs = await rambdaSpecsMethod()
  const typingsTests = await typingsTestsMethod()
  const benchmarkInfo = await benchmarkInfoMethod()
  const examples = extractExample()
  const explanations = extractExplanation()
  const notes = extractNotes()
  const failedRamdaSpecs = failedRamdaTests()
  const failedSpecsReasons = failedTestsReasons()
  const failedSpecsCount = failedTestsCount()

  const pipedInput = initiateData(definitions, 'typing')
  const sortedPipedInput = getSortedInput(pipedInput)

  const toSave = pipedMethod(
    sortedPipedInput,
    input =>
      appendData({
        input,
        prop: 'allTypings',
        hash: allDefinitions,
      }),
    input =>
      appendData({
        input,
        prop: 'categories',
        hash: categories,
      }),
    input =>
      appendData({
        input,
        prop: 'notes',
        hash: notes,
      }),
    input =>
      appendData({
        input,
        prop: 'rambdaSource',
        hash: rambdaSource,
      }),
    input =>
      appendData({
        input,
        prop: 'rambdaSpecs',
        hash: rambdaSpecs,
      }),
    input =>
      appendData({
        input,
        prop: 'benchmarkInfo',
        hash: benchmarkInfo,
      }),
    input =>
      appendData({
        input,
        prop: 'explanation',
        hash: explanations,
      }),
    input =>
      appendData({
        input,
        prop: 'example',
        hash: examples,
      }),
    input =>
      appendData({
        input,
        prop: 'typescriptDefinitionTest',
        hash: typingsTests,
      }),
    input =>
      appendData({
        input,
        prop: 'failedRamdaSpecs',
        hash: failedRamdaSpecs,
      }),
    input =>
      appendData({
        input,
        prop: 'failedSpecsReasons',
        hash: failedSpecsReasons,
      }),
    input =>
      appendData({
        input,
        prop: 'failedSpecsCount',
        hash: failedSpecsCount,
      })
  )

  await save({
    ,
    toSave: toSave as Record<string, any>,
  })

  return toSave
}
