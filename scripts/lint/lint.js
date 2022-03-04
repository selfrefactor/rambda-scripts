const {spawn, scanFolder} = require('helpers-fn')
const {resolve} = require('path')
const {mapAsyncLimit, remove, intersection} = require('rambdax')
const {getStagedFiles} = require('../_modules/get-staged-files')

const base = resolve(__dirname, '../../../rambda/')

const LINT_STAGED_ONLY = process.env.LINT_STAGED_ONLY === 'ON'

async function lintFile(filePath) {
  const relativeFilePath = remove(base, filePath)
  const command =
    filePath.includes('/source/') || filePath.endsWith('rambda.js')
      ? 'ENABLE_FILE_EXTENSION_RULE=ON run'
      : 'run'
  // console.log(`lint command -`, `${command} lintfile ${relativeFilePath}`)

  console.time(relativeFilePath)
  await spawn({
    cwd: base,
    command,
    inputs: ['lintfile', relativeFilePath],
  })
  console.timeEnd(relativeFilePath)
}

const forbiddenPaths = [
  'run-rambda-specs/failing_tests', 'run-rambda-specs/ramda'
]

const filterFn = (filePath) => {
  if(!filePath.endsWith('.js')) return false
  const filtered = forbiddenPaths.filter(x => filePath.includes(x))
  return filtered === 0
}

async function getFiles() {
  const filesRaw = await scanFolder({folder: `${base}/source`})
  const files = filesRaw.filter(x => x.endsWith('.js'))

  if (!LINT_STAGED_ONLY) return files

  const stagedFilesRaw = await getStagedFiles(base)
  const stagedFiles = stagedFilesRaw.filter(filterFn)

  return intersection(stagedFiles, files)
}

void (async function lint() {
  const sourceFiles = await getFiles()
  console.log(`source files to lint`, sourceFiles.length)
  const allFiles = [...sourceFiles, `${base}/rambda.js`]
  console.log(`all files to lint`, allFiles.length)
  await mapAsyncLimit(lintFile, 5, allFiles)
})()
