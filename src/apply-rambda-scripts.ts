import {existsSync} from 'fs'
import {log} from 'helpers-fn'
import {outputJson, readJson} from 'fs-extra'
import {filter} from 'rambdax'
import {ALL_PATHS, MODES, WITH_RAMBDAX, DESTINATIONS} from './constants'
import {ApplyHighlighter} from './apply-highlighter/apply-highlighter'
import {dynamicTsToolbelt} from './dynamic-ts-toolbelt/dynamic-ts-toolbelt'
import {verifyUsedBy} from './verify-used-by/verify-used-by'
import {populateDocsData} from './populate-docs-data/populate-docs-data'
import {populateReadmeData} from './populate-readme-data/populate-readme-data'

function getMode(mode: string) {
  if (!mode || !MODES.includes(mode)) {
    throw new Error('Unsupported mode')
  }
  return mode
}

export function validatePaths() {
  const wrongPaths: string[] = []
  const iterator = (filePath: string, prop: string) => {
    if (!WITH_RAMBDAX && prop.startsWith('rambdax')) return true
    if(existsSync(filePath)) return true
    if(prop.toLowerCase().includes('datasource')) return true
    
    wrongPaths.push(prop)
    return false
  }
  const validPaths = filter(iterator, ALL_PATHS)

  if (Object.keys(validPaths).length !== Object.keys(ALL_PATHS).length) {
    throw new Error(`There are invalid paths ${wrongPaths}`)
  }
}

async function applyHighlighter() {
  const source = await readJson(WITH_RAMBDAX ? ALL_PATHS.rambdaxDataSource: ALL_PATHS.dataSource)

  const ApplyHighlighterInstance = new ApplyHighlighter()
  await ApplyHighlighterInstance.init()
  const {toSave, resolver} = await ApplyHighlighterInstance.apply(source)

  await outputJson(DESTINATIONS.data, toSave)
  await outputJson(DESTINATIONS.highlighterResolver, resolver)
}

export async function applyRambdaScripts(modeInput: string) {
  const mode = getMode(modeInput)
  validatePaths()

  if (mode === 'toolbelt') return dynamicTsToolbelt()
  if (mode === 'usedby') return verifyUsedBy()
  if (mode === 'highlighter') return applyHighlighter()
  if (mode === 'populate:docs') return populateDocsData(WITH_RAMBDAX)
  if (mode === 'populate:readme') return populateReadmeData(WITH_RAMBDAX)

  log(`Such mode '${mode}' doesn't exists`, 'error')
}
