import {outputJsonSync} from 'fs-extra'

let path = `${__dirname}/debug.json`

export function debug(input: any) {
  outputJsonSync(path, {input}, {spaces: 2})
}

export function debugExit(input: any) {
  debug(input)
  process.exit(0)
}
