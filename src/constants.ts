import {existsSync} from 'fs'
import {resolve} from 'path'

const base = resolve(__dirname, '../../rambda')
const xBase = resolve(__dirname, '../../rambdax')
const docsBase = resolve(__dirname, '../../rambda-docs')

export const PATHS = {
  base,
  docsBase,
  documentationFile: `${base}/files/index.d.ts`,
  toolbeltDestination: `${base}/_ts-toolbelt`,
  source: `${base}/source`,
  output: `${base}/src`,
  sourceDestination: `${base}/src`,
  docsDir: `${docsBase}/assets`,
}

export const X_PATHS = {
  xBase,
  rambdaxToolbeltDestination: `${xBase}/_ts-toolbelt`,
  docsDir: `${docsBase}/assets`,
  rambdaxDir: xBase,
}

export const DESTINATIONS = {
  dataSource: `${__dirname}/populate-docs-data/data.json`,
  rambdaxDataSource: `${__dirname}/populate-docs-data/data-rambdax.json`,
  docsData: `${__dirname}/populate-docs-data/data.json`,
  rambdaxDocsData: `${__dirname}/populate-docs-data/data-rambdax.json`,
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
