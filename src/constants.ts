import {existsSync} from 'fs'
import {resolve} from 'path'

const base = resolve(__dirname, '../../rambda')
const xBase = resolve(__dirname, '../../rambdax')

export const BULLET = '❯' // ➤

export const PATHS = {
  base,
  documentationFile: `${base}/files/index.d.ts`,
  source: `${base}/source`,
  output: `${base}/src`,
  sourceDestination: `${base}/src`,
}

export const X_PATHS = {
  xBase,
  rambdaxDir: xBase,
}

export const DESTINATIONS = {
  changelog: `${base}/CHANGELOG.md`,
  rambdaxChangelog: `${xBase}/CHANGELOG.md`,
  dataSource: `${__dirname}/populate-docs-data/data.json`,
  rambdaxDataSource: `${__dirname}/populate-docs-data/data-rambdax.json`,
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

export const EXAMPLE_ONLY_METHODS: string[] = [
]

let newMethodsToSkip = [
	'memoize',
  'negate',
  'nAry',
  'multiply',
  'move',
  'modulo',
  'modifyPath',
  'min',
  'max',
  // temps
  'composeWith',
  'binary',
  'call',
  'dec',
  'dropRepeatsBy',
  'empty',
  'gt',
  'gte',
  'inc',
  'lensPath',
  'innerJoin',
  'reduceBy',
  'sortWith',
  'insert',
  'insertAll',
  'lt',
  'lte',
  'isNotNil',
  'pickBy',
  'pathSatisfies',
  'swap',
  'mergeDeepLeft',
  'gt',
  'gte',
  // move above to EXAMPLE_ONLY_METHODS
  'collectBy',
  'addIndex',
  'addIndexRight',
  'applyTo',
  'ascend',
  'binary',
  'call',
  'collectBy',
  'comparator',
  'composeWith',
  'default',
  'descend',
  'dissocPath',
  'dropRepeatsBy',
  'empty',
  'eqBy',
  'forEachObjIndexed',
  'hasIn',
  'insert',
  'insertAll',
  'into',
  'into',
  'invert',
  'invertObj',
  'invoker',
  'isNotNil',
  'keysIn',
  'keysIn',
  'lift',
  'liftN',
  'lt',
  'lte',
  'mapAccum',
  'mapAccumRight',
  'memoizeWith',
  'mergeDeepLeft',
  'mergeDeepWith',
  'mergeDeepWithKey',
  'mergeWithKey',
  'nAry',
  'nthArg',
  'otherwise',
  'pair',
  'partialRight',
  'pipeWith',
  'project',
  'promap',
  'reduceBy',
  'reduceRight',
  'reduceWhile',
  'reduced',
  'remove',
  'scan',
  'sequence',
  'splitWhenever',
  'symmetricDifferenceWith',
  'thunkify',
  'toPairsIn',
  'transduce',
  'traverse',
  'unary',
  'uncurryN',
  'unfold',
  'unionWith',
  'until',
  'useWith',
  'valuesIn',
  'xprod',
]
export const METHODS_TO_SKIP = [
  ...newMethodsToSkip,
  'add',
  'always',
  'assoc',
  'and',
  'clamp',
  'clone',
  'complement',
  'compose',
  'composeAsync',
  'pipeAsync',
  'pipedAsync',
  'concat',
  'cond',
  'converge',
  'count',
  'curry',
  'curryN',
  'dec',
  'dissoc',
  'divide',
  'dropLastWhile',
  'dropRepeatsWith',
  'dropWhile',
  'eqProps',
  'excludes',
  'flip',
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
  'mathMod',
  'max',
  'maxBy',
  'merge',
  'mergeRight',
  'min',
  'minBy',
  'modulo',
  'move',
  'multiply',
  'negate',
  'objOf',
  'on',
  'or',
  'pipe',
  'reduce',
  'subtract',
  'takeWhile',
  'tryCatch',
  'type',
  'uniqBy',
  'unnest',
  'unwind',
  'whereAny',
]

export const METHODS_TO_SKIP_RAMBDAX = [
  ...METHODS_TO_SKIP,
  'filterIndexed',
  'findAsync',
  'flattenObject',
  'forEachIndexed',
  'mapIndexed',
  'mapObjIndexed',
  'mapcat',
  'partitionIndexed',
  'rejectIndexed',
  'tryCatchAsync',
]
