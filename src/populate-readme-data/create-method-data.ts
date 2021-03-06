import { interpolate } from 'rambdax'
import { BLACKLIST_METHODS } from '../constants'
import { getMethodSeparator } from '../utils'

function createFailedSpec(method: any){
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

  const templateToUse = method.failedRamdaSpecs ?
    summaryTemplate :
    shortSummaryTemplate

  return interpolate(templateToUse, method)
}

function createRambdaSpecReadme(method: any){
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

function createRambdaSourceReadme(method: any){
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

function createTypescriptTest(method: any){
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

function createBenchmarkInfo(method: any){
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

function attachAllTypings(method: any){
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

const createExampleReadme = ({ example }: {example: string}) => `
\`\`\`javascript
${ example }
\`\`\`
`

const createNoteReadme = ({ notes }: {notes: string}) => `

> :boom: ${ notes }
`

const attachTyping = ({ typing }: {typing: string}) => `
\`\`\`typescript
${ typing }
\`\`\`
\n`

const getIntro = ({ methodName }: {methodName: string}) => [ `### ${ methodName }`, '\n\n' ]

function createReplReadme({ replLink, methodName }: {replLink: string, methodName: string}){
  return `\n<a title="redirect to Rambda Repl site" href="${ replLink }">Try this <strong>R.${ methodName }</strong> example in Rambda REPL</a>`
}

export function createMethodData(method: any, withRambdax: boolean){
  const data = getIntro(method)
  const isLong = !BLACKLIST_METHODS.includes(method.methodName)
  const isExtraLong = isLong && !withRambdax

  if (method.typing && isLong) data.push(attachTyping(method))
  if (method.explanation){
    data.push(method.explanation)
    data.push('\n')
  } 
  
  if (method.notes) data.push(createNoteReadme(method))
  if (method.example) data.push(createExampleReadme(method))
  
  if (method.replLink){
    data.push(createReplReadme(method))
    data.push('\n')
  } 

  if (method.allTypings&& isExtraLong){
    data.push(attachAllTypings(method))
  }
  if (method.rambdaSource && isLong){
    data.push(createRambdaSourceReadme(method))
  }
  if (method.rambdaSpecs && isLong){
    data.push(createRambdaSpecReadme(method))
  } 

  if (method.typescriptDefinitionTest && isExtraLong){
    data.push(createTypescriptTest(method))
  }

  if (method.benchmarkInfo && isExtraLong){
    data.push(createBenchmarkInfo(method))
  }
  // if (method.failedSpecsReasons && isLong){
  //   data.push(createFailedSpec(method))
  // }

  data.push(`\n${getMethodSeparator(method.methodName)}\n`)

  return data.join('')
}
