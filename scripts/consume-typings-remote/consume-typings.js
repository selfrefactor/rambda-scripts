"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rambda_1 = require("rambda");
var ramda_1 = require("ramda");
var alois = { name: 'Alois', age: 15, disposition: 'surly' };
var hasBrownHair = (0, ramda_1.propEq)('brown', 'age', alois);
var age = (0, ramda_1.propEq)(15, 'age', alois);
console.log({ hasBrownHair: hasBrownHair, age: age });
process.exit(0);
var moveResult = (0, rambda_1.move)(1, 2, [1, 2, 3]);
var unionResult = (0, rambda_1.union)([1, 2, 4], [1, 2, 3]);
var applySpecResult = (0, rambda_1.applySpec)({
    a: (0, rambda_1.add)(1)
})(1);
var transposeResult = (0, rambda_1.transpose)([[1, 2], [], [1, 2, 3], [3]]);
console.log({ applySpecResult: applySpecResult, transposeResult: transposeResult, moveResult: moveResult, unionResult: unionResult });
var object = {
    this: {
        is: {
            a: 'path',
        },
    },
};
var test1 = (0, rambda_1.path)(['this', 'is', 'not', 'a'])(object);
test1; // $ExpectType unknown
var test21 = (0, rambda_1.path)(['this', 'is', 'not'], object);
test21; // $ExpectType unknown
