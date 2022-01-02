const {resolve} = require('path')
const {existsSync} = require('fs')
const {exec} = require('helpers-fn')
const { readJson } = require('fs-extra')

const library = process.env.WITH_RAMBDAX ? 'rambdax':'rambda'
const BASE = resolve(__dirname, `../../../${library}`)
const PACKAGE_JSON = `${BASE}/package.json` 

void async function githubRelease(){
  if(!existsSync(PACKAGE_JSON)) throw new Error('!existsSync')

  const {version} = await readJson(PACKAGE_JSON)

  const command = `gh release create v${version}`
  console.log({command})
  await exec({
    cwd: BASE,
    command
  })
}()
