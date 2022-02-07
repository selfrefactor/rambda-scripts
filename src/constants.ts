import {existsSync} from 'fs'
import {resolve} from 'path'

const base = resolve(__dirname, '../../rambda')
const xBase = resolve(__dirname, '../../rambdax')
const docsBase = resolve(__dirname, '../../rambda-docs')

export const BULLET = '❯' // ➤

export const PATHS = {
  base,
  docsBase,
  documentationFile: `${base}/files/index.d.ts`,
  source: `${base}/source`,
  output: `${base}/src`,
  sourceDestination: `${base}/src`,
  docsDir: `${docsBase}/assets`,
}

export const X_PATHS = {
  xBase,
  docsDir: `${docsBase}/assets`,
  rambdaxDir: xBase,
}

export const DESTINATIONS = {
  changelog: `${base}/CHANGELOG.md`,
  rambdaxChangelog: `${xBase}/CHANGELOG.md`,
  dataSource: `${__dirname}/populate-docs-data/data.json`,
  rambdaxDataSource: `${__dirname}/populate-docs-data/data-rambdax.json`,
  docsData: `${__dirname}/populate-docs-data/data.json`,
  rambdaxDocsData: `${__dirname}/populate-docs-data/data-rambdax.json`,
  docsFile: resolve(__dirname, '../../rambda-docs/assets/data.json'),
  rambdaxDocsFile: resolve(
    __dirname,
    '../../rambda-docs/assets/data-rambdax.json'
  ),
}

export const SOURCES = {
  changelog: `${__dirname}/populate-readme-data/assets/CHANGELOG.md`,
  rambdaxChangelog: `${__dirname}/populate-readme-data/assets/CHANGELOG_RAMBDAX.md`,
}

export const MODES = [
  'usedby',
  'readonly',
  'populate:docs',
  'populate:readme',
  'ramda:specs',
]

export const WITH_RAMBDAX = process.env.WITH_RAMBDAX === 'ON'
export const NPM_README = process.env.NPM_README === 'ON'

export const HAS_RAMBDAX = existsSync(
  resolve(__dirname, '../../rambdax/package.json')
)

export const GITHUB_README_LIMIT = 0.5

export const BLACKLIST_METHODS = [
  'compose',
  'converge',
  'curry',
  'clamp',
  'and',
  'type',
  'or',
  'concat',
  'complement',
  'clone',
  'cond',
  'curryN',
  'dec',
  'dec',
  'dissoc',
  'divide',
  'dropLastWhile',
  'dropRepeatsWith',
  'dropWhile',
  'eqProps',
  'filterIndexed',
  'findAsync',
  'flip',
  'forEachIndexed',
  'fromPairs',
  'groupBy',
  'groupWith',
  'identical',
  'inc',
  'indexBy',
  'indexOf',
  'intersection',
  'intersperse',
  'is',
  'mapIndexed',
  'mapObjIndexed',
  'mathMod',
  'max',
  'maxBy',
  'min',
  'minBy',
  'modulo',
  'move',
  'multiply',
  'negate',
  'objOf',
  'partitionIndexed',
  'pipe',
  'rejectIndexed',
  'subtract',
  'takeWhile',
  'tryCatch',
  'tryCatchAsync',
  'xnor',
]
