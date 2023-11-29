import {outputFile} from 'fs-extra'
import {map, trim} from 'rambdax'
import {PATHS, X_PATHS} from '../constants'

import {getRambdaData, getRambdaxData, intro} from '../utils'

function attachExports({
  methodName,
  allTypings,
}: {
  methodName: string
  allTypings: string
}) {
  return allTypings
    .split('\n')
    .map(line =>
      line.startsWith(methodName) ? `export function ${line}` : line
    )
    .join('\n')
}

export async function createExportedTypings(withRambdax = false) {
  let toSave = intro

  const applyForSingleMethod = (x: any, methodName: string) => {
    const allTypings = attachExports({
      methodName,
      allTypings: x.allTypings,
    })

    if (!x.explanation) {
      return (toSave += `\n${allTypings}\n`)
    }

    const explanation = x.explanation
      .split('\n')
      .map(trim)
      .map((a: string) => ` * ${a}`)
      .join('\n')

    const methodData = `/**\n${explanation}\n */\n${allTypings}`

    return (toSave += `\n${methodData}\n`)
  }

  const methodsData = withRambdax
    ? await getRambdaxData()
    : await getRambdaData()

  map(applyForSingleMethod, methodsData)

  const output = withRambdax
    ? `${X_PATHS.xBase}/index.d.ts`
    : `${PATHS.base}/index.d.ts`

  await outputFile(output, toSave)

  return toSave
}
