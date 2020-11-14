import {existsSync} from 'fs-extra'
import {resolve} from 'path'
import {filter} from 'rambdax'
import {ALL_PATHS, MODES, WITH_RAMBDAX} from './constants'
import {applyHighlighter as applyHighlighterLib} from './apply-highlighter/apply-highlighter'
import {dynamicTsToolbelt} from './dynamic-ts-toolbelt/dynamic-ts-toolbelt'
import {verifyUsedBy} from './verify-used-by/verify-used-by'

function getMode(mode: string) {
  if (!mode || !MODES.includes(mode)) {
    throw new Error('Unsupported mode')
  }
  return mode
}

export function validatePaths() {
  const iterator = (filePath: string, prop: string) => {
    if (!WITH_RAMBDAX && prop.startsWith('rambdax')) return true
    return existsSync(filePath)
  }
  const validPaths = filter(iterator, ALL_PATHS)

  if (Object.keys(validPaths).length !== Object.keys(ALL_PATHS).length) {
    throw new Error('There is invalid path')
  }
}

async function applyHighlighter() {}

export async function applyRambdaScripts(modeInput: string) {
  const mode = getMode(modeInput)
  validatePaths()

  if (mode === 'toolbelt') return dynamicTsToolbelt()
  if (mode === 'usedby') return verifyUsedBy()
}
