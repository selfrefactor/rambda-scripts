import {readFile, readJson} from 'fs-extra'
import {interpolate} from 'rambdax'
import {PATHS, BULLET} from '../constants'

// - **yarn add {{lib}}**

// - For UMD usage either use \`./dist/{{lib}}.umd.js\` or the following CDN link:

// \`\`\`
// https://unpkg.com/{{lib}}@CURRENT_VERSION/dist/{{lib}}.umd.js
// \`\`\`

// - with deno

// \`\`\`
// import {add} from "https://deno.land/x/rambda/mod.ts";
// \`\`\`

// {{separator}}
// `

export async function getIntro() {
  const template = (await readFile(PATHS.introReadme)).toString()
  const content = interpolate(template, {
    bullet: BULLET,
  })

  return content
}

