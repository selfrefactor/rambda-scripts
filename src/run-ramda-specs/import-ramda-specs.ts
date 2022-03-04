import {outputFile, readFile} from 'fs-extra'
import {execSafe, scanFolder, spawn} from 'helpers-fn'
import {parse} from 'path'
import {mapAsync, replace} from 'rambdax'

import {getRambdaMethods} from '../utils'

const cloneCommandInputs =
  'clone --depth 1 https://github.com/ramda/ramda'.split(' ')

async function cloneRamda() {
  await execSafe({
    command: 'rm -rf ramda',
    cwd: __dirname,
  })

  await spawn({
    cwd: __dirname,
    command: 'git',
    inputs: cloneCommandInputs,
  })

  await spawn({
    cwd: `${__dirname}/ramda`,
    command: 'npm',
    inputs: ['i'],
  })
}

export async function replaceImports() {
  const rambdaMethods = await getRambdaMethods()

  // Because Ramda pattern for spec name has exception
  // ============================================
  const toReturn = ['lenses']

  const allFiles = await scanFolder({folder: `${__dirname}/ramda/test`})
  const goodFiles = allFiles.filter(filePath => {
    if (!filePath.endsWith('.js')) return false

    // Because Ramda pattern for spec name has exception
    // ============================================
    if (filePath.endsWith('lenses.js')) return true
    const {name} = parse(filePath)
    toReturn.push(name)

    return rambdaMethods.includes(name)
  })

  const replaceImport = async function(filePath: string) {
    const content = await readFile(filePath)
    const newContent = replace(
      "require('../source/index.js')",
      "require('../../../../../rambda/dist/rambda')",
      content.toString()
    )

    await outputFile(filePath, newContent)
  }

  await mapAsync(replaceImport, goodFiles)

  return toReturn
}

export async function importRamdaSpecs(withInitialStep: boolean) {
  if (withInitialStep) await cloneRamda()

  return replaceImports()
}
