const {resolve} = require('path')
const {exec, log} = require('helpers-fn')
const {copy, outputFile} = require('fs-extra')

void (async function immutableLint() {
  const filePath = resolve(
    __dirname,
    `../../../rambda/immutable.d.ts`
  )
  const jsFilePath = resolve(
    __dirname,
    `../../../rambda/immutable.js`
  )
  const filePathOrigin = resolve(
    __dirname,
    `../../../rambda/index.d.ts`
  )
  await outputFile(
    jsFilePath,
    `module.exports = require('./dist/rambda.js')`
  )
  await copy(filePathOrigin, filePath)
  const cwd = resolve(__dirname, '../../')

  const command = `node node_modules/eslint/bin/eslint.js -c files/.eslint.config.js ${filePath} --fix`
  console.log(`command`, command)
  await exec({
    cwd,
    command,
  })
  log('success', 'big')
})()
