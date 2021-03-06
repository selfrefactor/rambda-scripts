import {
  copy,
  outputFile,
  outputJson,
  readJson,
  remove as removeFS,
} from 'fs-extra'
import {scanFolder} from 'helpers-fn'
import {parse} from 'path'
import {filter, mapAsync, pick, pipedAsync, remove} from 'rambdax'
import {PATHS, X_PATHS, SOURCES} from '../constants'
import {getRambdaMethods} from '../utils'
import {createExportedTypings} from './create-exported-typings'

// Rambdax methods which are used in creation of Rambda methods
// ============================================
const rambdaxMethodsAsInternals = ['isFunction', 'isPromise', 'maybe']

async function createMainFile(
  allMethods: string[]
) {
  const content = allMethods
    .map((x: string) => `export * from './src/${x}'`)
    .join('\n')

  await outputFile(`${PATHS.base}/rambda.js`, `${content}\n`)
}

async function createMainFileRambdax({
  allMethods,
  rambdaMethods,
  dir,
}: {
  rambdaMethods: string[],
  allMethods: string[],
  dir: string,
}) {
  const content = [...allMethods, ...rambdaMethods]
    .map(x => `export * from './src/${x}'`)
    .join('\n')

  await outputFile(`${dir}/rambdax.js`, `${content}\n`)
}

async function rambdaxBuildStep() {
  const rambdaxOutput = `${X_PATHS.xBase}/src`
  await removeFS(rambdaxOutput)

  const rambdaMethods = await getRambdaMethods()
  const buildDeps = [
    '@babel/core',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/preset-env',
    '@rollup/plugin-babel',
    '@rollup/plugin-commonjs',
    '@rollup/plugin-json',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-replace',
    'rollup',
    'rollup-plugin-uglify',
    'rollup-plugin-cleanup',
    'rollup-plugin-sourcemaps',
  ]

  const {devDependencies} = await readJson(`${PATHS.base}/package.json`)
  const rambdaxDeps = pick(buildDeps, devDependencies)
  const sourceFileDir = PATHS.source
  const packageJsonOutput = `${X_PATHS.xBase}/package.json`
  const packageJson = await readJson(packageJsonOutput)
  const newPackageJson = {
    ...packageJson,
    devDependencies: rambdaxDeps,
  }

  await outputJson(packageJsonOutput, newPackageJson, {spaces: 2})

  const allMethods: string[] = []

  const files = await scanFolder({folder: sourceFileDir})

  await pipedAsync(
    files,
    filter((x: any) => {
      if (x.endsWith('/testUtils.js')) return false
      if (x.endsWith('.spec.js')) return false
      if (x.includes('benchmark')) return false

      return x.endsWith('.js')
    }),
    mapAsync(async(x: any) => {
      const {name} = parse(x)
      const isValidMethod =
        !x.includes('internals') && !rambdaMethods.includes(name)
      if (isValidMethod) allMethods.push(name)

      const [, fileName] = x.split('source/')
      await copy(x, `${X_PATHS.xBase}/src/${fileName}`)
    })
  )

  await createMainFileRambdax({
    allMethods,
    rambdaMethods,
    dir: X_PATHS.xBase,
  })
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
    mapAsync(async(x: any) => {
      const {name} = parse(x)

      const shouldSkip =
        x.includes('benchmarks') ||
        !rambdaMethods.includes(name) &&
          !rambdaxMethodsAsInternals.includes(name)

      if (shouldSkip && !x.includes('internals')) return

      const [, fileName] = x.split('source/')
      await copy(x, `${output}/${fileName}`)

      return x.includes('internals') ? undefined : remove('.js', fileName)
    }),
    filter(Boolean),
    filter((x: any) => !rambdaxMethodsAsInternals.includes(x)),
    async allMethods => {
      await createMainFile(
        allMethods
      )
    }
  )
}

async function syncChangelog(withRambdax: boolean){
  const source = withRambdax ? SOURCES.rambdaxChangelog : SOURCES.changelog
  const destinationBase = withRambdax ? X_PATHS.xBase: PATHS.base

  await copy( 
    source,
    `${destinationBase}/CHANGELOG.md`
  )
}

export async function buildStep(withRambdax: boolean) {
  await createExportedTypings(withRambdax)

  if (withRambdax) await rambdaxBuildStep()
  await rambdaBuildStep()

  await syncChangelog(withRambdax)
}
