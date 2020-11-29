import {existsSync} from 'fs'
import {resolve} from 'path'

const base = resolve(__dirname, '../../rambda')
const xBase = resolve(__dirname, '../../rambdax')
const docsBase = resolve(__dirname, '../../rambda-docs')

export const ALL_PATHS = {
  base,
  xBase,
  docsBase,
  documentationFile: `${base}/files/index.d.ts`,
  toolbeltDestination: `${base}/_ts-toolbelt`,
  rambdaxToolbeltDestination: `${xBase}/_ts-toolbelt`,
  source: `${base}/source`,
  dataSource: `${base}/scripts/populate-docs-data/data.json`,
  rambdaxDataSource: `${base}/scripts/populate-docs-data/data-rambdax.json`,
  sourceDestination: `${base}/src`,
  docsDir: `${docsBase}/assets`,
  rambdaxDir: xBase,
}

export const DESTINATIONS = {
  data: resolve(__dirname, '../../rambda-docs/assets/new-data.json'),
  highlighterResolver: resolve(
    __dirname,
    '../../rambda-docs/assets/resolver.json'
  ),
}

export const MODES = [
  'toolbelt',
  'highlighter',
  'usedby',
  'populate:docs',
  'populate:readme',
  'ramda:specs',
]

export const WITH_RAMBDAX = process.env.WITH_RAMBDAX === 'ON'

export const HAS_RAMBDAX = existsSync(
  resolve(__dirname, '../../rambdax/package.json')
)
