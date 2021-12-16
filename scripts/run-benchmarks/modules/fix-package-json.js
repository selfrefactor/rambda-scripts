const {resolve} = require('path')
const {omit} = require('rambdax')
const {readJson, outputJson} = require('fs-extra')
const filePath = resolve(__dirname, `../../../../rambda/package.json`)

async function fixPackageJson(){
  const content = await readJson(filePath)
  const fixed = omit(['type'], content)
  await outputJson(filePath, fixed, {spaces: 2})
}

async function restorePackageJson(){
  const content = await readJson(filePath)
  const fixed = {
    ...content,
    type: `module`
  }
  await outputJson(filePath, fixed, {spaces: 2})
}

exports.restorePackageJson = restorePackageJson
exports.fixPackageJson = fixPackageJson
