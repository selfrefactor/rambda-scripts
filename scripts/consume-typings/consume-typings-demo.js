"use strict";
exports.__esModule = true;
exports.first = exports.lastOf = void 0;
// import * as R from 'remeda'
var R = require("rambda");
var Ramda = require("ramda");
function lastOf(array) {
    return array[array.length - 1];
}
exports.lastOf = lastOf;
// export function last<T extends unknown[]>(input: T): T extends [...infer _, infer U] ? U : T[0]
function first(array) {
    return array[0];
}
exports.first = first;
var list = ['bar', 1, 2, 3, 'foo'];
var listx = ['bar', 1, 2, 3, 'foo'];
var a1 = first(list);
var a2 = first(listx);
var a = Ramda.last(list);
var xa = Ramda.last(listx);
var aa = R.last(list);
var aax = R.last(listx);
var aay = lastOf(listx);
var asd = lastOf(list);
var bb = list[0];
console.log({
    a1: a1,
    a2: a2,
    a: a,
    asd: asd,
    aax: aax,
    aay: aay,
    xa: xa,
    aa: aa,
    bb: bb
});
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
