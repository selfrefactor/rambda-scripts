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
  dataSource: resolve(__dirname, '../../rambda/scripts/populate-docs-data/data.json'),
  rambdaxDataSource: resolve(__dirname, '../../rambda/scripts/populate-docs-data/data-rambdax.json'),
  sourceDestination: resolve(__dirname, '../../rambda/src'),
  docsDir: resolve(__dirname, '../../rambda-docs/assets'),
  rambdaxDir: resolve(__dirname, '../../rambdax'),
}

export const DESTINATIONS = {
  data: resolve(__dirname, '../../rambda-docs/assets/new-data.json'),
  highlighterResolver: resolve(__dirname, '../../rambda-docs/assets/resolver.json'),
}

export const MODES = ['toolbelt', 'highlighter', 'usedby']
export const WITH_RAMBDAX = process.env.WITH_RAMBDAX === 'ON'
export const HAS_RAMBDAX = existsSync(
  resolve(__dirname, '../../rambdax/package.json')
)
