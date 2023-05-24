"use strict";
exports.__esModule = true;
// import * as R from 'remeda'
var R = require("rambda");
var Ramda = require("ramda");
// const list = [ 1, 2, 3, 'foo' ]
var list = [1, 2, 3, 'foo'];
var listx = [1, 2, 3, 'foo'];
var a = Ramda.last(list);
var aa = R.last(listx);
var bb = list[0];
console.log({
    a: a,
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
