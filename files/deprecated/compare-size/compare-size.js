const R = require('rambda')
const Ramda = require('ramda')
const { interpolate } = require('rambdax')

const allMethodsRamda = Object.keys(Ramda)
const allMethods = Object.keys(R).filter(x => allMethodsRamda.includes(x)).map(x => `export const ${x} = R.${x};`).join('\n')

let template = `
import * as R from 'ramda';

{{allMethods}} 
`

const content = interpolate(template, {allMethods: allMethods})
console.log(content, `content`)
