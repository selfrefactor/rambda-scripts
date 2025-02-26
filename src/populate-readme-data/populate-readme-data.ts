import {statSync} from 'fs'
import {outputFile, readJson} from 'fs-extra'
import {log} from 'helpers-fn'
import {interpolate, map, replace} from 'rambdax'
import {buildStep} from '../build-step/build-step'
import {createMethodData} from './create-method-data'
import {getIntro} from './get-intro'
import {getTail} from './get-tail'
import {rambdaRepl} from './rambda-repl'
import {
  PATHS,
  X_PATHS,
  DESTINATIONS,
  GITHUB_README_LIMIT,
	docsifyBase,
} from '../constants'

function getFileSize(filePath: string) {
  const stats = statSync(filePath)
  const fileSizeInBytes = stats.size
  const fileSizeInMegabytes = fileSizeInBytes / 1000000
  log(`Size - ${fileSizeInMegabytes}MB`, 'foo')

  if (GITHUB_README_LIMIT < fileSizeInMegabytes) {
    throw new Error(`Github has a limit for README.md`)
  }
}

async function getMethodsData() {
  const filePath = DESTINATIONS.dataSource

  return readJson(filePath)
}

const removeDoubleNewLines = replace(/\n{3,5}/g, '\n\n')

const readmeTemplate = `
{{intro}}

## API

{{methods}}

{{tail}}
`

function getOutputPath(npmReadme: boolean, docsifyMode: boolean) {
	if (docsifyMode) {
		return `${docsifyBase}/README.md`
	}

  return npmReadme
    ? `${PATHS.base}/README.md`
    : `${PATHS.base}/.github/README.md`
}

export async function populateReadmeData(
  npmReadme: boolean,
	docsifyMode: boolean
) {
  await buildStep()
  const methodsData = await getMethodsData()

  const methods = map((x: any, y: string) => {
    if (!x.example) return x
    const replLink = rambdaRepl(x.example, y)

    return {
      ...x,
      replLink,
    }
  }, methodsData)

  const sortedMethods = Object.keys(methods)
    .map((key: string) => ({
      ...methods[key],
      methodName: key,
    }))
    .sort((x, y) =>
      x.methodName.toLowerCase() > y.methodName.toLowerCase() ? 1 : -1
    )
    .map(method => createMethodData(method, npmReadme, docsifyMode))

  const intro = await getIntro()
  const tail = await getTail()
  const templateData = {
    intro,
    tail,
    methods: sortedMethods.join('\n\n'),
  }

  const readme = interpolate(readmeTemplate, templateData).trim()
  const output = getOutputPath(npmReadme, docsifyMode)
	console.log('output', output)
  const finalReadme = removeDoubleNewLines(readme)
  await outputFile(output, finalReadme)
	if(!docsifyMode){
		getFileSize(output)
	}
  return finalReadme
}
