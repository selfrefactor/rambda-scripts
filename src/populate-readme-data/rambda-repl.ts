import { either, includes, when } from 'rambdax'
const REPL_URL = 'https://rambda.now.sh'

const getConsoleLog = includes('console.log')
const getResultVariableLog = either(includes('const result ='),
  includes('const result='))

function attachResultVariable(input: string){
  const [ firstLineRaw, ...otherLines ] = input.split('\n')
  const firstLine = `const result = ${ firstLineRaw }`

  return otherLines.length === 0 ?
    firstLine :
    [ firstLine, ...otherLines ].join('\n')
}

export function rambdaRepl(input: string){
  const consoleLogFlag = getConsoleLog(input)
  const resultVariableFlag = getResultVariableLog(input)
  const flag = resultVariableFlag || consoleLogFlag
  const code = when(() => !flag, attachResultVariable)(input)
  const encoded = encodeURIComponent(code.trim())

  return `${ REPL_URL }?${ encoded }`
}
