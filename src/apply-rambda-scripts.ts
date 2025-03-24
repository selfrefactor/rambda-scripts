import {log} from 'helpers-fn'
import { MODES, DOCSIFY_SCRIPTS_MODE} from './constants'
import {verifyUsedBy} from './verify-used-by/verify-used-by'
import {populateReadmeData} from './populate-readme-data/populate-readme-data'
import {populateDocsData} from './populate-docs-data/populate-docs-data'

function getMode(mode: string) {
  if (!mode || !MODES.includes(mode)) {
    throw new Error('Unsupported mode')
  }
  return mode
}

export async function applyRambdaScripts(modeInput: string) {
  const mode = getMode(modeInput)
  if (mode === 'usedby') return verifyUsedBy()
  if (mode === 'populate:docs') return populateDocsData()
  if (mode === 'populate:readme') {
    return populateReadmeData( DOCSIFY_SCRIPTS_MODE)
  }

  log(`Such mode '${mode}' doesn't exists`, 'error')
}
