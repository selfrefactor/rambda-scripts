import { outputJsonSync} from 'fs-extra'

let path = `${__dirname}/debug.json`

export function debugExit(input: any) {
  console.log('debugExit', input)
 outputJsonSync(path, {input}, {spaces: 2})
 process.exit(0)
}