import {existsSync} from 'fs'
import {log} from 'helpers-fn'
import {outputJson, readJson} from 'fs-extra'
import {filter} from 'rambdax'
import {PATHS, X_PATHS, MODES, WITH_RAMBDAX, DESTINATIONS} from './constants'
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
    if(existsSync(filePath)) return true
    
    wrongPaths.push(prop)
    return false
  }
  const validPaths = filter(iterator, PATHS)

  if (Object.keys(validPaths).length !== Object.keys(PATHS).length) {
    throw new Error(`There are invalid paths ${wrongPaths}`)
  }
  if(!WITH_RAMBDAX) return

  const validRambdaxPaths = filter(iterator, X_PATHS)

  if (Object.keys(validRambdaxPaths).length !== Object.keys(X_PATHS).length) {
    throw new Error(`There are invalid paths ${wrongPaths}`)
  }
}

export async function applyRambdaScripts(modeInput: string) {
  const mode = getMode(modeInput)
  validatePaths()

  if (mode === 'toolbelt') return dynamicTsToolbelt()
  if (mode === 'usedby') return verifyUsedBy()
  if (mode === 'populate:docs') return populateDocsData(WITH_RAMBDAX)
  if (mode === 'populate:readme') return populateReadmeData(WITH_RAMBDAX)

  log(`Such mode '${mode}' doesn't exists`, 'error')
}
