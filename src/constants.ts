import {resolve} from 'path'

const base = resolve(__dirname, '../../rambda')
export const docsifyBase = resolve(__dirname, '../docsify-readme')

export const BULLET = '❯' // ➤

export const PATHS = {
  base,
  documentationFile: `${base}/files/index.d.ts`,
  introReadme: `${base}/files/README_START.md`,
  source: `${base}/source`,
  output: `${base}/src`,
  sourceDestination: `${base}/src`,
}


export const DESTINATIONS = {
	dataSource: `${__dirname}/populate-docs-data/data.json`,
  rambdaxDataSource: `${__dirname}/populate-docs-data/data-rambdax.json`,
}

export const SOURCES = {
	changelog: `${base}/CHANGELOG.md`,
}

export const MODES = [
  'usedby',
  'readonly',
  'populate:docs',
  'populate:readme',
]
export const DOCSIFY_SCRIPTS_MODE = process.env.DOCSIFY_SCRIPTS_MODE === 'ON'

export const GITHUB_README_LIMIT = 0.5
