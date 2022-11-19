"use strict";
exports.__esModule = true;
// import * as R from 'remeda'
var Roza = require("roza");
var rozaResult = Roza.pipe(1, function (x) { return x + 1; });
console.log(rozaResult, "rozaResult");
// const list = [ 1, 2, 3, 'foo' ]
var list = [1, 2, 3];
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
