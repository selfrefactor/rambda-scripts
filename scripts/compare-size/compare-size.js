const R = require('rambda')
const Ramda = require('ramda')
const {exec} = require('helpers-fn')

const allMethodx = Object.keys(Ramda)
const allMethods = Object.keys(R).filter(x => allMethodx.includes(x)).join(' ')
console.log(allMethods, `allMethod`)
let command = `npm run --silent partial-build ${allMethods} > dist.ramda.custom.js`

exec({command, cwd: __dirname})
