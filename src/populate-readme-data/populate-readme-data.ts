import { outputFile, readJson } from 'fs-extra'
import { interpolate, map, replace } from 'rambdax'

import { buildStep } from '../build-step/build-step'
import { createMethodData } from './create-method-data'
import { getIntro } from './get-intro'
import { getTail } from './get-tail'
import { rambdaRepl } from './rambda-repl'
import { ALL_PATHS, DESTINATIONS } from '../constants'

async function getMethodsData(withRambdax: boolean){
  const filePath = withRambdax ? DESTINATIONS.rambdaxDocsData : DESTINATIONS.docsData

  return readJson(filePath)
}

const removeDoubleNewLines = replace(/\n{3,5}/g, '\n\n')

const readmeTemplate = `
{{intro}}

## API

{{methods}}

{{tail}}
`

function getOutputPath(withRambdax: boolean){
  if (withRambdax){
    return `${ ALL_PATHS.xBase }/README.md`
  }

  return `${ ALL_PATHS.base }/README.md`
}

export async function populateReadmeData(withRambdax: boolean){
  console.log({withRambdax})
  await buildStep(withRambdax)

  const methodsData = await getMethodsData(withRambdax)

  const methods = map((x: any) => {
    if (!x.example) return x
    const replLink = rambdaRepl(x.example)

    return {
      ...x,
      replLink,
    }
  }, methodsData)

  const sortedMethods = Object.keys(methods)
    .map((key: string) => ({
      ...methods[ key ],
      methodName : key,
    }))
    .sort((x, y) =>
      x.methodName.toLowerCase() > y.methodName.toLowerCase() ? 1 : -1)
    .map(method => createMethodData(method, withRambdax))

  const intro = await getIntro(withRambdax)
  const tail = await getTail(withRambdax)
  const templateData = {
    intro,
    tail,
    methods : sortedMethods.join('\n\n'),
  }

  const readme = interpolate(readmeTemplate, templateData).trim()
  const output = getOutputPath(withRambdax)

  const finalReadme = removeDoubleNewLines(readme)
  await outputFile(output, finalReadme)

  return finalReadme
}
