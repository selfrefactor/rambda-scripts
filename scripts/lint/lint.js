const { spawn, scanFolder } = require('helpers-fn')
const { resolve } = require('path')
const { mapAsyncLimit, remove, intersection } = require('rambdax')
const { getStagedFiles } = require('../_modules/get-staged-files')

const base = resolve(__dirname, '../../../rambda/')

const LINT_STAGED_ONLY = process.env.LINT_STAGED_ONLY === 'ON'

async function lintFile(filePath){
  const relativeFilePath = remove(base, filePath)
  console.time(relativeFilePath)
  await spawn({
    cwd     : base,
    command : 'run',
    inputs  : [ 'lintfile', relativeFilePath ],
  })
  console.timeEnd(relativeFilePath)
}

async function getFiles(){
  const files = await scanFolder({ folder: `${base}/source`})
  if(!LINT_STAGED_ONLY) return files
  
  const stagedFiles = await getStagedFiles(base)
  
  return intersection(stagedFiles, files)
}

void async function lint(){
  const sourceFiles = await getFiles()
  const allFiles = [
    ...sourceFiles,
    `${base}/rambda.js`
  ]
  await mapAsyncLimit(lintFile, 5, allFiles)
}()
