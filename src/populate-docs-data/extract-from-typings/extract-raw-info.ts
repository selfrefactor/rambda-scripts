import {match} from 'rambdax'

import {getOrigin} from '../../utils'

export function extractRawInfo() {
  return match(/\/\*(\n|[^@])+/gm, getOrigin())
}
