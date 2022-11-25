const R = require('rambda')
const Ramda = require('ramda')
const {exec} = require('helpers-fn')
const { interpolate } = require('rambdax')

const allMethodx = Object.keys(Ramda)
const allMethods = Object.keys(R).filter(x => allMethodx.includes(x)).join(' ')
const allMethodsxx = Object.keys(R).filter(x => allMethodx.includes(x)).map(x => `export const ${x} = R.${x};`).join('\n')
let command = `npm run --silent partial-build ${allMethods} > dist.ramda.custom.js`

// exec({command, cwd: __dirname})

let template = `
import * as R from 'ramda';

{{allMethods}} 
`

const content = interpolate(template, {allMethods: allMethodsxx})
console.log(content, `content`)
