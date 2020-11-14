import { existsSync } from 'fs-extra'
import { resolve } from 'path'
import { filter } from 'rambdax'
import {ALL_PATHS} from './constants'
import {applyHighlighter as applyHighlighterLib} from  './apply-highlighter/apply-highlighter'
import {dynamicTsToolbelt} from './dynamic-ts-toolbelt/dynamic-ts-toolbelt'

const MODES = ['toolbelt', 'highlighter']

const WITH_RAMBDAX = process.env.WITH_RAMBDAX === 'ON'

function getMode(mode: string | undefined){
  const actualMode = mode === undefined ? process.env.RAMBDA_SCRIPTS_MODE : mode

  if(!actualMode || !MODES.includes(actualMode)){
    throw new Error('Unsupported mode')
  }
  return mode
}

export function validatePaths(){
  const iterator = (filePath: string, prop: string) => {
    if(!WITH_RAMBDAX && prop.startsWith('rambdax')) return true
    return existsSync(filePath)
  } 
  const validPaths = filter(iterator, ALL_PATHS )

  if(Object.keys(validPaths).length !== Object.keys(ALL_PATHS).length){
    throw new Error('There is invalid path')
  }
}


async function applyHighlighter(){

}
async function applyToolbelt(){

}

export async function applyRambdaScripts(modeInput ?: string){
  const mode = getMode(modeInput)
  validatePaths()
  if(mode === 'toolbelt') return applyToolbelt()
  console.log(1)
}
