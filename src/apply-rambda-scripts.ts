import { existsSync } from 'fs-extra'
import { resolve } from 'path'
import { filter } from 'rambdax'
import {applyHighlighter as applyHighlighterLib} from  './apply-highlighter/apply-highlighter'
import {dynamicTsToolbelt} from './dynamic-ts-toolbelt/dynamic-ts-toolbelt'

const MODES = ['toolbelt', 'highlighter']

const WITH_RAMBDAX = process.env.WITH_RAMBDAX === 'ON'

function getMode(mode: string | undefined){
  if(!mode || !MODES.includes(mode)){
    throw new Error('Unsupported mode')
  }
  return mode
}

const ALL_PATHS = {
  documentationFile: resolve(__dirname, '../../rambda/files/index.d.ts'),
  sourceDir: resolve(__dirname, '../../rambda/source'),
  destinationDir: resolve(__dirname, '../../rambda/src'),
  docsDir: resolve(__dirname, '../../rambda-docs/assets'),
  rambdaxDir: resolve(__dirname, '../../rambdax'),
}

export function validatePaths(){
  const iterator = (filePath: string, prop: string) => {
    if(!WITH_RAMBDAX && prop.startsWith('rambdax')) return true
    return existsSync(filePath)
  } 
  const validPaths = filter(iterator, ALL_PATHS)

  if(Object.keys(validPaths).length !== Object.keys(ALL_PATHS).length){
    throw new Error('There is invalid path')
  }
}


async function applyHighlighter(){

}
async function applyHighlighter(){

}

async function applyRambdaScripts(){
  const mode = getMode(process.env.RAMBDA_SCRIPTS_MODE)
  validatePaths()
}

// applyRambdaScripts()