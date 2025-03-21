import {
  copy,
  outputFile,
  outputJson,
  readJson,
  remove as removeFS,
} from 'fs-extra'
import {scanFolder} from 'helpers-fn'
import {parse} from 'path'
import {filter, mapAsync, pipedAsync, remove} from 'rambdax'
import {PATHS, SOURCES} from '../constants'
import {getRambdaMethods, sortFn} from '../utils'
import {createExportedTypings} from './create-exported-typings'

// Rambdax methods which are used in creation of Rambda methods
// ============================================
const rambdaxMethodsAsInternals = ['isFunction', 'isPromise', 'maybe']

const denoComment = '/// <reference types="./index.d.ts" />'

async function createMainFile(allMethods: string[]) {
  allMethods.sort(sortFn)

  const content = allMethods
    .map((x: string) => `export * from './src/${x}.js'`)
    .join('\n')

  await outputFile(`${PATHS.base}/rambda.js`, `${denoComment}\n${content}\n`)
}

async function rambdaBuildStep() {
  const rambdaMethods = await getRambdaMethods()
  const sourceFileDir = PATHS.source
  const output = PATHS.output
  await removeFS(output)

  const files = await scanFolder({folder: sourceFileDir})

  await pipedAsync(
    files,
    filter((x: any) => {
      if (x.endsWith('.spec.js')) return false
      if (x.endsWith('/testUtils.js')) return false

      return x.endsWith('.js')
    }),
    mapAsync(async (x: any) => {
      const {name} = parse(x)

      const shouldSkip =
        x.includes('benchmarks') ||
        (!rambdaMethods.includes(name) &&
          !rambdaxMethodsAsInternals.includes(name))

      if (shouldSkip && !x.includes('internals')) return

      const [, fileName] = x.split('source/')
      await copy(x, `${output}/${fileName}`)

      return x.includes('internals') ? undefined : remove('.js', fileName)
    }),
    filter(Boolean),
    filter((x: any) => !rambdaxMethodsAsInternals.includes(x)),
    async allMethods => {
      await createMainFile(allMethods)
    }
  )
}

export async function buildStep() {
  await createExportedTypings()

	await rambdaBuildStep()
}
