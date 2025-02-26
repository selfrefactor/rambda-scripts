import {existsSync, readFile} from 'fs-extra'
import {mapToObjectAsync} from 'rambdax'
import {PATHS} from '../../constants'
import {getMethods} from '../extract-from-typings/get-methods'

export async function rambdaSource() {
  const result = await mapToObjectAsync(async (method: string) => {
    const filePath = `${PATHS.source}/${method}.js`
    if (!existsSync(filePath)) return false
    const rambdaSpec = await readFile(filePath)

    return {[method]: rambdaSpec.toString().trim()}
  }, getMethods())

  return result as Record<string, string>
}
