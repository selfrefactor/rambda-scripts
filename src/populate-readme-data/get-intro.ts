import { readFile, readJson } from 'fs-extra'
import { resolve } from 'path'
import { interpolate } from 'rambdax'
import { PATHS, BULLET } from '../constants'
import { getSeparator } from '../utils'

function getInstallInfo(withRambdax: boolean) {
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
    lib: withRambdax ? 'rambdax' : 'rambda',
    separator: getSeparator('install'),
  })
}

async function getMissingMethods() {
  const missingMethodsTemplate = `
## ${BULLET} Missing Ramda methods

<details>
<summary>
  Click to see the full list of {{counter}} Ramda methods not implemented in Rambda and their status.
</summary>

{{missingMethods}}
</details>

{{separator}}
  `

  let counter = 0
  const missingMethods = `
- gt
- gte
- hasIn
- innerJoin
- insert
- insertAll
- into
- invert
- invertObj
- invoker
- isNotNil
- keysIn
- lift
- liftN
- lt
- lte
- mapAccum
- mapAccumRight
- memoizeWith
- mergeDeepLeft
- mergeDeepWith
- mergeDeepWithKey
- mergeWithKey
- nAry
- nthArg
- o
- otherwise
- pair
- partialRight
- pathSatisfies
- pickBy
- pipeWith
- project
- promap
- reduceBy
- reduceRight
- reduceWhile
- reduced
- remove
- scan
- sequence
- sortWith
- splitWhenever
- swap
- symmetricDifferenceWith
- andThen
- toPairsIn
- unary
- uncurryN
- unfold
- unionWith
- until
- useWith
- valuesIn
- xprod
- thunkify
- default

  Most of above methods are in progress to be added to **Rambda**. The following methods are not going to be added:
- __ - placeholder method allows user to further customize the method call. While, it seems useful initially, the price is too high in terms of complexity for TypeScript definitions. If it is not easy exressable in TypeScript, it is not worth it as **Rambda** is a TypeScript first library.
- construct - Using classes is not very functional programming oriented.
- constructN - same as above
- transduce - currently is out of focus
- traverse - same as above
`.trim()

  return interpolate(missingMethodsTemplate, {
    missingMethods,
    counter,
    separator: getSeparator('missing-ramda-methods'),
  })
}

const templateIntro = `
{{intro}}
{{missingMethods}}
{{installInfo}}
{{introEnd}}

## ${BULLET} Benchmarks

<details>

<summary>
Click to expand all benchmark results

There are methods which are benchmarked only with \`Ramda\` and \`Rambda\`(i.e. no \`Lodash\`).

Note that some of these methods, are called with and without curring. This is done in order to give more detailed performance feedback.

The benchmarks results are produced from latest versions of *Rambda*, *Lodash*({{lodashVersion}}) and *Ramda*({{ramdaVersion}}).

</summary>

method | Rambda | Ramda | Lodash
--- |--- | --- | ---
{{summary}}

</details>

{{benchmarksSeparator}}

## ${BULLET} Used by

{{usedBy}}

{{usedBySeparator}}
`
async function getIntroBaseContent(
  withRambdax: boolean,
  advantages: string,
) {
  const filePath = withRambdax
    ? `${__dirname}/assets/INTRO_RAMBDAX.md`
    : `${__dirname}/assets/INTRO.md`

  const template = (await readFile(filePath)).toString()
  const content = interpolate(template, {
    bullet: BULLET,
    advantages,
  })

  return content
}
const MIN_TS_VERSION = '4.3.3'
const typescriptInfoTemplate = `
Important - {{library}} version \`{{version}}\`(or higher) requires TypeScript version \`${MIN_TS_VERSION}\`(or higher).
`

async function getIntroContent(withRambdax: boolean) {
  const advantagesFilePath = withRambdax
    ? `${__dirname}/assets/ADVANTAGES_RAMBDAX.md`
    : `${__dirname}/assets/ADVANTAGES.md`

  const typescriptInfo = interpolate(typescriptInfoTemplate, {
    version: withRambdax ? '9.0.0' : `7.1.0`,
    library: withRambdax ? 'Rambdax' : 'Rambda',
  })

  const advantagesTemplate = (
    await readFile(advantagesFilePath)
  ).toString()

  const advantages = interpolate(advantagesTemplate, {
    rambdaTypeScriptInfo: typescriptInfo,
  })
  const content = await getIntroBaseContent(withRambdax, advantages)

  return interpolate(content, {
    advantages,
  })
}

async function getIntroEnd(withRambdax: boolean) {
  const introEndContent = (
    await readFile(`${__dirname}/assets/INTRO_END.md`)
  ).toString()
  const suggestPR = `
> If you need more **Ramda** methods in **Rambda**, you may either submit a \`PR\` or check the extended version of **Rambda** - [Rambdax](https://github.com/selfrefactor/rambdax). In case of the former, you may want to consult with [Rambda contribution guidelines.](CONTRIBUTING.md)
`.trim()

  return interpolate(introEndContent, {
    suggestPR: withRambdax ? '\n' : '\n' + suggestPR + '\n',
  })
}

export async function getIntro(withRambdax: boolean) {
  const introContent = await getIntroContent(withRambdax)
  const usedByContent = await readFile(
    `${__dirname}/assets/USED_BY.md`,
  )
  const summaryContent = await readFile(
    resolve(__dirname, '../read-benchmarks/summary.txt'),
  )
  const introEndContent = await getIntroEnd(withRambdax)
  const missingMethods = await getMissingMethods()
  const installInfo = getInstallInfo(withRambdax)
  const { devDependencies } = await readJson(
    `${PATHS.base}/package.json`,
  )

  return interpolate(templateIntro, {
    benchmarksSeparator: getSeparator('benchmarks'),
    usedBySeparator: getSeparator('used-by'),
    introEnd: introEndContent,
    missingMethods,
    installInfo,
    intro: introContent.toString(),
    summary: summaryContent.toString(),
    usedBy: usedByContent.toString(),
    lodashVersion: devDependencies.lodash,
    ramdaVersion: devDependencies.ramda,
  })
}
