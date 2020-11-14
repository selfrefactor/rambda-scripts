import {add} from 'rambdax'

test('happy', () => {
  const a = add(11)
  const aa = a(12)
  const b = a(2)
})