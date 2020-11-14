import { resolve } from 'path'
export const ALL_PATHS = {
  documentationFile: resolve(__dirname, '../../rambda/files/index.d.ts'),
  toolbeltDestination: resolve(__dirname, '../../rambda/_ts-toolbelt/src'),
  source: resolve(__dirname, '../../rambda/source'),
  sourceDestination: resolve(__dirname, '../../rambda/src'),
  docsDir: resolve(__dirname, '../../rambda-docs/assets'),
  rambdaxDir: resolve(__dirname, '../../rambdax'),
}
