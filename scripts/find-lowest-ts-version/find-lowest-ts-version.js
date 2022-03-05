import {exec} from 'helpers-fn'
import {mapAsync} from 'rambdax'
import path from 'path'
import {fileURLToPath} from 'url'
import fse from 'fs-extra'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const VERSIONS = [
  '3.9.4',
  '4.1.6',
  '4.3.3',
  '4.3.4',
  '4.3.5',
  '4.4.2',
  '4.4.3',
  '4.4.4',
  '4.5.2',
  '4.5.3',
  '4.5.4',
  '4.6.2',
]

async function checkVersion(versionToCheck) {
  const packageJsonDir = path.resolve(__dirname, '../consume-typings')
  const packageJsonFilePath = `${packageJsonDir}/package.json`
  const packageJson = await fse.readJson(packageJsonFilePath)
  const newPackageJson = {
    ...packageJson,
    dependencies: {
      rambda: 'file:./../../../rambda/',
      typescript: versionToCheck,
    },
  }
  await fse.outputJson(packageJsonFilePath, newPackageJson, {spaces: 2})
  const resultLogs = await exec({
    command: 'yarn start',
    cwd: packageJsonDir,
  })
  const errors = resultLogs.filter(line => line.includes(': error'))
  console.log(`errors`, errors)

  return errors.length === 0
}

void (async function findLowestTsVersion() {
  const finalResult = await mapAsync(async versionToCheck => {
    const result = await checkVersion(versionToCheck)
    return {result, versionToCheck}
  }, VERSIONS)

  console.log(`finalResult`, finalResult)
})()
