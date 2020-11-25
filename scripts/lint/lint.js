const { spawn } = require('helpers-fn')
const { parse, resolve } = require('path')
const { mapAsync } = require('rambdax')

const base = resolve(__dirname, '../../../rambda/')

const folders = [
  'source',
  'scripts/all-scripts',
  'scripts/add-new-method',
  'scripts/build-step',
  'scripts/consume-typings',
  'scripts/populate-docs-data',
  'scripts/populate-readme-data',
  'scripts/run-benchmarks',
]

const files = [
  'rambda.js',
  'scripts/run-ramda-specs/run-ramda-specs.js',
  'scripts/run-ramda-specs/run-ramda-specs.spec.js',
  'scripts/run-ramda-specs/import-ramda-specs.spec.js',
  'scripts/run-ramda-specs/import-ramda-specs.js',
]

async function lintFolder(folder){
  await spawn({
    cwd     : `${ base }/${ folder }`,
    command : 'run',
    inputs  : [ 'lint' ],
  })
}

async function lintFile(file){
  const filePath = `${ base }/${ file }`
  const { dir, name } = parse(filePath)
  await spawn({
    cwd     : dir,
    command : 'run',
    inputs  : [ 'lintfile', `${ name }.js` ],
  })
}

void async function lint(){
  await mapAsync(lintFolder)(folders)
  await mapAsync(lintFile)(files)
}()
