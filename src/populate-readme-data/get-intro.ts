import {readFile, readJson} from 'fs-extra'
import {interpolate} from 'rambdax'
import {PATHS, BULLET} from '../constants'
import {getSeparator} from '../utils'

function getInstallInfo() {
  const installInfoTemplate = `## ${BULLET} Install

- **yarn add {{lib}}**

- For UMD usage either use \`./dist/{{lib}}.umd.js\` or the following CDN link:

\`\`\`
https://unpkg.com/{{lib}}@CURRENT_VERSION/dist/{{lib}}.umd.js
\`\`\`

- with deno

\`\`\`
import {add} from "https://deno.land/x/rambda/mod.ts";
\`\`\`

{{separator}}
`

  return interpolate(installInfoTemplate, {
    lib: 'rambda',
    separator: getSeparator('install'),
  })
}

const templateIntro = `
{{intro}}
{{installInfo}}
{{introEnd}}

## Benchmarks
TODO
`
async function getIntroBaseContent(
  advantages: string
) {
  const filePath = `${__dirname}/assets/INTRO.md`

  const template = (await readFile(filePath)).toString()
  const content = interpolate(template, {
    bullet: BULLET,
    advantages,
  })

  return content
}

async function getIntroContent() {
  const advantagesFilePath = `${__dirname}/assets/ADVANTAGES.md`

  const advantages = (await readFile(advantagesFilePath)).toString()
  const content = await getIntroBaseContent(advantages)

  return interpolate(content, {
    advantages,
  })
}

async function getIntroEnd() {
  return	(
    await readFile(`${__dirname}/assets/INTRO_END.md`)
  ).toString()
}

export async function getIntro() {
  const introContent = await getIntroContent()
  const introEndContent = await getIntroEnd()
  const installInfo = getInstallInfo()
  const {devDependencies} = await readJson(`${PATHS.base}/package.json`)

  return interpolate(templateIntro, {
    benchmarksSeparator: getSeparator('benchmarks'),
    usedBySeparator: getSeparator('used-by'),
    introEnd: introEndContent,
    installInfo,
    intro: introContent.toString(),
    lodashVersion: devDependencies.lodash,
    ramdaVersion: devDependencies.ramda,
  })
}
