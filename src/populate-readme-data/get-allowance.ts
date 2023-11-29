import {BLACKLIST_METHODS, BLACKLIST_METHODS_RAMBDAX} from '../constants'

interface Allowance {
  typing: boolean
  example: boolean
  allTypings: boolean
  source: boolean
  specs: boolean
  tsTest: boolean
  benchmark: boolean
}

export function getAllowance(
  methodName: string,
  withRambdax: boolean
): Allowance {
  if (withRambdax) {
    const allowed = !BLACKLIST_METHODS_RAMBDAX.includes(methodName)
    return {
      typing: allowed,
      example: allowed,
      allTypings: false,
      source: allowed,
      specs: allowed,
      tsTest: false,
      benchmark: false,
    }
  }
  const allowed = !BLACKLIST_METHODS.includes(methodName)
  return {
    typing: allowed,
    example: allowed,
    allTypings: allowed,
    source: allowed,
    specs: allowed,
    tsTest: allowed,
    benchmark: false,
  }
}
