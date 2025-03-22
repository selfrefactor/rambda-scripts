import {interpolate} from 'rambdax'
import {getMethodSeparator} from '../utils'
import { count } from 'string-fn'

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

function attachAllTypings(method: any) {
	if(count(method.allTypings, ';') >=4){
		let displayTypings = method.allTypings.split(';').slice(0, 4).join(';')
		displayTypings = `${displayTypings};\n...\n...`
		method.allTypings = displayTypings
	}
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
let TS_PIPE_NOTE = `Typescript Note: Pass explicit type annotation when used with **R.pipe/R.compose** for better type inference`

let handleSpecialCaseOfNote = (notes: string) => {
	if(notes.trim().startsWith('pipe')) {
		
		if(notes.trim() === 'pipe'){
			return TS_PIPE_NOTE
		}
		let [,noteContent] = notes.split('pipe |')

		return `${TS_PIPE_NOTE}\n\n${noteContent}`
	}
	return notes
}

const createNoteReadme = ({notes}: {notes: string}) => `

> :boom: ${handleSpecialCaseOfNote(notes)}
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
) {
  const data = getIntro(method)
	// if(method.methodName === 'path'){
	// 	1
	// 	let a = 1
	// }
  if (method.typing) data.push(attachTyping(method))
  if (method.explanation) {
    data.push(method.explanation)
    data.push('\n')
  }

  if (method.notes) {
		data.push(createNoteReadme(method))
	}
  if (method.example )
    data.push(createExampleReadme(method))

  if (method.replLink) {
    data.push(createReplReadme(method))
    data.push('\n')
  }

  if (method.allTypings) {

    data.push(attachAllTypings(method))
  }
  if (method.rambdaSource ) {
    data.push(createRambdaSourceReadme(method))
  }
  if (method.rambdaSpecs) {
    data.push(createRambdaSpecReadme(method))
  }

  if (method.typescriptDefinitionTest) {
    data.push(createTypeScriptTest(method))
  }

  data.push(`\n${getMethodSeparator(method.methodName)}\n`)
  return data.join('')
}
