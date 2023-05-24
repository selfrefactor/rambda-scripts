// import * as R from 'remeda'
import * as R from 'rambda'
import * as Ramda from 'ramda'

type LastArrayElement<ValueType extends readonly unknown[]> =
	ValueType extends readonly [infer ElementType]
		? ElementType
		: ValueType extends readonly [infer _, ...infer Tail]
			? LastArrayElement<Tail>
			: ValueType extends ReadonlyArray<infer ElementType>
				? ElementType
				: never;

export function lastOf<V extends readonly any[]>(array: V): LastArrayElement<V>{
	return array[array.length - 1];
}
// export function last<T extends unknown[]>(input: T): T extends [...infer _, infer U] ? U : T[0]

export function first<T extends unknown[]>(array: T): T extends [...infer _, infer U] ? U : T[0]{
	return array[0] as any
}

const list = [ 'bar',1, 2, 3,'foo' ] as const
const listx = [ 'bar', 1, 2, 3,'foo' ]

let a1 = first(list as any)
let a2 = first(listx)
let a = Ramda.last(list)
let xa = Ramda.last(listx)
let aa = R.last(list as any)
let aax = R.last(listx)
let aay = lastOf(listx)
let asd = lastOf(list)
let bb: LastArrayElement<typeof listx> = list[0]
console.log( {
  a1,
  a2,
	a,
		asd,
		aax,
		aay,
	xa,
	aa,
	bb,
} )
// const resultPipe = R.pipe(
//   list,
//   R.map((x) => {
//     return x+12
//   }), 
//   R.map((x) => {
//     return x+1
//   }), 
//   // x => x[0]
//   // R.last
// )
 
// const resultCreatePipe = R.createPipe(
//   R.map((x) => {
//     return x+1
//   }), 
//   R.map((x) => {
//     return x+1
//   }), 
//   // x => x[0]
//   // R.last
// )(list)

// const resultRambda = Rambda.pipe(
//   Rambda.map((x) => {
//     return x+1
//   }), 
//   Rambda.map((x) => {
//     return x+1
//   }), 
//   // R.last
// )(list)
