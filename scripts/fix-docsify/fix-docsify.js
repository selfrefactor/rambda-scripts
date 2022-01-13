const R = require('ramda')
const Rambda = require('rambda')
const {camelCase} = require('string-fn')
const {existsSync} = require('fs')
const {interpolate, replace} = require('rambdax')
const {log} = require('helpers-fn')
const {readFile, outputFile} = require('fs-extra')
const {resolve} = require('path')

const library = process.env.WITH_RAMBDAX === 'ON' ? 'rambdax' : 'rambda'

void (async function main() {
  const location = resolve(__dirname, `../../../${library}/docs/index.html`)
  const content = (await readFile(location)).toString()
  const fixed = replace(/Document/g, 'Rambda documentation', content)
  await outputFile(location, fixed)
})()
