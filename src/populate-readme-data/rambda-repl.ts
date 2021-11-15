import { either, includes, when } from 'rambdax'
const REPL_URL = 'https://rambda.now.sh'

const getConsoleLog = includes('console.log')
const getResultVariableLog = either(includes('const result ='),
  includes('const result='))

function attachResultVariable(input: string){
  let lineToAttach: unknown = undefined

  input.split('\n').forEach(
    (line, i) => {
      if(line.startsWith('//')) return
      lineToAttach = i
    } 
  )
  if(lineToAttach === undefined) return input

  return input.split('\n').map(
    (line, i) => i === lineToAttach ? `const result = ${line}` : line
  ).join('\n')
}

export function rambdaRepl(input: string){
  const consoleLogFlag = getConsoleLog(input)
  const resultVariableFlag = getResultVariableLog(input)
  const flag = resultVariableFlag || consoleLogFlag
  const code = when(() => !flag, attachResultVariable)(input)
  const encoded = encodeURIComponent(code.trim())

  return `${ REPL_URL }?${ encoded }`
}
