import {rambdaRepl} from './rambda-repl'

const input = `
const result = await R.composeAsync(
  R.mapAsync(async x => {
    await R.delay(100)
    return x + 1
  }),
  R.filter(x => x > 1)
)([1, 2, 3])
// => [3, 4]
`.trim()

test('happy', () => {
  expect(rambdaRepl(input)).toMatchInlineSnapshot(
    `"https://rambda.now.sh?const%20result%20%3D%20await%20R.composeAsync(%0A%20%20R.mapAsync(async%20x%20%3D%3E%20%7B%0A%20%20%20%20await%20R.delay(100)%0A%20%20%20%20return%20x%20%2B%201%0A%20%20%7D)%2C%0A%20%20R.filter(x%20%3D%3E%20x%20%3E%201)%0A)(%5B1%2C%202%2C%203%5D)%0A%2F%2F%20%3D%3E%20%5B3%2C%204%5D"`
  )
})

const pluck = `
const list = [{a: 1}, {a: 2}, {b: 3}]
const property = 'a'

R.pluck(property, list) 
// => [1, 2]
`.trim()

test('with R.pluck example', () => {
  expect(rambdaRepl(pluck)).toMatchInlineSnapshot(
    `"https://rambda.now.sh?const%20list%20%3D%20%5B%7Ba%3A%201%7D%2C%20%7Ba%3A%202%7D%2C%20%7Bb%3A%203%7D%5D%0Aconst%20property%20%3D%20'a'%0A%0Aconst%20result%20%3D%20R.pluck(property%2C%20list)%20%0A%2F%2F%20%3D%3E%20%5B1%2C%202%5D"`
  )
})
