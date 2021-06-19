import { replace } from 'rambdax'
import {writeFile, readFile } from 'fs-extra'
import { PATHS } from '../constants'

export async function readonlyTask(){
  const filePath = `${PATHS.base}/index.d.ts`
  const output = `${PATHS.base}/readonly.ts`
  const content = (await readFile(filePath)).toString()
  const withoutReadonly = replace(/readonly\s/g, '', content)
  await writeFile(output, withoutReadonly)
}
