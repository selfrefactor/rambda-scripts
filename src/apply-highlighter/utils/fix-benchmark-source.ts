import {piped, remove, trim} from 'rambdax'

export function fixBenchmarkSource(input: string): string {
  return piped(
    input,
    remove([
      `const R = require('../../dist/rambda.js')`,
      `const R = require('../../dist/rambda.js');`,
    ]),
    trim
  )
}
