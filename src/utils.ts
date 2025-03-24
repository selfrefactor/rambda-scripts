import {readFileSync} from 'fs'
import {readJson} from 'fs-extra'
import {spawn} from 'helpers-fn'
import {resolve} from 'path'
import {PATHS} from './constants'

export const sortFn = (a: any, b: any) => {
  if (a === b) return 0
  return a < b ? -1 : 1
}

export function getSeparator(label: string) {
  return `[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-${label})`
}

export function getMethodSeparator(label: string) {
  return `[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#${label})`
}

export async function getRambdaData() {
  const rambdaData = await readJson(
    `${__dirname}/populate-docs-data/data.json`
  )

  return rambdaData
}


export async function getRambdaMethods() {
  const rambdaData = await getRambdaData()

  return Object.keys(rambdaData).sort(sortFn)
}

export const documentationFile = readFileSync(
  PATHS.documentationFile
).toString()

export const [intro] = documentationFile.split('// API_MARKER')

export const getOrigin = () => documentationFile

export async function build() {
  await spawn({
    cwd: resolve(__dirname, '../'),
    command: 'yarn',
    inputs: ['out'],
  })
  await spawn({
    cwd: resolve(__dirname, '../'),
    command: 'yarn',
    inputs: ['build'],
  })
}
