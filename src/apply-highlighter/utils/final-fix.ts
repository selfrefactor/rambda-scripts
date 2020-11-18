import {omit, path} from 'rambdax'
import {indentRight} from "./indent-right"

export function finalFix(x: any): object {
  if (!x.explanation) return x
  const newExplanation = indentRight(x.explanation)
  return {
    ...x,
    explanation: newExplanation
  }
}
