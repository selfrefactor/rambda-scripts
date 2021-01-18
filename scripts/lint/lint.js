const { spawn, scanFolder } = require('helpers-fn')
const { resolve } = require('path')
const { mapAsyncLimit, remove } = require('rambdax')

const base = resolve(__dirname, '../../../rambda/')

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

void async function lint(){
  const sourceFiles = await scanFolder({ folder: `${base}/source`})
  const allFiles = [
    ...sourceFiles,
    `${base}/rambda.js`
  ]
  await mapAsyncLimit(lintFile, 5, allFiles)
}()
