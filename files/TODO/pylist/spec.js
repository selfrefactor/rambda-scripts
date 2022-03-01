import { pylist } from './pylist'

// type PyList<T> = Omit<Array<T>, 'slice' | 'push'>
// export class pylist<T> extends PyList<T>{
//   constructor(...items: T[]){}
//   slice(start: string): Array<T>;
//   slice(start: number): Array<T>;
//   slice(start: number, stop: number): Array<T>;
//   push(index: number): T
//   _: T[]
// }

test('slice', () => {
  const list = new pylist(1,2,3,4,5,6,7,8,9)
  expect(list.slice("0:3")).toEqual([1,2,3])
})

test('push', () => {
  const list = new pylist(1,2)

  expect(list.push(3)).toEqual(3)
  expect(list._).toEqual([1,2,3])
})
