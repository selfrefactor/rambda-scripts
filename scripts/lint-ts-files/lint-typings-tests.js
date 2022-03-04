const {scanFolder} = require('helpers-fn')
const {resolve} = require('path')
const {lintFn} = require('lint-fn')
const {copy} = require('fs-extra')
const {parse} = require('path')
const {mapAsyncLimit, intersection} = require('rambdax')
const {getStagedFiles} = require('../_modules/get-staged-files')

const LINT_STAGED_ONLY = process.env.LINT_STAGED_ONLY === 'ON'
const base = resolve(__dirname, '../../../rambda/')

const filterFn = x => x.endsWith('-spec.ts')

const lintSingleFile = async filePath => {
  const {name} = parse(filePath)
  console.time(name)
  const dist = `${__dirname}/assets/${name}.ts`
  await copy(filePath, dist)
  await lintFn(dist, 'outer', __dirname)
  await copy(dist, filePath)
  console.timeEnd(name)
}

async function getFiles() {
  const srcPath = resolve(__dirname, '../../../rambda/source')
  const files = await scanFolder({folder: srcPath, filterFn})
  if (!LINT_STAGED_ONLY) return files

  const stagedFilesRaw = await getStagedFiles(base)
  console.log(`stagedFilesRaw`, stagedFilesRaw.length)
  const stagedFiles = stagedFilesRaw.filter(x => x.endsWith('.js'))
  console.log(`stagedFiles`, stagedFiles.length)

  return intersection(stagedFiles, files)
}

void (async function lintTypingsTests() {
  const allFiles = await getFiles()
  console.log(`allFiles`, allFiles.length)
  await mapAsyncLimit(lintSingleFile, 5, allFiles)
})()
