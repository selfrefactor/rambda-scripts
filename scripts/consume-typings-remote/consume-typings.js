"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var rambdax_1 = require("rambdax");
var pipeResult = (0, ramda_1.without)(['abc'], ['abc']);
console.log(pipeResult, "pipeResult");
var alois = { name: 'Alois', age: 15, disposition: 'surly' };
var hasBrownHair = (0, ramda_1.propEq)(12, 'age', alois);
var age = (0, ramda_1.propEq)(15, 'age', alois);
console.log({ hasBrownHair: hasBrownHair, age: age });
function foo(a, b, c) {
}
console.log((0, rambdax_1.partial)(foo, [1, 2]), "partial(foo, [1,2])");
console.log((0, rambdax_1.partial)(foo, [1, 2])(3), "partial(foo, [1,2])(3)");
var arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
var sortWithRProp = (0, ramda_1.sortBy)((0, ramda_1.prop)('id'), arr);
var sortWithoutRProp = (0, ramda_1.sortBy)(function (item) { return item.id; }, arr);
var mapWithRProp = (0, ramda_1.map)((0, ramda_1.prop)('id'), arr);
var mapWithoutRProp = (0, ramda_1.map)(function (item) { return item.id; }, arr);
console.log('sortWithRProp', sortWithRProp);
console.log('sortWithoutRProp', sortWithoutRProp);
console.log('mapWithRProp', mapWithRProp);
console.log('mapWithoutRProp', mapWithoutRProp);
process.exit(0);
var moveResult = (0, ramda_1.move)(1, 2, [1, 2, 3]);
var unionResult = (0, ramda_1.union)([1, 2, 4], [1, 2, 3]);
var applySpecResult = (0, ramda_1.applySpec)({
    a: (0, ramda_1.add)(1)
})(1);
var transposeResult = (0, ramda_1.transpose)([[1, 2], [], [1, 2, 3], [3]]);
console.log({ applySpecResult: applySpecResult, transposeResult: transposeResult, moveResult: moveResult, unionResult: unionResult });
var object = {
    this: {
        is: {
            a: 'path',
        },
    },
};
var test1 = (0, ramda_1.path)(['this', 'is', 'not', 'a'])(object);
test1; // $ExpectType unknown
var test21 = (0, ramda_1.path)(['this', 'is', 'not'], object);
test21; // $ExpectType unknown
