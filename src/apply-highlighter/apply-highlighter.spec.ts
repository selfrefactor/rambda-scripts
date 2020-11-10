const {
  ApplyHighlighter: ApplyHighlighterClass,
} = require('./apply-highlighter')
import {readJson, outputJson}  from 'fs-extra'
import {resolve} from 'path'
import {ms} from 'string-fn'

const sourceFilePath = resolve(__dirname, '../data.json')
const sourceRambdaxFilePath = resolve(__dirname, '../data-rambdax.json')
const outputFilePath = resolve(__dirname, '../new-data.json')
const outputRambdaxFilePath = resolve(__dirname, '../new-data-rambdax.json')
const resolverFilePath = resolve(__dirname, '../resolver.json')

const WITH_RAMBDAX = false

jest.setTimeout(ms('30 minutes'))

test('happy', async () => {
  const source = await readJson(WITH_RAMBDAX ? sourceRambdaxFilePath: sourceFilePath)

  const ApplyHighlighter = new ApplyHighlighterClass()
  await ApplyHighlighter.init()
  const {toSave, resolver} = await ApplyHighlighter.apply(source)

  await outputJson(WITH_RAMBDAX ? outputRambdaxFilePath: outputFilePath, toSave)
  await outputJson(resolverFilePath, resolver)
})