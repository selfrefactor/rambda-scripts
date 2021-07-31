const {  readFile, outputFile } = require('fs-extra')
const { replace } = require('rambdax')

async function replaceInFile({filePath, target, replacer}){
  const content = (await readFile(filePath)).toString()

  const newContent = replace(target, replacer, content)

  await outputFile(filePath, newContent)
}

exports.replaceInFile = replaceInFile
