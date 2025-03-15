import {existsSync} from 'fs'
import {log} from 'helpers-fn'
import {filter} from 'rambdax'
import {PATHS, MODES, NPM_README, DOCSIFY_SCRIPTS_MODE} from './constants'
import {verifyUsedBy} from './verify-used-by/verify-used-by'
import {readonlyTask} from './readonly-task/readonly-task'
import {populateReadmeData} from './populate-readme-data/populate-readme-data'
import {populateDocsData} from './populate-docs-data/populate-docs-data'

function getMode(mode: string) {
  if (!mode || !MODES.includes(mode)) {
    throw new Error('Unsupported mode')
  }
  return mode
}

export function validatePaths() {
  const wrongPaths: string[] = []
  const iterator = (filePath: string, prop: string) => {
    if (existsSync(filePath)) return true

    wrongPaths.push(prop)
    return false
  }
  const validPaths = filter(iterator)(PATHS)

  if (Object.keys(validPaths).length !== Object.keys(PATHS).length) {
    throw new Error(`There are invalid paths ${wrongPaths}`)
  }
}

export async function applyRambdaScripts(modeInput: string) {
  const mode = getMode(modeInput)
  if (mode === 'usedby') return verifyUsedBy()
  if (mode === 'readonly') return readonlyTask()
  if (mode === 'populate:docs') return populateDocsData()
  if (mode === 'populate:readme') {
    return populateReadmeData( NPM_README, DOCSIFY_SCRIPTS_MODE)
  }

  log(`Such mode '${mode}' doesn't exists`, 'error')
}
