import { mapToObject } from 'rambdax'

import allDifferences from '../../run-ramda-specs/all-differences.json'
import { getMethods } from '../extract-from-typings/get-methods'

export function failedTestsCount(){
  return mapToObject<string, Record<string, string>>((method: string) => {
    const explanation = (allDifferences as any)[ method ]
    if (!explanation) return false

    return { [ method ] : explanation.count }
  }, getMethods())
}
