import {outputFile} from 'fs-extra'
import {map, trim} from 'rambdax'
import {PATHS} from '../constants'

import {getRambdaData, intro} from '../utils'

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

export async function createExportedTypings() {
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

  const methodsData =  await getRambdaData()

  map(applyForSingleMethod, methodsData)

  const output =  `${PATHS.base}/index.d.ts`
  const outputCts =  `${PATHS.base}/index.d.cts`

  await outputFile(output, toSave)
  await outputFile(outputCts, toSave)

  return toSave
}
