import {interpolate} from 'rambdax'
import {getMethodSeparator} from '../utils'
import {getAllowance} from './get-allowance'

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

function createTypeScriptTest(method: any) {
  const summaryTemplate = `
<details>

<summary><strong>TypeScript</strong> test</summary>

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

<summary>All TypeScript definitions</summary>

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
  replLink: string
  methodName: string
}) {
  return `\n<a title="redirect to Rambda Repl site" href="${replLink}">Try this <strong>R.${methodName}</strong> example in Rambda REPL</a>`
}

export function createMethodData(
  method: any,
  withRambdax: boolean,
  npmReadme: boolean
) {
  const data = getIntro(method)
  const allowance = getAllowance(method.methodName, withRambdax)
  if (method.typing && allowance.typing) data.push(attachTyping(method))
  if (method.explanation) {
    data.push(method.explanation)
    data.push('\n')
  }

  if (method.notes && !npmReadme) data.push(createNoteReadme(method))
  if (method.example && !npmReadme && allowance.example)
    data.push(createExampleReadme(method))

  if (method.replLink) {
    data.push(createReplReadme(method))
    data.push('\n')
  }

  if (method.allTypings && allowance.allTypings) {
    data.push(attachAllTypings(method))
  }
  if (method.rambdaSource && allowance.source) {
    data.push(createRambdaSourceReadme(method))
  }
  if (method.rambdaSpecs && allowance.specs) {
    data.push(createRambdaSpecReadme(method))
  }

  if (method.typescriptDefinitionTest && allowance.tsTest) {
    data.push(createTypeScriptTest(method))
  }

  if (method.benchmarkInfo && allowance.benchmark) {
    data.push(createBenchmarkInfo(method))
  }

  data.push(`\n${getMethodSeparator(method.methodName)}\n`)
  return data.join('')
}
