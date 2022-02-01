const {add, complete, cycle, save, suite} = require('benny')
const {snakeCase, constantCase} = require('string-fn')
const {equals} = require('rambdax')
const {deepEqual} = require('fast-equals')
const folder = 'standalone-benchmark-results'

const first = () => {
  equals({a:1},{a:1, b:2})
}
const second = () => {
  deepEqual({a:1},{a:1, b:2})
}

void async function main(){
  await suite(
    constantCase('fast equals'),
    add('rambda', first),
    add('fast equals', second),
    cycle(),
    complete(),
    save({
      file: snakeCase('fast equals'),
      folder,
    })
  )
}()

