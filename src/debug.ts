import { outputJsonSync} from 'fs-extra'

let pathx = `${__dirname}/debug.json`

export function debugExit(input: any) {
 outputJsonSync(pathx, {input}, {spaces: 2})
 process.exit()
}