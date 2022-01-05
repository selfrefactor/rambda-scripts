const {scanFolder} = require('helpers-fn')
const {resolve} = require('path')
const {lintFn} = require('lint-fn')
const {copy} = require('fs-extra')
const {parse} = require('path')
const {mapAsyncLimit} = require('rambdax')

const LINT_STAGED_ONLY = process.env.LINT_STAGED_ONLY === 'ON'

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

async function getFiles(){
  const srcPath = resolve(__dirname, '../../../rambda/source')
  const files = await scanFolder({folder: srcPath, filterFn})
  if(!LINT_STAGED_ONLY) return files
  
  const stagedFilesRaw = await getStagedFiles(base)
  const stagedFiles = stagedFilesRaw.filter(x => x.endsWith('.js'))
  
  return intersection(stagedFiles, files)
}

void (async function lintTypingsTests() {
  const allFiles = await getFiles()
  await mapAsyncLimit(lintSingleFile, 5, allFiles)
})()
