import { METHODS_TO_SKIP} from '../constants'

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
	docsifyMode: boolean
): Allowance {
	const allowed = docsifyMode ? true : !METHODS_TO_SKIP.includes(methodName)

  return {
    typing: allowed,
    example: true,
    allTypings: allowed,
    source: allowed,
    specs: allowed,
    tsTest: allowed,
    benchmark: false,
  }
}
