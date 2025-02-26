import {head, init, mapToObject, match, piped, remove, trim} from 'rambdax'

import {getOrigin} from '../../utils'

export function extractAllDefinitions() {
  const matches = match(
    /\/\/\s@SINGLE_MARKER\nexport\sfunction.([^*])+/gm,
    getOrigin()
  ).map(init)

  const result = mapToObject<string, Record<string, string>>(singleMatch => {
    const allTypings = piped(singleMatch, remove('// @SINGLE_MARKER'), trim)

    const name = piped(
      allTypings,
      match(/export function [a-zA-Z]+/),
      head as any,
      trim,
      remove('export function ')
    )

    const methodTypings = remove(/export\sfunction\s/g, allTypings)

    /*
      needed in relation to `rambda-docs` repl
      const methodTypings = remove(/export\s/g, allTypings)
    */

    return {[name]: methodTypings}
  }, matches)

  return result
}
