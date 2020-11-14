import {existsSync} from 'fs'
import {resolve} from 'path'
export const ALL_PATHS = {
  documentationFile: resolve(__dirname, '../../rambda/files/index.d.ts'),
  toolbeltDestination: resolve(__dirname, '../../rambda/_ts-toolbelt'),
  rambdaxToolbeltDestination: resolve(
    __dirname,
    '../../rambdax/_ts-toolbelt'
  ),
  source: resolve(__dirname, '../../rambda/source'),
  sourceDestination: resolve(__dirname, '../../rambda/src'),
  docsDir: resolve(__dirname, '../../rambda-docs/assets'),
  rambdaxDir: resolve(__dirname, '../../rambdax'),
}

export const MODES = ['toolbelt', 'highlighter', 'usedby']
export const WITH_RAMBDAX = process.env.WITH_RAMBDAX === 'ON'
export const HAS_RAMBDAX = existsSync(
  resolve(__dirname, '../../rambdax/package.json')
)
