const {spawn, scanFolder} = require('helpers-fn')
const {resolve} = require('path')
const {mapParallelAsyncWithLimit, intersection} = require('rambdax')
const {getStagedFiles} = require('../_modules/get-staged-files')

const base = resolve(__dirname, '../../../rambda/')

async function lintFile(filePath) {
  console.log(filePath, 'filePath')
  console.time(filePath)
  await spawn({
    cwd: base,
    command: `run`,
    inputs: ['lint:file:unsafe', filePath],
  })
  console.timeEnd(filePath)
}

const forbiddenPaths = [
  'run-rambda-specs/failing_tests',
  'run-rambda-specs/ramda',
]

const filterFn = filePath => {
  if (!filePath.endsWith('.js')) return false
  if(filePath.includes('files/index.d.ts')) return false
  const filtered = forbiddenPaths.filter(x => filePath.includes(x))
  return filtered.length === 0
}

async function getFiles() {
  const filesRaw = await scanFolder({folder: `${base}/source`})
  const files = filesRaw.filter(x => x.endsWith('.js'))
  const stagedFilesRaw = await getStagedFiles(base)
  console.log(`stagedFilesRaw`, stagedFilesRaw.length)
  const stagedFiles = stagedFilesRaw.filter(filterFn)
  console.log(`stagedFiles`, stagedFiles.length)

  return intersection(stagedFiles, files)
}

void (async function lint() {
  const allFiles = await getFiles()
  await mapParallelAsyncWithLimit(lintFile, 5, allFiles)
})()
