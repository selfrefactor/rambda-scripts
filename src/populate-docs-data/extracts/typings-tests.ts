import {existsSync, readFile} from 'fs-extra'
import {remove, mapToObjectAsync} from 'rambdax'
import { PATHS } from '../../constants'

import {getMethods} from '../extract-from-typings/get-methods'

export async function typingsTests(withRambdax: boolean) {
  const result = await mapToObjectAsync(async method => {
    const filePath = `${PATHS.source}/${ method }-spec.ts`
    if (!existsSync(filePath)) return false
    const rambdaSpec = await readFile(filePath)

    return {[method]: remove(/readonly\s/g, rambdaSpec.toString().trim())}
  }, getMethods(withRambdax))

  return result as Record<string, string>
}
