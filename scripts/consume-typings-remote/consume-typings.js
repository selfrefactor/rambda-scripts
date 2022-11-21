"use strict";
exports.__esModule = true;
var rambda_1 = require("rambda");
var moveResult = (0, rambda_1.move)(1, 2, [1, 2, 3]);
var unionResult = (0, rambda_1.union)([1, 2, 4], [1, 2, 3]);
var applySpecResult = (0, rambda_1.applySpec)({
    a: (0, rambda_1.add)(1)
})(1);
var transposeResult = (0, rambda_1.transpose)([[1, 2], [], [1, 2, 3], [3]]);
console.log({ applySpecResult: applySpecResult, transposeResult: transposeResult, moveResult: moveResult, unionResult: unionResult });
