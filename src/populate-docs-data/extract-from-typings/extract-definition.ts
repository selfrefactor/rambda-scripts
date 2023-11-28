import {head, mapToObject, match, piped, remove, trim,} from 'rambdax'

import {getOrigin} from '../../utils'

export function extractDefinition(withRambdax: boolean) {
  const matches = match(
    /\/\/ @SINGLE_MARKER\nexport function[^;]+/gm,
    getOrigin(withRambdax)
  )
  const result = mapToObject<string, Record<string, string>>(singleMatch => {
    const count = match(/\/\/ @SINGLE_MARKER/gm, singleMatch).length
    if(count !== 1) throw new Error(`Wrong count ${count}`)
    const typing = remove('// @SINGLE_MARKER', singleMatch)

    const name = piped(
      typing,
      match(/export function [a-zA-Z]+/),
      head as any,
      trim,
      remove('export function ')
    )

    return {[name]: remove('export function ', typing)}
  }, matches)

  return result
}
