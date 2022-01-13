const {camelCase} = require('string-fn')
const {range} = require('rambdax')
const {outputFile} = require('fs-extra')

const LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
]

function buildMultipleTypes(methodName, num) {
  return range(0, num).map(i => {
    const inferTypes = range(0, i + 2)
      .map(x => LETTERS[x])
      .join(', ')

    const functionInputs = range(0, i + 1)
      .map(x => [LETTERS[x], LETTERS[x + 1]])
      .map(([x, y]) => `fn${LETTERS.indexOf(x)}: (x: ${x}) => ${y}`)
      .join(', ')

    return `
export function ${methodName}<${inferTypes}>(input: A, ${functionInputs}) : ${
      LETTERS[i + 1]
    };      
`.trim()
  })
}

void (async function main() {
  if (process.argv.length < 3) {
    throw new Error('Missing method name or too many arguments')
  }
  const methodName = camelCase(process.argv[2])
  const num = process.argv[3] === undefined ? 8 : Number(process.argv[3])
  const data = buildMultipleTypes(methodName, num)
  await outputFile(`${__dirname}/output.txt`, data.join('\n'))
})()
