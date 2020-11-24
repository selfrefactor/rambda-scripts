const {resolve} = require('path')
const {readFile, writeFile, readJson} = require('fs-extra')
const outputPath = resolve(__dirname, '../../../rambda/package.hjson')
const sourcePath = resolve(__dirname, '../../../rambda/package.json')

const {forEach, remove} = require('rambdax')
const {count, indent} = require('string-fn')

function applyChange(content, version, dependency, libVersion){
  return content.split('\n').map(line => {
    if(line.startsWith('const VERSION =')){
      return `const VERSION = ${libVersion}`
    }
    if(!line.trim().startsWith(`${dependency}:`)) return line

    const currentVersion = (remove(`${dependency}:`, line)).trim()
    if(!currentVersion.includes('.')) return line
    if(currentVersion === version) return line

    const padding = count(line, ' ')

    return indent(`${dependency}: ${version}`, padding - 1)
  }).join('\n')
}

void async function fixHjson(){
  const {version: libVersion, devDependencies} = await (
    readJson(sourcePath)
  )
  let content = (await readFile(outputPath)).toString()

  forEach((x, prop) => {
    content = applyChange(content, x, prop, libVersion)
  }, devDependencies)

  await writeFile(outputPath, content)
}()