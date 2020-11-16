import {copy, readFile, remove, writeFile} from 'fs-extra'
import {log, scanFolder, spawn} from 'helpers-fn'
import {mapFastAsync, replace} from 'rambdax'
import {ALL_PATHS, HAS_RAMBDAX} from '../constants'

async function copyToRambdax() {
  const source = ALL_PATHS.toolbeltDestination
  const destination = ALL_PATHS.rambdaxToolbeltDestination

  await copy(source, destination, {overwrite: true})
  log('Applied to Rambdax','info')
}

async function fixWrongExports(files: string[]) {
  await mapFastAsync(async filePath => {
    const content = (await readFile(filePath)).toString()

    const newContent = content
      .split('\n')
      .map(singleLine => {
        if (singleLine.includes('*')) return singleLine

        return replace(/export\s/g, 'export type ', singleLine)
      })
      .join('\n')

    await writeFile(filePath, newContent)
  }, files)
}

export async function dynamicTsToolbelt(commitHash?: string) {
  const destinationDir = `${ALL_PATHS.toolbeltDestination}/src`

  await remove(`${__dirname}/ts-toolbelt`)
  await remove(destinationDir)

  log('start clone', 'info')

  const cloneArgs = commitHash
    ? ['clone', 'https://github.com/pirix-gh/ts-toolbelt']
    : ['clone', 'https://github.com/pirix-gh/ts-toolbelt', '--depth', '1']
  await spawn({
    cwd: __dirname,
    command: 'git',
    inputs: cloneArgs,
  })
  log('end clone', 'info')
  if (commitHash) {
    await spawn({
      cwd: `${__dirname}/ts-toolbelt`,
      command: 'git',
      inputs: ['reset', '--hard', commitHash],
    })
  }
  const sourceDir = `${__dirname}/ts-toolbelt/src`
  await copy(sourceDir, destinationDir)

  const filesWithWrongExports = await scanFolder({
    folder: destinationDir,
    filterFn: x => x.endsWith('_api.ts'),
  })

  await fixWrongExports(filesWithWrongExports)
  if (HAS_RAMBDAX) await copyToRambdax()

  await remove(`${__dirname}/ts-toolbelt`)
  log('done', 'success')
}
