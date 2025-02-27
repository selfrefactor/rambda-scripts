import {anyFalse, mapToObject, match, remove} from 'rambdax'

import {extractName} from './extract-name'
import {extractRawInfo} from './extract-raw-info'

export function extractExample() {
  const rawInfo = extractRawInfo()

  return mapToObject<string, any>(x => {
    const name = extractName(x)
    const [matched] = match(/Example:(\n|.)+Categories:/m)(x)
    if (anyFalse(matched, name)) return false

    const exampleRaw = remove(['Categories:', 'Example:'])(matched)
    const example = remove(/```/g, exampleRaw)

    return {[name]: example.trim()}
  }, rawInfo)
}
