import {anyFalse, mapToObject, match, remove, trim} from 'rambdax'

import {extractName} from './extract-name'
import {extractRawInfo} from './extract-raw-info'

export function extractCategories() {
  const rawInfo = extractRawInfo()

  return mapToObject<string, any>(x => {
    const name = extractName(x)
    const [matched] = match(/Categories:(\n|.)+Notes:/m)(x)
    if (anyFalse(matched, name)) return false

    const categories = remove(['Categories:', 'Notes:'])(matched)

    if (!categories) return false

    return {[name]: categories.split(',').map(trim)}
  }, rawInfo)
}
