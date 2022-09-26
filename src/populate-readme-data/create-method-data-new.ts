import {interpolate} from 'rambdax'
import {BLACKLIST_METHODS, BLACKLIST_METHODS_RAMBDAX,
  DISABLE_SOURCE,
  DISABLE_SOURCE_RAMBDAX,
  DISABLE_SPEC,
  DISABLE_SPEC_RAMBDAX,
  DISABLE_TS_SPEC,
  DISABLE_TS_SPEC_RAMBDAX,
  DISABLE_TS,
  DISABLE_TS_RAMBDAX
} from '../constants'
import {getMethodSeparator} from '../utils'
import { getAllowance } from './get-allowance'

function createFailedSpec(method: any) {
  const summaryTemplate = `
<details>

<summary>{{failedSpecsCount}} failed <italic>Ramda.{{methodName}}</italic> specs

> :boom: Reason for the failure: {{failedSpecsReasons}}
</summary>

\`\`\`javascript
{{failedRamdaSpecs}}
\`\`\`


</details>
`

  const shortSummaryTemplate = `
*{{failedSpecsCount}} failed Ramda.{{methodName}} specs*

> :boom: Reason for the failure: {{failedSpecsReasons}}
`

  const templateToUse = method.failedRamdaSpecs
    ? summaryTemplate
    : shortSummaryTemplate

  return interpolate(templateToUse, method)
}

function createRambdaSpecReadme(method: any) {
  const summaryTemplate = `
<details>

<summary><strong>Tests</strong></summary>

\`\`\`javascript
{{rambdaSpecs}}
\`\`\`

</details>
`

  return interpolate(summaryTemplate, method)
}

function createRambdaSourceReadme(method: any) {
  const summaryTemplate = `
<details>

<summary><strong>R.{{methodName}}</strong> source</summary>

\`\`\`javascript
{{rambdaSource}}
\`\`\`

</details>
`

  return interpolate(summaryTemplate, method)
}

function createTypescriptTest(method: any) {
  const summaryTemplate = `
<details>

<summary><strong>Typescript</strong> test</summary>

\`\`\`typescript
{{typescriptDefinitionTest}}
\`\`\`

</details>
`

  return interpolate(summaryTemplate, method)
}

function createBenchmarkInfo(method: any) {
  const summaryTemplate = `
<details>

<summary>{{methodSummary}}</summary>

\`\`\`text
{{benchmarkContent}}
\`\`\`

</details>
`

  return interpolate(summaryTemplate, method.benchmarkInfo)
}

function attachAllTypings(method: any) {
  const allTypingsTemplate = `
<details>

<summary>All Typescript definitions</summary>

\`\`\`typescript
{{allTypings}}
\`\`\`

</details>
`

  return interpolate(allTypingsTemplate, method)
}

const createExampleReadme = ({example}: {example: string}) => `
\`\`\`javascript
${example}
\`\`\`
`

const createNoteReadme = ({notes}: {notes: string}) => `

> :boom: ${notes}
`

const attachTyping = ({typing}: {typing: string}) => `
\`\`\`typescript
${typing}
\`\`\`
\n`

const getIntro = ({methodName}: {methodName: string}) => [
  `### ${methodName}`,
  '\n\n',
]

function createReplReadme({
  replLink,
  methodName,
}: {
  replLink: string,
  methodName: string,
}) {
  return `\n<a title="redirect to Rambda Repl site" href="${replLink}">Try this <strong>R.${methodName}</strong> example in Rambda REPL</a>`
}

export function createMethodData(
  method: any,
  withRambdax: boolean,
  npmReadme: boolean
) {
  const data = getIntro(method)
  // const allowance = getAllowance(method.methodName, withRambdax)
  const isRambdaOnly = !withRambdax
  const isAllowed = !BLACKLIST_METHODS_RAMBDAX.includes(method.methodName)
  if (method.typing && isAllowed) data.push(attachTyping(method))
  if (method.explanation) {
    data.push(method.explanation)
    data.push('\n')
  }

  // if (method.notes && !npmReadme) data.push(createNoteReadme(method))
  if (method.example && !npmReadme) data.push(createExampleReadme(method))

  if (method.replLink) {
    data.push(createReplReadme(method))
    data.push('\n')
  }

  if (method.allTypings && isRambdaOnly) {
    data.push(attachAllTypings(method))
  }
  // if (method.rambdaSource && isAllowed) {
  //   data.push(createRambdaSourceReadme(method))
  // }
  if (method.rambdaSpecs && isAllowed && isRambdaOnly) {
    data.push(createRambdaSpecReadme(method))
  }

  // if (method.typescriptDefinitionTest && isRambdaOnly) {
  //   data.push(createTypescriptTest(method))
  // }

  if (method.benchmarkInfo && isRambdaOnly) {
    data.push(createBenchmarkInfo(method))
  }
  // if (method.failedSpecsReasons){
  //   data.push(createFailedSpec(method))
  // }

  data.push(`\n${getMethodSeparator(method.methodName)}\n`)

  return data.join('')
}
