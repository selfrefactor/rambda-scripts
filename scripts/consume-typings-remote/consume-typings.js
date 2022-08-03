"use strict";
exports.__esModule = true;
// import { add, applySpec, reject, and, transpose, move, union, reduce } from 'rambda/immutable'
var rambda_1 = require("rambda");
// import {sortByProps} from 'rambdax'
// "rambda": "file:./../../../rambda/",
// const sortByPropsResult = sortByProps(['a.b', 'a.c'], [
//   {a: {b: 2, c: 4}},
//   {a: {b: 2, c: 3}},
// ])
var moveResult = (0, rambda_1.move)(1, 2, [1, 2, 3]);
var unionResult = (0, rambda_1.union)([1, 2, 4], [1, 2, 3]);
var applySpecResult = (0, rambda_1.applySpec)({
    a: (0, rambda_1.add)(1)
})(1);
var transposeResult = (0, rambda_1.transpose)([[1, 2], [], [1, 2, 3], [3]]);
console.log({ applySpecResult: applySpecResult, transposeResult: transposeResult, moveResult: moveResult, unionResult: unionResult });
// console.log({sortByPropsResult: sortByPropsResult[0]})
var bs = (0, rambda_1.and)(1)(2);
var a = (0, rambda_1.reject)(function (a) { return a > 1; }, [1, 2, 3]);
function fn(input) {
    return input.c ? input.a : input.b;
}
var foo = {
    bar: ['1', '2', '3']
};
var numberArray = [1, 2, 3];
var result = (0, rambda_1.reduce)(function (acc, elem, i) {
    acc; // $ExpectType number
    elem; // $ExpectType number
    i; // $ExpectType number
    return acc + elem;
}, 1, numberArray);
// const curried = partialCurry<Input, PartialInput, string|number>(fn, {a:1, b:'foo'});
// curried // $ExpectType (input: Pick<Input, "c">) => string | number
// const result = curried({c:false})
// result// $ExpectType string | number
// const partialInput = {a:1}
// type B = Exclude<keyof Input, keyof PartialInput>
