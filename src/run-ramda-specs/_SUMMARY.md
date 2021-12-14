> F

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('F', function() {
  it('always returns false', function() {
    eq(R.F(), false);
    eq(R.F(10), false);
    eq(R.F(true), false);
  });
```

> T

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('T', function() {
  it('always returns true', function() {
    eq(R.T(), true);
    eq(R.T(10), true);
    eq(R.T(true), true);
  });
```

> add

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var fc = require('fast-check');

describe('add', function() {
  it('adds together two numbers', function() {
    eq(R.add(3, 7), 10);
  });
  it('coerces its arguments to numbers', function() {
    eq(R.add('1', '2'), 3);
    eq(R.add(1, '2'), 3);
    eq(R.add(true, false), 1);
    eq(R.add(null, null), 0);
    eq(R.add(undefined, undefined), NaN);
    eq(R.add(new Date(1), new Date(2)), 3);
  });
describe('add properties', function() {
  it('commutative', function() {
    fc.assert(fc.property(fc.integer(), fc.integer(), function(a, b) {
      return R.add(a, b) === R.add(b, a);
    }));
  });
  it('associative', function() {
    fc.assert(fc.property(fc.integer(), fc.integer(), fc.integer(), function(a, b, c) {
      return R.add(a, R.add(b, c)) === R.add(R.add(a, b), c);
    }));
  });
  it('identity', function() {
    fc.assert(fc.property(fc.integer(), function(a) {
      return R.add(a, 0) === a && R.add(0, a) === a;
    }));
  });
```

> adjust

Reason for failing:  Ramda method accepts an array-like object

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('adjust', function() {
  it('applies the given function to the value at the given index of the supplied array', function() {
    eq(R.adjust(2, R.add(1), [0, 1, 2, 3]), [0, 1, 3, 3]);
  });
  it('offsets negative indexes from the end of the array', function() {
    eq(R.adjust(-3, R.add(1), [0, 1, 2, 3]), [0, 2, 2, 3]);
  });
  it('returns the original array if the supplied index is out of bounds', function() {
    var list = [0, 1, 2, 3];
    eq(R.adjust(4, R.add(1), list), list);
    eq(R.adjust(-5, R.add(1), list), list);
  });
  it('does not mutate the original array', function() {
    var list = [0, 1, 2, 3];
    eq(R.adjust(2, R.add(1), list), [0, 1, 3, 3]);
    eq(list, [0, 1, 2, 3]);
  });
  it('accepts an array-like object', function() {
    function args() {
      return arguments;
    }
    eq(R.adjust(2, R.add(1), args(0, 1, 2, 3)), [0, 1, 3, 3]);
  });
```

> all

```javascript
var listXf = require('./helpers/listXf');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('all', function() {
  var even = function(n) {return n % 2 === 0;};
  var T = function() {return true;};
  var isFalse = function(x) { return x === false; };
  var intoArray = R.into([]);
  it('returns true if all elements satisfy the predicate', function() {
    eq(R.all(even, [2, 4, 6, 8, 10, 12]), true);
    eq(R.all(isFalse, [false, false, false]), true);
  });
  it('returns false if any element fails to satisfy the predicate', function() {
    eq(R.all(even, [2, 4, 6, 8, 9, 10]), false);
  });
  it('returns true for an empty list', function() {
    eq(R.all(T, []), true);
  });
  it('returns true into array if all elements satisfy the predicate', function() {
    eq(intoArray(R.all(even), [2, 4, 6, 8, 10, 12]), [true]);
    eq(intoArray(R.all(isFalse), [false, false, false]), [true]);
  });
  it('returns false into array if any element fails to satisfy the predicate', function() {
    eq(intoArray(R.all(even), [2, 4, 6, 8, 9, 10]), [false]);
  });
  it('returns true into array for an empty list', function() {
    eq(intoArray(R.all(T), []), [true]);
  });
  it('works with more complex objects', function() {
    var xs = [{x: 'abc'}, {x: 'ade'}, {x: 'fghiajk'}];
    function len3(o) { return o.x.length === 3; }
    function hasA(o) { return o.x.indexOf('a') > -1; }
    eq(R.all(len3, xs), false);
    eq(R.all(hasA, xs), true);
  });
  it('dispatches when given a transformer in list position', function() {
    eq(R.all(even, listXf), {
      all: true,
      f: even,
      xf: listXf
    });
  });
```

> allPass

Reason for failing:  Ramda method returns a curried function whose arity matches that of the highest-arity predicate

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('allPass', function() {
  var odd = function(n) { return n % 2 !== 0; };
  var lt20 = function(n) { return n < 20; };
  var gt5 = function(n) { return n > 5; };
  var plusEq = function(w, x, y, z) { return w + x === y + z; };
  it('reports whether all predicates are satisfied by a given value', function() {
    var ok = R.allPass([odd, lt20, gt5]);
    eq(ok(7), true);
    eq(ok(9), true);
    eq(ok(10), false);
    eq(ok(3), false);
    eq(ok(21), false);
  });
  it('returns true on empty predicate list', function() {
    eq(R.allPass([])(3), true);
  });
  it('returns a curried function whose arity matches that of the highest-arity predicate', function() {
    eq(R.allPass([odd, gt5, plusEq]).length, 4);
    eq(R.allPass([odd, gt5, plusEq])(9, 9, 9, 9), true);
    eq(R.allPass([odd, gt5, plusEq])(9)(9)(9)(9), true);
  });
```

> always

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var fc = require('fast-check');

describe('always', function() {
  it('returns a function that returns the object initially supplied', function() {
    var theMeaning = R.always(42);
    eq(theMeaning(), 42);
    eq(theMeaning(10), 42);
    eq(theMeaning(false), 42);
  });
  it('works with various types', function() {
    eq(R.always(false)(), false);
    eq(R.always('abc')(), 'abc');
    eq(R.always({a: 1, b: 2})(), {a: 1, b: 2});
    var obj = {a: 1, b: 2};
    eq(R.always(obj)(), obj);
    var now = new Date(1776, 6, 4);
    eq(R.always(now)(), new Date(1776, 6, 4));
    eq(R.always(undefined)(), undefined);
  });
describe('always properties', function() {
  it('returns initial argument', function() {
    fc.assert(fc.property(fc.anything(), fc.anything(), function(a, b) {
      fc.pre(a === a);
      var f = R.always(a);
      return f() === a && f(b) === a;
    }));
  });
```

> and

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('and', function() {
  it('compares two values with js &&', function() {
    eq(R.and(true, true), true);
    eq(R.and(true, false), false);
    eq(R.and(false, true), false);
    eq(R.and(false, false), false);
  });
```

> any

```javascript
var listXf = require('./helpers/listXf');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('any', function() {
  var odd = function(n) {return n % 2 === 1;};
  var T = function() {return true;};
  var intoArray = R.into([]);
  it('returns true if any element satisfies the predicate', function() {
    eq(R.any(odd, [2, 4, 6, 8, 10, 11, 12]), true);
  });
  it('returns false if all elements fails to satisfy the predicate', function() {
    eq(R.any(odd, [2, 4, 6, 8, 10, 12]), false);
  });
  it('returns true into array if any element satisfies the predicate', function() {
    eq(intoArray(R.any(odd), [2, 4, 6, 8, 10, 11, 12]), [true]);
  });
  it('returns false if all elements fails to satisfy the predicate', function() {
    eq(intoArray(R.any(odd), [2, 4, 6, 8, 10, 12]), [false]);
  });
  it('works with more complex objects', function() {
    var people = [{first: 'Paul', last: 'Grenier'}, {first:'Mike', last: 'Hurley'}, {first: 'Will', last: 'Klein'}];
    var alliterative = function(person) {return person.first.charAt(0) === person.last.charAt(0);};
    eq(R.any(alliterative, people), false);
    people.push({first: 'Scott', last: 'Sauyet'});
    eq(R.any(alliterative, people), true);
  });
  it('can use a configurable function', function() {
    var teens = [{name: 'Alice', age: 14}, {name: 'Betty', age: 18}, {name: 'Cindy', age: 17}];
    var atLeast = function(age) {return function(person) {return person.age >= age;};};
    eq(R.any(atLeast(16), teens), true);
    eq(R.any(atLeast(21), teens), false);
  });
  it('returns false for an empty list', function() {
    eq(R.any(T, []), false);
  });
  it('returns false into array for an empty list', function() {
    eq(intoArray(R.any(T), []), [false]);
  });
  it('dispatches when given a transformer in list position', function() {
    eq(R.any(odd, listXf), {
      any: false,
      f: odd,
      xf: listXf
    });
  });
```

> anyPass

Reason for failing:  Ramda method returns a curried function whose arity matches that of the highest-arity predicate

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('anyPass', function() {
  var odd = function(n) { return n % 2 !== 0; };
  var gt20 = function(n) { return n > 20; };
  var lt5 = function(n) { return n < 5; };
  var plusEq = function(w, x, y, z) { return w + x === y + z; };
  it('reports whether any predicates are satisfied by a given value', function() {
    var ok = R.anyPass([odd, gt20, lt5]);
    eq(ok(7), true);
    eq(ok(9), true);
    eq(ok(10), false);
    eq(ok(18), false);
    eq(ok(3), true);
    eq(ok(22), true);
  });
  it('returns false for an empty predicate list', function() {
    eq(R.anyPass([])(3), false);
  });
  it('returns a curried function whose arity matches that of the highest-arity predicate', function() {
    eq(R.anyPass([odd, lt5, plusEq]).length, 4);
    eq(R.anyPass([odd, lt5, plusEq])(6, 7, 8, 9), false);
    eq(R.anyPass([odd, lt5, plusEq])(6)(7)(8)(9), false);
  });
```

> append

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('append', function() {
  it('adds the element to the end of the list', function() {
    eq(R.append('z', ['x', 'y']), ['x', 'y', 'z']);
    eq(R.append(['a', 'z'], ['x', 'y']), ['x', 'y', ['a', 'z']]);
  });
  it('works on empty list', function() {
    eq(R.append(1, []), [1]);
  });
```

> applySpec

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('applySpec', function() {
  it('works with empty spec', function() {
    eq(R.applySpec({})(), {});
  });
  it('works with unary functions', function() {
    eq(R.applySpec({ v: R.inc, u: R.dec })(1), { v: 2, u: 0 });
  });
  it('works with binary functions', function() {
    eq(R.applySpec({ sum: R.add })(1, 2), { sum: 3 });
  });
  it('works with nested specs', function() {
    eq(R.applySpec({ unnested: R.always(0), nested: { sum: R.add } })(1, 2),
      { unnested: 0, nested: { sum: 3 } }
    );
  });
  it('works with arrays of nested specs', function() {
    eq(R.applySpec({ unnested: R.always(0), nested:[{ sum: R.add }] })(1, 2),
      { unnested: 0, nested: [{ sum: 3 }] }
    );
  });
  it('works with arrays of spec objects', function() {
    eq(R.applySpec([{ sum: R.add }])(1, 2),
      [{ sum: 3 }]
    );
  });
  it('works with arrays of functions', function() {
    eq(R.applySpec([R.map(R.prop('a')), R.map(R.prop('b'))])([
      {a: 'a1', b: 'b1'}, {a: 'a2', b: 'b2'}
    ]),
    [['a1', 'a2'], ['b1', 'b2']]);
  });
  it('works with a spec defining a map key', function() {
    eq(R.applySpec({map: R.prop('a')})({a: 1}), {map: 1});
  });
  it('retains the highest arity', function() {
    var f = R.applySpec({ f1: R.nAry(2, R.T), f2: R.nAry(5, R.T) });
    eq(f.length, 5);
  });
  it('returns a curried function', function() {
    eq(R.applySpec({ sum: R.add })(1)(2), { sum: 3 });
  });
```

> assoc

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('assoc', function() {
  it('makes a shallow clone of an object, overriding only the specified property', function() {
    var obj1 = {a: 1, b: {c: 2, d: 3}, e: 4, f: 5};
    var obj2 = R.assoc('e', {x: 42}, obj1);
    eq(obj2, {a: 1, b: {c: 2, d: 3}, e: {x: 42}, f: 5});
    // Note: reference equality below!
    assert.strictEqual(obj2.a, obj1.a);
    assert.strictEqual(obj2.b, obj1.b);
    assert.strictEqual(obj2.f, obj1.f);
  });
  it('is the equivalent of clone and set if the property is not on the original', function() {
    var obj1 = {a: 1, b: {c: 2, d: 3}, e: 4, f: 5};
    var obj2 = R.assoc('z', {x: 42}, obj1);
    eq(obj2, {a: 1, b: {c: 2, d: 3}, e: 4, f: 5, z: {x: 42}});
    // Note: reference equality below!
    assert.strictEqual(obj2.a, obj1.a);
    assert.strictEqual(obj2.b, obj1.b);
    assert.strictEqual(obj2.f, obj1.f);
  });
  it('makes a shallow clone of an array, overriding only the specified index', function() {
    var newValue = [4, 2];
    var ary1 = [1, [2, 3], 4, 5];
    var ary2 = R.assoc(2, newValue, ary1);
    eq(ary2, [1, [2, 3], [4, 2], 5]);
    // Note: reference equality below!
    assert.strictEqual(ary2[0], ary1[0]);
    assert.strictEqual(ary2[1], ary1[1]);
    assert.strictEqual(ary2[2], newValue);
    assert.strictEqual(ary2[3], ary1[3]);
  });
  it('is the equivalent of clone and set if the index is not on the original', function() {
    var newValue = [4, 2];
    var ary1 = [1, [2, 3], 4];
    var ary2 = R.assoc(5, newValue, ary1);
    eq(ary2, [1, [2, 3], 4, undefined, undefined, [4, 2]]);
    // Note: reference equality below!
    assert.strictEqual(ary2[0], ary1[0]);
    assert.strictEqual(ary2[1], ary1[1]);
    assert.strictEqual(ary2[2], ary1[2]);
    assert.strictEqual(ary2[5], newValue);
  });
```

> assocPath

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('assocPath', function() {
  it('makes a shallow clone of an object, overriding only what is necessary for the path', function() {
    var obj1 = {a: {b: 1, c: 2, d: {e: 3}}, f: {g: {h: 4, i: [5, 6, 7], j: {k: 6, l: 7}}}, m: 8};
    var obj2 = R.assocPath(['f', 'g', 'i', 1], 42, obj1);
    eq(obj2.f.g.i, [5, 42, 7]);
    // Note: reference equality below!
    assert.strictEqual(obj2.a, obj1.a);
    assert.strictEqual(obj2.m, obj1.m);
    assert.strictEqual(obj2.f.g.h, obj1.f.g.h);
    assert.strictEqual(obj2.f.g.j, obj1.f.g.j);
  });
  it('is the equivalent of clone and setPath if the property is not on the original', function() {
    var obj1 = {a: 1, b: {c: 2, d: 3}, e: 4, f: 5};
    var obj2 = R.assocPath(['x', 0, 'y'], 42, obj1);
    eq(obj2, {a: 1, b: {c: 2, d: 3}, e: 4, f: 5, x: [{y: 42}]});
    // Note: reference equality below!
    assert.strictEqual(obj2.a, obj1.a);
    assert.strictEqual(obj2.b, obj1.b);
    assert.strictEqual(obj2.e, obj1.e);
    assert.strictEqual(obj2.f, obj1.f);
  });
  it('empty path replaces the the whole object', function() {
    eq(R.assocPath([], 3, {a: 1, b: 2}), 3);
  });
  it('replaces `undefined` with a new object', function() {
    eq(R.assocPath(['foo', 'bar', 'baz'], 42, {foo: undefined}), {foo: {bar: {baz: 42}}});
  });
  it('replaces `null` with a new object', function() {
    eq(R.assocPath(['foo', 'bar', 'baz'], 42, {foo: null}), {foo: {bar: {baz: 42}}});
  });
```

> both

Reason for failing:  Ramda library supports fantasy-land

```javascript
var S = require('sanctuary');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('both', function() {
  it('combines two boolean-returning functions into one', function() {
    var even = function(x) {return x % 2 === 0;};
    var gt10 = function(x) {return x > 10;};
    var f = R.both(even, gt10);
    eq(f(8), false);
    eq(f(13), false);
    eq(f(14), true);
  });
  it('accepts functions that take multiple parameters', function() {
    var between = function(a, b, c) {return a < b && b < c;};
    var total20 = function(a, b, c) {return a + b + c === 20;};
    var f = R.both(between, total20);
    eq(f(4, 5, 11), true);
    eq(f(12, 2, 6), false);
    eq(f(5, 6, 15), false);
  });
  it('does not evaluate the second expression if the first one is false', function() {
    var F = function() { return false; };
    var Z = function() { effect = 'Z got evaluated'; };
    var effect = 'not evaluated';
    R.both(F, Z)();
    eq(effect, 'not evaluated');
  });
  it('accepts fantasy-land applicative functors', function() {
    var Just = S.Just;
    var Nothing = S.Nothing;
    eq(R.both(Just(true), Just(true)), Just(true));
    eq(R.both(Just(true), Just(false)), Just(false));
    eq(R.both(Just(true), Nothing()), Nothing());
    eq(R.both(Nothing(), Just(false)), Nothing());
    eq(R.both(Nothing(), Nothing()), Nothing());
  });
```

> chain

Reason for failing:  Ramda method passes to `chain` property if available | Ramda library supports fantasy-land

```javascript
var listXf = require('./helpers/listXf');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var _isTransformer = require('rambda/internal/_isTransformer');
describe('chain', function() {
  var intoArray = R.into([]);
  function add1(x) { return [x + 1]; }
  function dec(x) { return [x - 1]; }
  function times2(x) { return [x * 2]; }
  it('maps a function over a nested list and returns the (shallow) flattened result', function() {
    eq(R.chain(times2, [1, 2, 3, 1, 0, 10, -3, 5, 7]), [2, 4, 6, 2, 0, 20, -6, 10, 14]);
    eq(R.chain(times2, [1, 2, 3]), [2, 4, 6]);
  });
  it('does not flatten recursively', function() {
    function f(xs) {
      return xs[0] ? [xs[0]] : [];
    }
    eq(R.chain(f, [[1], [[2], 100], [], [3, [4]]]), [1, [2], 3]);
  });
  it('maps a function (a -> [b]) into a (shallow) flat result', function() {
    eq(intoArray(R.chain(times2), [1, 2, 3, 4]), [2, 4, 6, 8]);
  });
  it('interprets ((->) r) as a monad', function() {
    var h = function(r) { return r * 2; };
    var f = function(a) {
      return function(r) {
        return r + a;
      };
    };
    var bound = R.chain(f, h);
    // (>>=) :: (r -> a) -> (a -> r -> b) -> (r -> b)
    // h >>= f = \w -> f (h w) w
    eq(bound(10), (10 * 2) + 10);
    eq(R.chain(R.append, R.head)([1, 2, 3]), [1, 2, 3, 1]);
  });
  it('dispatches to objects that implement `chain`', function() {
    var obj = {x: 100, chain: function(f) { return f(this.x); }};
    eq(R.chain(add1, obj), [101]);
  });
  it('dispatches to transformer objects', function() {
    eq(_isTransformer(R.chain(add1, listXf)), true);
  });
  it('composes', function() {
    var mdouble = R.chain(times2);
    var mdec = R.chain(dec);
    eq(mdec(mdouble([10, 20, 30])), [19, 39, 59]);
  });
  it('can compose transducer-style', function() {
    var mdouble = R.chain(times2);
    var mdec = R.chain(dec);
    var xcomp = R.compose(mdec, mdouble);
    eq(intoArray(xcomp, [10, 20, 30]), [18, 38, 58]);
  });
```

> clamp

```javascript
var eq = require('./shared/eq');
var R = require('../../../../../rambda/dist/rambda');

describe('clamp', function() {
  it('clamps to the lower bound', function() {
    eq(R.clamp(1, 10, 0), 1);
    eq(R.clamp(3, 12, 1), 3);
    eq(R.clamp(-15, 3, -100), -15);
  });
  it('clamps to the upper bound', function() {
    eq(R.clamp(1, 10, 20), 10);
    eq(R.clamp(3, 12, 23), 12);
    eq(R.clamp(-15, 3, 16), 3);
  });
  it('leaves it alone when within the bound', function() {
    eq(R.clamp(1, 10, 4), 4);
    eq(R.clamp(3, 12, 6), 6);
    eq(R.clamp(-15, 3, 0), 0);
  });
  it('works with letters as well', function() {
    eq(R.clamp('d', 'n', 'f'), 'f');
    eq(R.clamp('d', 'n', 'a'), 'd');
    eq(R.clamp('d', 'n', 'q'), 'n');
  });
```

> clone

Reason for failing:  Rambda method work only with objects and arrays

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('deep clone integers, strings and booleans', function() {
  it('clones integers', function() {
    eq(R.clone(-4), -4);
    eq(R.clone(9007199254740991), 9007199254740991);
  });
  it('clones floats', function() {
    eq(R.clone(-4.5), -4.5);
    eq(R.clone(0.0), 0.0);
  });
  it('clones strings', function() {
    eq(R.clone('ramda'), 'ramda');
  });
  it('clones booleans', function() {
    eq(R.clone(true), true);
  });
describe('deep clone objects', function() {
  it('clones shallow object', function() {
    var obj = {a: 1, b: 'ramda', c: true, d: new Date(2013, 11, 25)};
    var clone = R.clone(obj);
    obj.c = false;
    obj.d.setDate(31);
    eq(clone, {a: 1, b: 'ramda', c: true, d: new Date(2013, 11, 25)});
  });
  it('clones deep object', function() {
    var obj = {a: {b: {c: 'ramda'}}};
    var clone = R.clone(obj);
    obj.a.b.c = null;
    eq(clone, {a: {b: {c: 'ramda'}}});
  });
  it('clones objects with circular references', function() {
    var x = {c: null};
    var y = {a: x};
    var z = {b: y};
    x.c = z;
    var clone = R.clone(x);
    assert.notStrictEqual(x, clone);
    assert.notStrictEqual(x.c, clone.c);
    assert.notStrictEqual(x.c.b, clone.c.b);
    assert.notStrictEqual(x.c.b.a, clone.c.b.a);
    assert.notStrictEqual(x.c.b.a.c, clone.c.b.a.c);
    eq(R.keys(clone), R.keys(x));
    eq(R.keys(clone.c), R.keys(x.c));
    eq(R.keys(clone.c.b), R.keys(x.c.b));
    eq(R.keys(clone.c.b.a), R.keys(x.c.b.a));
    eq(R.keys(clone.c.b.a.c), R.keys(x.c.b.a.c));
    x.c.b = 1;
    assert.notDeepEqual(clone.c.b, x.c.b);
  });
  it('clone instances', function() {
    var Obj = function(x) {
      this.x = x;
    };
    Obj.prototype.get = function() {
      return this.x;
    };
    Obj.prototype.set = function(x) {
      this.x = x;
    };
    var obj = new Obj(10);
    eq(obj.get(), 10);
    var clone = R.clone(obj);
    eq(clone.get(), 10);
    assert.notStrictEqual(obj, clone);
    obj.set(11);
    eq(obj.get(), 11);
    eq(clone.get(), 10);
  });
  it('only own properties be copied', function() {
    function Obj() {
      this.x = 'own property';
    }
    Obj.prototype = {
      y: 'not own property'
    };
    const obj = new Obj();
    const cloneObj = R.clone(obj);
    eq(Object.keys(obj), Object.keys(cloneObj));
  });
  it('the prototype should keep the same', function() {
    function Obj() {}
    Obj.prototype = {
      x: 'prototype property'
    };
    const obj = new Obj();
    const cloneObj = R.clone(obj);
    eq(Object.getPrototypeOf(obj), Object.getPrototypeOf(cloneObj));
  });
});
describe('deep clone arrays', function() {
  it('clones shallow arrays', function() {
    var list = [1, 2, 3];
    var clone = R.clone(list);
    list.pop();
    eq(clone, [1, 2, 3]);
  });
  it('clones deep arrays', function() {
    var list = [1, [1, 2, 3], [[[5]]]];
    var clone = R.clone(list);
    assert.notStrictEqual(list, clone);
    assert.notStrictEqual(list[2], clone[2]);
    assert.notStrictEqual(list[2][0], clone[2][0]);
    eq(clone, [1, [1, 2, 3], [[[5]]]]);
  });
});
describe('deep clone typed arrays', function() {
  it('clones Uint16Array', function() {
    var array = new Uint16Array([1, 2, 3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Uint16Array([1, 2, 3]));
  });
  it('clones Int8Array', function() {
    var array = new Int8Array([1,2,3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Int8Array([1,2,3]));
  });
  it('clones Uint8Array', function() {
    var array = new Uint8Array([1,2,3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Uint8Array([1,2,3]));
  });
  it('clones Uint8ClampedArray', function() {
    var array = new Uint8ClampedArray([1,2,3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Uint8ClampedArray([1,2,3]));
  });
  it('clones Int16Array', function() {
    var array = new Int16Array([1,2,3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Int16Array([1,2,3]));
  });
  it('clones Uint16Array', function() {
    var array = new Uint16Array([1,2,3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Uint16Array([1,2,3]));
  });
  it('clones Int32Array', function() {
    var array = new Int32Array([1,2,3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Int32Array([1,2,3]));
  });
  it('clones Uint32Array', function() {
    var array = new Uint32Array([1,2,3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Uint32Array([1,2,3]));
  });
  it('clones Float32Array', function() {
    var array = new Float32Array([1,2,3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Float32Array([1,2,3]));
  });
  it('clones Float64Array', function() {
    var array = new Float64Array([1,2,3]);
    var clone = R.clone(array);
    assert.notStrictEqual(array, clone);
    eq(clone, new Float64Array([1,2,3]));
  });
});
describe('deep clone functions', function() {
  it('keep reference to function', function() {
    var fn = function(x) { return x + x;};
    var list = [{a: fn}];
    var clone = R.clone(list);
    eq(clone[0].a(10), 20);
    eq(list[0].a, clone[0].a);
  });
});
describe('built-in types', function() {
  it('clones Date object', function() {
    var date = new Date(2014, 10, 14, 23, 59, 59, 999);
    var clone = R.clone(date);
    assert.notStrictEqual(date, clone);
    eq(clone, new Date(2014, 10, 14, 23, 59, 59, 999));
    eq(clone.getDay(), 5); // friday
  });
  it('clones RegExp object', function() {
    R.forEach(function(pattern) {
      var clone = R.clone(pattern);
      assert.notStrictEqual(clone, pattern);
      eq(clone.constructor, RegExp);
      eq(clone.source, pattern.source);
      eq(clone.global, pattern.global);
      eq(clone.ignoreCase, pattern.ignoreCase);
      eq(clone.multiline, pattern.multiline);
    }, [/x/, /x/g, /x/i, /x/m, /x/gi, /x/gm, /x/im, /x/gim]);
  });
});
describe('deep clone deep nested mixed objects', function() {
  it('clones array with objects', function() {
    var list = [{a: {b: 1}}, [{c: {d: 1}}]];
    var clone = R.clone(list);
    list[1][0] = null;
    eq(clone, [{a: {b: 1}}, [{c: {d: 1}}]]);
  });
  it('clones array with arrays', function() {
    var list = [[1], [[3]]];
    var clone = R.clone(list);
    list[1][0] = null;
    eq(clone, [[1], [[3]]]);
  });
  it('clones array with mutual ref object', function() {
    var obj = {a: 1};
    var list = [{b: obj}, {b: obj}];
    var clone = R.clone(list);
    assert.strictEqual(list[0].b, list[1].b);
    assert.strictEqual(clone[0].b, clone[1].b);
    assert.notStrictEqual(clone[0].b, list[0].b);
    assert.notStrictEqual(clone[1].b, list[1].b);
    eq(clone[0].b, {a:1});
    eq(clone[1].b, {a:1});
    obj.a = 2;
    eq(clone[0].b, {a:1});
    eq(clone[1].b, {a:1});
  });
});
describe('deep clone edge cases', function() {
  it('nulls, undefineds and empty objects and arrays', function() {
    eq(R.clone(null), null);
    eq(R.clone(undefined), undefined);
    assert.notStrictEqual(R.clone(undefined), null);
    var obj = {};
    assert.notStrictEqual(R.clone(obj), obj);
    var list = [];
    assert.notStrictEqual(R.clone(list), list);
  });
});
describe('Let `R.clone` use an arbitrary user defined `clone` method', function() {
  it('dispatches to `clone` method if present', function() {
    function ArbitraryClone(x) { this.value = x; }
    ArbitraryClone.prototype.clone = function() { return new ArbitraryClone(this.value); };
    var obj = new ArbitraryClone(42);
    var arbitraryClonedObj = R.clone(obj);
    eq(arbitraryClonedObj, new ArbitraryClone(42));
    eq(arbitraryClonedObj instanceof ArbitraryClone, true);
  });
});
```

> complement

Reason for failing:  Ramda library supports fantasy-land

```javascript
var S = require('sanctuary');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('complement', function() {
  it('creates boolean-returning function that reverses another', function() {
    var even = function(x) {return x % 2 === 0;};
    var f = R.complement(even);
    eq(f(8), false);
    eq(f(13), true);
  });
  it('accepts a function that take multiple parameters', function() {
    var between = function(a, b, c) {return a < b && b < c;};
    var f = R.complement(between);
    eq(f(4, 5, 11), false);
    eq(f(12, 2, 6), true);
  });
  it('accepts fantasy-land functors', function() {
    var Just = S.Just;
    var Nothing = S.Nothing;
    eq(R.complement(Just(true)), Just(false));
    eq(R.complement(Just(false)), Just(true));
    eq(R.complement(Nothing()), Nothing());
  });
```

> compose

Reason for failing:  Ramda method passes context to functions | Rambda composed functions have no length

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var fc = require('fast-check');
describe('compose', function() {
  it('is a variadic function', function() {
    eq(typeof R.compose, 'function');
    eq(R.compose.length, 0);
  });
  it('performs right-to-left function composition', function() {
    //  f :: (String, Number?) -> ([Number] -> [Number])
    var f = R.compose(R.map, R.multiply, parseInt);
    eq(f.length, 2);
    eq(f('10')([1, 2, 3]), [10, 20, 30]);
    eq(f('10', 2)([1, 2, 3]), [2, 4, 6]);
  });
  it('passes context to functions', function() {
    function x(val) {
      return this.x * val;
    }
    function y(val) {
      return this.y * val;
    }
    function z(val) {
      return this.z * val;
    }
    var context = {
      a: R.compose(x, y, z),
      x: 4,
      y: 2,
      z: 1
    };
    eq(context.a(5), 40);
  });
  it('throws if given no arguments', function() {
    assert.throws(
      function() { R.compose(); },
      function(err) {
        return err.constructor === Error &&
               err.message === 'compose requires at least one argument';
      }
    );
  });
  it('can be applied to one argument', function() {
    var f = function(a, b, c) { return [a, b, c]; };
    var g = R.compose(f);
    eq(g.length, 3);
    eq(g(1, 2, 3), [1, 2, 3]);
  });
describe('compose properties', function() {
  it('composes two functions', function() {
    fc.assert(fc.property(fc.func(fc.nat()), fc.func(fc.nat()), fc.nat(), function(f, g, x) {
      return R.equals(R.compose(f, g)(x), f(g(x)));
    }));
  });
  it('associative', function() {
    fc.assert(fc.property(fc.func(fc.nat()), fc.func(fc.nat()), fc.func(fc.nat()), fc.nat(), function(f, g, h, x) {
      var result = f(g(h(x)));
      return R.all(R.equals(result), [
        R.compose(f, g, h)(x),
        R.compose(f, R.compose(g, h))(x),
        R.compose(R.compose(f, g), h)(x)
      ]);
    }));
  });
```

> concat

Reason for failing:  Ramda method pass to `concat` property if present

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('concat', function() {
  var z1 = {
    x: 'z1',
    concat: function(that) { return this.x + ' ' + that.x; }
  };
  var z2 = {
    x: 'z2'
  };
  it('adds combines the elements of the two lists', function() {
    eq(R.concat(['a', 'b'], ['c', 'd']), ['a', 'b', 'c', 'd']);
    eq(R.concat([], ['c', 'd']), ['c', 'd']);
  });
  it('works on strings', function() {
    eq(R.concat('foo', 'bar'), 'foobar');
    eq(R.concat('x', ''), 'x');
    eq(R.concat('', 'x'), 'x');
    eq(R.concat('', ''), '');
  });
  it('delegates to non-String object with a concat method, as second param', function() {
    eq(R.concat(z1, z2), 'z1 z2');
  });
  it('throws if attempting to combine an array with a non-array', function() {
    assert.throws(function() { return R.concat([1], 2); }, TypeError);
  });
  it('throws if not an array, String, or object with a concat method', function() {
    assert.throws(function() { return R.concat({}, {}); }, TypeError);
  });
```

> cond

Reason for failing:  pass to transformer is not applied in Rambda method

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('cond', function() {
  it('returns a function', function() {
    eq(typeof R.cond([]), 'function');
  });
  it('returns a conditional function', function() {
    var fn = R.cond([
      [R.equals(0),   R.always('water freezes at 0°C')],
      [R.equals(100), R.always('water boils at 100°C')],
      [R.T,           function(temp) { return 'nothing special happens at ' + temp + '°C'; }]
    ]);
    eq(fn(0), 'water freezes at 0°C');
    eq(fn(50), 'nothing special happens at 50°C');
    eq(fn(100), 'water boils at 100°C');
  });
  it('returns a function which returns undefined if none of the predicates matches', function() {
    var fn = R.cond([
      [R.equals('foo'), R.always(1)],
      [R.equals('bar'), R.always(2)]
    ]);
    eq(fn('quux'), undefined);
  });
  it('predicates are tested in order', function() {
    var fn = R.cond([
      [R.T, R.always('foo')],
      [R.T, R.always('bar')],
      [R.T, R.always('baz')]
    ]);
    eq(fn(), 'foo');
  });
  it('forwards all arguments to predicates and to transformers', function() {
    var fn = R.cond([
      [function(_, x) { return x === 42; }, function() { return arguments.length; }]
    ]);
    eq(fn(21, 42, 84), 3);
  });
  it('retains highest predicate arity', function() {
    var fn = R.cond([
      [R.nAry(2, R.T), R.T],
      [R.nAry(3, R.T), R.T],
      [R.nAry(1, R.T), R.T]
    ]);
    eq(fn.length, 3);
  });
```

> converge

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('converge', function() {
  var mult = function(a, b) {return a * b;};
  var f1 = R.converge(mult, [
    function(a) { return a; },
    function(a) { return a; }
  ]);
  var f2 = R.converge(mult, [
    function(a) { return a; },
    function(a, b) { return b; }
  ]);
  var f3 = R.converge(mult, [
    function(a) { return a; },
    function(a, b, c) { return c; }
  ]);
  it('passes the results of applying the arguments individually to two separate functions into a single one', function() {
    eq(R.converge(mult, [R.add(1), R.add(3)])(2), 15); // mult(add1(2), add3(2)) = mult(3, 5) = 3 * 15;
  });
  it('returns a function with the length of the "longest" argument', function() {
    eq(f1.length, 1);
    eq(f2.length, 2);
    eq(f3.length, 3);
  });
  it('passes context to its functions', function() {
    var a = function(x) { return this.f1(x); };
    var b = function(x) { return this.f2(x); };
    var c = function(x, y) { return this.f3(x, y); };
    var d = R.converge(c, [a, b]);
    var context = {f1: R.add(1), f2: R.add(2), f3: R.add};
    eq(a.call(context, 1), 2);
    eq(b.call(context, 1), 3);
    eq(d.call(context, 1), 5);
  });
  it('returns a curried function', function() {
    eq(f2(6)(7), 42);
    eq(f3(R.__).length, 3);
  });
  it('works with empty functions list', function() {
    var fn = R.converge(function() { return arguments.length; }, []);
    eq(fn.length, 0);
    eq(fn(), 0);
  });
```

> curry

Reason for failing:  Ramda library support placeholder(R.__)

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var fc = require('fast-check');

describe('curry', function() {
  it('curries a single value', function() {
    var f = R.curry(function(a, b, c, d) {return (a + b * c) / d;}); // f(12, 3, 6, 2) == 15
    var g = f(12);
    eq(g(3, 6, 2), 15);
  });
  it('curries multiple values', function() {
    var f = R.curry(function(a, b, c, d) {return (a + b * c) / d;}); // f(12, 3, 6, 2) == 15
    var g = f(12, 3);
    eq(g(6, 2), 15);
    var h = f(12, 3, 6);
    eq(h(2), 15);
  });
  it('allows further currying of a curried function', function() {
    var f = R.curry(function(a, b, c, d) {return (a + b * c) / d;}); // f(12, 3, 6, 2) == 15
    var g = f(12);
    eq(g(3, 6, 2), 15);
    var h = g(3);
    eq(h(6, 2), 15);
    eq(g(3, 6)(2), 15);
  });
  it('properly reports the length of the curried function', function() {
    var f = R.curry(function(a, b, c, d) {return (a + b * c) / d;});
    eq(f.length, 4);
    var g = f(12);
    eq(g.length, 3);
    var h = g(3);
    eq(h.length, 2);
    eq(g(3, 6).length, 1);
  });
  it('preserves context', function() {
    var ctx = {x: 10};
    var f = function(a, b) { return a + b * this.x; };
    var g = R.curry(f);
    eq(g.call(ctx, 2, 4), 42);
    eq(g.call(ctx, 2).call(ctx, 4), 42);
  });
  it('supports R.__ placeholder', function() {
    var f = function(a, b, c) { return [a, b, c]; };
    var g = R.curry(f);
    var _ = R.__;
    eq(g(1)(2)(3), [1, 2, 3]);
    eq(g(1)(2, 3), [1, 2, 3]);
    eq(g(1, 2)(3), [1, 2, 3]);
    eq(g(1, 2, 3), [1, 2, 3]);
    eq(g(_, 2, 3)(1), [1, 2, 3]);
    eq(g(1, _, 3)(2), [1, 2, 3]);
    eq(g(1, 2, _)(3), [1, 2, 3]);
    eq(g(1, _, _)(2)(3), [1, 2, 3]);
    eq(g(_, 2, _)(1)(3), [1, 2, 3]);
    eq(g(_, _, 3)(1)(2), [1, 2, 3]);
    eq(g(1, _, _)(2, 3), [1, 2, 3]);
    eq(g(_, 2, _)(1, 3), [1, 2, 3]);
    eq(g(_, _, 3)(1, 2), [1, 2, 3]);
    eq(g(1, _, _)(_, 3)(2), [1, 2, 3]);
    eq(g(_, 2, _)(_, 3)(1), [1, 2, 3]);
    eq(g(_, _, 3)(_, 2)(1), [1, 2, 3]);
    eq(g(_, _, _)(_, _)(_)(1, 2, 3), [1, 2, 3]);
    eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3]);
  });
  it('supports @@functional/placeholder', function() {
    var f = function(a, b, c) { return [a, b, c]; };
    var g = R.curry(f);
    var _ = {'@@functional/placeholder': true, x: Math.random()};
    eq(g(1)(2)(3), [1, 2, 3]);
    eq(g(1)(2, 3), [1, 2, 3]);
    eq(g(1, 2)(3), [1, 2, 3]);
    eq(g(1, 2, 3), [1, 2, 3]);
    eq(g(_, 2, 3)(1), [1, 2, 3]);
    eq(g(1, _, 3)(2), [1, 2, 3]);
    eq(g(1, 2, _)(3), [1, 2, 3]);
    eq(g(1, _, _)(2)(3), [1, 2, 3]);
    eq(g(_, 2, _)(1)(3), [1, 2, 3]);
    eq(g(_, _, 3)(1)(2), [1, 2, 3]);
    eq(g(1, _, _)(2, 3), [1, 2, 3]);
    eq(g(_, 2, _)(1, 3), [1, 2, 3]);
    eq(g(_, _, 3)(1, 2), [1, 2, 3]);
    eq(g(1, _, _)(_, 3)(2), [1, 2, 3]);
    eq(g(_, 2, _)(_, 3)(1), [1, 2, 3]);
    eq(g(_, _, 3)(_, 2)(1), [1, 2, 3]);
    eq(g(_, _, _)(_, _)(_)(1, 2, 3), [1, 2, 3]);
    eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3]);
  });
  it('forwards extra arguments', function() {
    var f = function(a, b, c) {
      void c;
      return Array.prototype.slice.call(arguments);
    };
    var g = R.curry(f);
    eq(g(1, 2, 3), [1, 2, 3]);
    eq(g(1, 2, 3, 4), [1, 2, 3, 4]);
    eq(g(1, 2)(3, 4), [1, 2, 3, 4]);
    eq(g(1)(2, 3, 4), [1, 2, 3, 4]);
    eq(g(1)(2)(3, 4), [1, 2, 3, 4]);
  });
});
describe('curry properties', function() {
  it('curries multiple values', function() {
    fc.assert(fc.property(fc.func(fc.anything()), fc.anything(), fc.anything(), fc.anything(), fc.anything(), function(f, a, b, c, d) {
      var f4 = function(a, b, c, d) {
        return f(a, b, c, d);
      };
      var g = R.curry(f4);
      return R.all(R.equals(f4(a, b, c, d)), [
        g(a, b, c, d),
        g(a)(b)(c)(d),
        g(a)(b, c, d),
        g(a, b)(c, d),
        g(a, b, c)(d)
      ]);
    }));
  });
  it('curries with placeholder', function() {
    fc.assert(fc.property(fc.func(fc.anything()), fc.anything(), fc.anything(), fc.anything(), function(f, a, b, c) {
      var _ = {'@@functional/placeholder': true, x: Math.random()};
      var f3 = function(a, b, c) {
        return f(a, b, c);
      };
      var g = R.curry(f3);
      return R.all(R.equals(f3(a, b, c)), [
        g(_, _, c)(a, b),
        g(a, _, c)(b),
        g(_, b, c)(a),
        g(a, _, _)(_, c)(b),
        g(a, b, _)(c)
      ]);
    }));
  });
});
```

> curryN

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('curryN', function() {
  function source(a, b, c, d) {
    void d;
    return a * b * c;
  }
  it('accepts an arity', function() {
    var curried = R.curryN(3, source);
    eq(curried(1)(2)(3), 6);
    eq(curried(1, 2)(3), 6);
    eq(curried(1)(2, 3), 6);
    eq(curried(1, 2, 3), 6);
  });
  it('can be partially applied', function() {
    var curry3 = R.curryN(3);
    var curried = curry3(source);
    eq(curried.length, 3);
    eq(curried(1)(2)(3), 6);
    eq(curried(1, 2)(3), 6);
    eq(curried(1)(2, 3), 6);
    eq(curried(1, 2, 3), 6);
  });
  it('preserves context', function() {
    var ctx = {x: 10};
    var f = function(a, b) { return a + b * this.x; };
    var g = R.curryN(2, f);
    eq(g.call(ctx, 2, 4), 42);
    eq(g.call(ctx, 2).call(ctx, 4), 42);
  });
  it('supports R.__ placeholder', function() {
    var f = function() { return Array.prototype.slice.call(arguments); };
    var g = R.curryN(3, f);
    var _ = R.__;
    eq(g(1)(2)(3), [1, 2, 3]);
    eq(g(1)(2, 3), [1, 2, 3]);
    eq(g(1, 2)(3), [1, 2, 3]);
    eq(g(1, 2, 3), [1, 2, 3]);
    eq(g(_, 2, 3)(1), [1, 2, 3]);
    eq(g(1, _, 3)(2), [1, 2, 3]);
    eq(g(1, 2, _)(3), [1, 2, 3]);
    eq(g(1, _, _)(2)(3), [1, 2, 3]);
    eq(g(_, 2, _)(1)(3), [1, 2, 3]);
    eq(g(_, _, 3)(1)(2), [1, 2, 3]);
    eq(g(1, _, _)(2, 3), [1, 2, 3]);
    eq(g(_, 2, _)(1, 3), [1, 2, 3]);
    eq(g(_, _, 3)(1, 2), [1, 2, 3]);
    eq(g(1, _, _)(_, 3)(2), [1, 2, 3]);
    eq(g(_, 2, _)(_, 3)(1), [1, 2, 3]);
    eq(g(_, _, 3)(_, 2)(1), [1, 2, 3]);
    eq(g(_, _, _)(_, _)(_)(1, 2, 3), [1, 2, 3]);
    eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3]);
  });
  it('supports @@functional/placeholder', function() {
    var f = function() { return Array.prototype.slice.call(arguments); };
    var g = R.curryN(3, f);
    var _ = {'@@functional/placeholder': true, x: Math.random()};
    eq(g(1)(2)(3), [1, 2, 3]);
    eq(g(1)(2, 3), [1, 2, 3]);
    eq(g(1, 2)(3), [1, 2, 3]);
    eq(g(1, 2, 3), [1, 2, 3]);
    eq(g(_, 2, 3)(1), [1, 2, 3]);
    eq(g(1, _, 3)(2), [1, 2, 3]);
    eq(g(1, 2, _)(3), [1, 2, 3]);
    eq(g(1, _, _)(2)(3), [1, 2, 3]);
    eq(g(_, 2, _)(1)(3), [1, 2, 3]);
    eq(g(_, _, 3)(1)(2), [1, 2, 3]);
    eq(g(1, _, _)(2, 3), [1, 2, 3]);
    eq(g(_, 2, _)(1, 3), [1, 2, 3]);
    eq(g(_, _, 3)(1, 2), [1, 2, 3]);
    eq(g(1, _, _)(_, 3)(2), [1, 2, 3]);
    eq(g(_, 2, _)(_, 3)(1), [1, 2, 3]);
    eq(g(_, _, 3)(_, 2)(1), [1, 2, 3]);
    eq(g(_, _, _)(_, _)(_)(1, 2, 3), [1, 2, 3]);
    eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3]);
  });
  it('forwards extra arguments', function() {
    var f = function() { return Array.prototype.slice.call(arguments); };
    var g = R.curryN(3, f);
    eq(g(1, 2, 3), [1, 2, 3]);
    eq(g(1, 2, 3, 4), [1, 2, 3, 4]);
    eq(g(1, 2)(3, 4), [1, 2, 3, 4]);
    eq(g(1)(2, 3, 4), [1, 2, 3, 4]);
    eq(g(1)(2)(3, 4), [1, 2, 3, 4]);
  });
});
```

> dec

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('dec', function() {
  it('decrements its argument', function() {
    eq(R.dec(-1), -2);
    eq(R.dec(0), -1);
    eq(R.dec(1), 0);
    eq(R.dec(12.34), 11.34);
    eq(R.dec(-Infinity), -Infinity);
    eq(R.dec(Infinity), Infinity);
  });
```

> defaultTo

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('defaultTo', function() {
  var defaultTo42 = R.defaultTo(42);
  it('returns the default value if input is null, undefined or NaN', function() {
    eq(42, defaultTo42(null));
    eq(42, defaultTo42(undefined));
    eq(42, defaultTo42(NaN));
  });
  it('returns the input value if it is not null/undefined', function() {
    eq('a real value', defaultTo42('a real value'));
  });
  it('returns the input value even if it is considered falsy', function() {
    eq('', defaultTo42(''));
    eq(0, defaultTo42(0));
    eq(false, defaultTo42(false));
    eq([], defaultTo42([]));
  });
  it('can be called with both arguments directly', function() {
    eq(42, R.defaultTo(42, null));
    eq('a real value', R.defaultTo(42, 'a real value'));
  });
```

> difference

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('difference', function() {
  var M = [1, 2, 3, 4];
  var M2 = [1, 2, 3, 4, 1, 2, 3, 4];
  var N = [3, 4, 5, 6];
  var N2 = [3, 3, 4, 4, 5, 5, 6, 6];
  var Z = [3, 4, 5, 6, 10];
  var Z2 = [1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8];
  it('finds the set of all elements in the first list not contained in the second', function() {
    eq(R.difference(M, N), [1, 2]);
  });
  it('does not allow duplicates in the output even if the input lists had duplicates', function() {
    eq(R.difference(M2, N2), [1, 2]);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.difference([0], [-0]).length, 1);
    eq(R.difference([-0], [0]).length, 1);
    eq(R.difference([NaN], [NaN]).length, 0);
    eq(R.difference([new Just([42])], [new Just([42])]).length, 0);
  });
  it('works for arrays of different lengths', function() {
    eq(R.difference(Z, Z2), [10]);
    eq(R.difference(Z2, Z), [1, 2, 7, 8]);
  });
  it('will not create a "sparse" array', function() {
    eq(R.difference(M2, [3]).length, 3);
  });
  it('returns an empty array if there are no different elements', function() {
    eq(R.difference(M2, M), []);
    eq(R.difference(M, M2), []);
    eq(R.difference([], M2), []);
  });
```

> dissoc

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var assert = require('assert');

describe('dissoc', function() {
  it('copies an object omitting the specified property', function() {
    eq(R.dissoc('b', {a: 1, b: 2, c: 3}), {a: 1, c: 3});
    eq(R.dissoc('d', {a: 1, b: 2, c: 3}), {a: 1, b: 2, c: 3});
    eq(R.dissoc('c', {a: 1, b: 2, c: null}), {a: 1, b: 2});
    eq(R.dissoc('c', {a: 1, b: 2, c: undefined}), {a: 1, b: 2});
    var obj1 = {a: 1, b: 2};
    var obj2 = R.dissoc('c', obj1);
    eq(obj2, obj1);
    // Note: reference equality below!
    assert.notStrictEqual(obj2, obj1);
  });
  it('makes a shallow clone of an array, remove only the specified index', function() {
    var ary1 = [1, [2, 3], 4, 5];
    var ary2 = R.dissoc(2, ary1);
    var ary3 = R.dissoc(4, ary1);
    eq(ary2, [1, [2, 3], 5]);
    eq(ary3, [1, [2, 3], 4, 5]);
    // Note: reference equality below!
    assert.strictEqual(ary2[0], ary1[0]);
    assert.strictEqual(ary2[1], ary1[1]);
    assert.strictEqual(ary2[2], ary1[3]);
    assert.notStrictEqual(ary3, ary1);
    assert.strictEqual(ary3[0], ary1[0]);
    assert.strictEqual(ary3[1], ary1[1]);
    assert.strictEqual(ary3[2], ary1[2]);
    assert.strictEqual(ary3[3], ary1[3]);
  });
  it('includes prototype properties', function() {
    function Rectangle(width, height) {
      this.width = width;
      this.height = height;
    }
    var area = Rectangle.prototype.area = function() {
      return this.width * this.height;
    };
    var rect = new Rectangle(7, 6);
    eq(R.dissoc('area', rect), {width: 7, height: 6});
    eq(R.dissoc('width', rect), {height: 6, area: area});
    eq(R.dissoc('depth', rect), {width: 7, height: 6, area: area});
  });
  it('coerces non-string types', function() {
    eq(R.dissoc(42, {a: 1, b: 2, 42: 3}), {a: 1, b: 2});
    eq(R.dissoc(null, {a: 1, b: 2, 'null': 3}), {a: 1, b: 2});
    eq(R.dissoc(undefined, {a: 1, b: 2, undefined: 3}), {a: 1, b: 2});
  });
```

> divide

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('divide', function() {
  it('divides two numbers', function() {
    eq(R.divide(28, 7), 4);
  });
```

> drop

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('drop', function() {
  it('skips the first `n` elements from a list, returning the remainder', function() {
    eq(R.drop(3, ['a', 'b', 'c', 'd', 'e', 'f', 'g']), ['d', 'e', 'f', 'g']);
  });
  it('returns an empty array if `n` is too large', function() {
    eq(R.drop(20, ['a', 'b', 'c', 'd', 'e', 'f', 'g']), []);
  });
  it('returns an equivalent list if `n` is <= 0', function() {
    eq(R.drop(0, [1, 2, 3]), [1, 2, 3]);
    eq(R.drop(-1, [1, 2, 3]), [1, 2, 3]);
    eq(R.drop(-Infinity, [1, 2, 3]), [1, 2, 3]);
  });
  it('never returns the input array', function() {
    var xs = [1, 2, 3];
    assert.notStrictEqual(R.drop(0, xs), xs);
    assert.notStrictEqual(R.drop(-1, xs), xs);
  });
  it('can operate on strings', function() {
    eq(R.drop(3, 'Ramda'), 'da');
    eq(R.drop(4, 'Ramda'), 'a');
    eq(R.drop(5, 'Ramda'), '');
    eq(R.drop(6, 'Ramda'), '');
  });
```

> dropLast

Reason for failing:  Ramda method can act as a transducer

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('dropLast', function() {
  it('skips the last `n` elements from a list, returning the remainder', function() {
    eq(R.dropLast(3, ['a', 'b', 'c', 'd', 'e', 'f', 'g']), ['a', 'b', 'c', 'd']);
  });
  it('returns an empty array if `n` is too large', function() {
    eq(R.dropLast(20, ['a', 'b', 'c', 'd', 'e', 'f', 'g']), []);
  });
  it('returns an equivalent list if `n` is <= 0', function() {
    eq(R.dropLast(0, [1, 2, 3]), [1, 2, 3]);
    eq(R.dropLast(-1, [1, 2, 3]), [1, 2, 3]);
    eq(R.dropLast(-Infinity, [1, 2, 3]), [1, 2, 3]);
  });
  it('never returns the input array', function() {
    var xs = [1, 2, 3];
    assert.notStrictEqual(R.dropLast(0, xs), xs);
    assert.notStrictEqual(R.dropLast(-1, xs), xs);
  });
  it('can operate on strings', function() {
    eq(R.dropLast(3, 'Ramda'), 'Ra');
  });
  it('can act as a transducer', function() {
    var dropLast2 = R.dropLast(2);
    assert.deepEqual(R.into([], dropLast2, [1, 3, 5, 7, 9, 1, 2]), [1, 3, 5, 7, 9]);
    assert.deepEqual(R.into([], dropLast2, [1]), []);
  });
```

> dropLastWhile

Reason for failing:  Ramda method can act as a transducer

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('dropLastWhile', function() {
  it('skips elements while the function reports `true`', function() {
    eq(R.dropLastWhile(function(x) {return x >= 5;}, [1, 3, 5, 7, 9]), [1, 3]);
  });
  it('returns an empty list for an empty list', function() {
    eq(R.dropLastWhile(function() { return false; }, []), []);
    eq(R.dropLastWhile(function() { return true; }, []), []);
  });
  it('starts at the right arg and acknowledges undefined', function() {
    var sublist = R.dropLastWhile(function(x) {return x !== void 0;}, [1, 3, void 0, 5, 7]);
    eq(sublist.length, 3);
    eq(sublist[0], 1);
    eq(sublist[1], 3);
    eq(sublist[2], void 0);
  });
  it('can operate on strings', function() {
    eq(R.dropLastWhile(function(x) { return x !== 'd'; }, 'Ramda'), 'Ramd');
  });
  it('can act as a transducer', function() {
    var dropLt7 = R.dropLastWhile(function(x) {return x < 7;});
    eq(R.into([], dropLt7, [1, 3, 5, 7, 9, 1, 2]), [1, 3, 5, 7, 9]);
    eq(R.into([], dropLt7, [1, 3, 5]), []);
  });
```

> dropRepeats

Reason for failing:  Ramda method can act as a transducer

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('dropRepeats', function() {
  var objs = [1, 2, 3, 4, 5, 3, 2];
  var objs2 = [1, 2, 2, 2, 3, 4, 4, 5, 5, 3, 2, 2];
  it('removes repeated elements', function() {
    eq(R.dropRepeats(objs2), objs);
    eq(R.dropRepeats(objs), objs);
  });
  it('returns an empty array for an empty array', function() {
    eq(R.dropRepeats([]), []);
  });
  it('can act as a transducer', function() {
    eq(R.into([], R.dropRepeats, objs2), objs);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.dropRepeats([0, -0]).length, 2);
    eq(R.dropRepeats([-0, 0]).length, 2);
    eq(R.dropRepeats([NaN, NaN]).length, 1);
    eq(R.dropRepeats([new Just([42]), new Just([42])]).length, 1);
  });
```

> dropRepeatsWith

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('dropRepeatsWith', function() {
  var objs = [
    {i: 1}, {i: 2}, {i: 3}, {i: 4}, {i: 5}, {i: 3}
  ];
  var objs2 = [
    {i: 1}, {i: 1}, {i: 1}, {i: 2}, {i: 3},
    {i: 3}, {i: 4}, {i: 4}, {i: 5}, {i: 3}
  ];
  var eqI = R.eqProps('i');
  it('removes repeated elements based on predicate', function() {
    eq(R.dropRepeatsWith(eqI, objs2), objs);
    eq(R.dropRepeatsWith(eqI, objs), objs);
  });
  it('keeps elements from the left', function() {
    eq(
      R.dropRepeatsWith(eqI, [{i: 1, n: 1}, {i: 1, n: 2}, {i: 1, n: 3}, {i: 4, n: 1}, {i: 4, n: 2}]),
      [{i: 1, n: 1}, {i: 4, n: 1}]
    );
  });
  it('returns an empty array for an empty array', function() {
    eq(R.dropRepeatsWith(eqI, []), []);
  });
  it('can act as a transducer', function() {
    eq(R.into([], R.dropRepeatsWith(eqI), objs2), objs);
  });
```

> dropWhile

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('dropWhile', function() {
  it('skips elements while the function reports `true`', function() {
    eq(R.dropWhile(function(x) {return x < 5;}, [1, 3, 5, 7, 9]), [5, 7, 9]);
  });
  it('returns an empty list for an empty list', function() {
    eq(R.dropWhile(function() { return false; }, []), []);
    eq(R.dropWhile(function() { return true; }, []), []);
  });
  it('starts at the right arg and acknowledges undefined', function() {
    var sublist = R.dropWhile(function(x) {return x !== void 0;}, [1, 3, void 0, 5, 7]);
    eq(sublist.length, 3);
    eq(sublist[0], void 0);
    eq(sublist[1], 5);
    eq(sublist[2], 7);
  });
  it('can operate on strings', function() {
    eq(R.dropWhile(function(x) { return x !== 'd'; }, 'Ramda'), 'da');
  });
```

> either

Reason for failing:  Ramda library supports fantasy-land

```javascript
var S = require('sanctuary');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('either', function() {
  it('combines two boolean-returning functions into one', function() {
    var even = function(x) {return x % 2 === 0;};
    var gt10 = function(x) {return x > 10;};
    var f = R.either(even, gt10);
    eq(f(8), true);
    eq(f(13), true);
    eq(f(7), false);
  });
  it('accepts functions that take multiple parameters', function() {
    var between = function(a, b, c) {return a < b && b < c;};
    var total20 = function(a, b, c) {return a + b + c === 20;};
    var f = R.either(between, total20);
    eq(f(4, 5, 8), true);
    eq(f(12, 2, 6), true);
    eq(f(7, 5, 1), false);
  });
  it('does not evaluate the second expression if the first one is true', function() {
    var T = function() { return true; };
    var Z = function() { effect = 'Z got evaluated'; };
    var effect = 'not evaluated';
    R.either(T, Z)();
    eq(effect, 'not evaluated');
  });
  it('accepts fantasy-land applicative functors', function() {
    var Just = S.Just;
    var Nothing = S.Nothing;
    eq(R.either(Just(true), Just(true)), Just(true));
    eq(R.either(Just(true), Just(false)), Just(true));
    eq(R.either(Just(false), Just(false)), Just(false));
    eq(R.either(Just(true), Nothing()), Nothing());
    eq(R.either(Nothing(), Just(false)), Nothing());
    eq(R.either(Nothing(), Nothing()), Nothing());
  });
```

> endsWith

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('endsWith', function() {
  it('should return true when a string ends with the provided value', function() {
    eq(R.endsWith('c', 'abc'), true);
  });
  it('should return true when a long string ends with the provided value', function() {
    eq(R.endsWith('ology', 'astrology'), true);
  });
  it('should return false when a string does not end with the provided value', function() {
    eq(R.endsWith('b', 'abc'), false);
  });
  it('should return false when a long string does not end with the provided value', function() {
    eq(R.endsWith('olog', 'astrology'), false);
  });
  it('should return true when an array ends with the provided value', function() {
    eq(R.endsWith(['c'], ['a', 'b', 'c']), true);
  });
  it('should return true when an array ends with the provided values', function() {
    eq(R.endsWith(['b', 'c'], ['a', 'b', 'c']), true);
  });
  it('should return false when an array does not end with the provided value', function() {
    eq(R.endsWith(['b'], ['a', 'b', 'c']), false);
  });
  it('should return false when an array does not end with the provided values', function() {
    eq(R.endsWith(['a', 'b'], ['a', 'b', 'c']), false);
  });
```

> eqProps

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('eqProps', function() {
  it('reports whether two objects have the same value for a given property', function() {
    eq(R.eqProps('name', {name: 'fred', age: 10}, {name: 'fred', age: 12}), true);
    eq(R.eqProps('name', {name: 'fred', age: 10}, {name: 'franny', age: 10}), false);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.eqProps('value', {value: 0}, {value: -0}), false);
    eq(R.eqProps('value', {value: -0}, {value: 0}), false);
    eq(R.eqProps('value', {value: NaN}, {value: NaN}), true);
    eq(R.eqProps('value', {value: new Just([42])}, {value: new Just([42])}), true);
  });
```

> equals

Reason for failing:  Rambda method doesn't support recursive data structures, objects with same enumerable properties, map/weakmap type of variables | Ramda dispatches to `equals` method recursively | Rambda method doesn't support equality of functions

```javascript
/* global Map, Set, WeakMap, WeakSet */

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var fc = require('fast-check');
describe('equals', function() {
  var a = [];
  var b = a;
  it('tests for deep equality of its operands', function() {
    eq(R.equals(100, 100), true);
    eq(R.equals(100, '100'), false);
    eq(R.equals([], []), true);
    eq(R.equals(a, b), true);
  });
  it('considers equal Boolean primitives equal', function() {
    eq(R.equals(true, true), true);
    eq(R.equals(false, false), true);
    eq(R.equals(true, false), false);
    eq(R.equals(false, true), false);
  });
  it('considers equivalent Boolean objects equal', function() {
    eq(R.equals(new Boolean(true), new Boolean(true)), true);
    eq(R.equals(new Boolean(false), new Boolean(false)), true);
    eq(R.equals(new Boolean(true), new Boolean(false)), false);
    eq(R.equals(new Boolean(false), new Boolean(true)), false);
  });
  it('never considers Boolean primitive equal to Boolean object', function() {
    eq(R.equals(true, new Boolean(true)), false);
    eq(R.equals(new Boolean(true), true), false);
    eq(R.equals(false, new Boolean(false)), false);
    eq(R.equals(new Boolean(false), false), false);
  });
  it('considers equal number primitives equal', function() {
    eq(R.equals(0, 0), true);
    eq(R.equals(0, 1), false);
    eq(R.equals(1, 0), false);
  });
  it('considers equivalent Number objects equal', function() {
    eq(R.equals(new Number(0), new Number(0)), true);
    eq(R.equals(new Number(0), new Number(1)), false);
    eq(R.equals(new Number(1), new Number(0)), false);
  });
  it('never considers number primitive equal to Number object', function() {
    eq(R.equals(0, new Number(0)), false);
    eq(R.equals(new Number(0), 0), false);
  });
  it('considers equal string primitives equal', function() {
    eq(R.equals('', ''), true);
    eq(R.equals('', 'x'), false);
    eq(R.equals('x', ''), false);
    eq(R.equals('foo', 'foo'), true);
    eq(R.equals('foo', 'bar'), false);
    eq(R.equals('bar', 'foo'), false);
  });
  it('considers equivalent String objects equal', function() {
    eq(R.equals(new String(''), new String('')), true);
    eq(R.equals(new String(''), new String('x')), false);
    eq(R.equals(new String('x'), new String('')), false);
    eq(R.equals(new String('foo'), new String('foo')), true);
    eq(R.equals(new String('foo'), new String('bar')), false);
    eq(R.equals(new String('bar'), new String('foo')), false);
  });
  it('never considers string primitive equal to String object', function() {
    eq(R.equals('', new String('')), false);
    eq(R.equals(new String(''), ''), false);
    eq(R.equals('x', new String('x')), false);
    eq(R.equals(new String('x'), 'x'), false);
  });
  it('handles objects', function() {
    eq(R.equals({}, {}), true);
    eq(R.equals({a:1, b:2}, {a:1, b:2}), true);
    eq(R.equals({a:2, b:3}, {b:3, a:2}), true);
    eq(R.equals({a:2, b:3}, {a:3, b:3}), false);
    eq(R.equals({a:2, b:3, c:1}, {a:2, b:3}), false);
  });
  it('considers equivalent Arguments objects equal', function() {
    var a = (function() { return arguments; }());
    var b = (function() { return arguments; }());
    var c = (function() { return arguments; }(1, 2, 3));
    var d = (function() { return arguments; }(1, 2, 3));
    eq(R.equals(a, b), true);
    eq(R.equals(b, a), true);
    eq(R.equals(c, d), true);
    eq(R.equals(d, c), true);
    eq(R.equals(a, c), false);
    eq(R.equals(c, a), false);
  });
  it('considers equivalent Error objects equal', function() {
    eq(R.equals(new Error('XXX'), new Error('XXX')), true);
    eq(R.equals(new Error('XXX'), new Error('YYY')), false);
    eq(R.equals(new Error('XXX'), new TypeError('XXX')), false);
    eq(R.equals(new Error('XXX'), new TypeError('YYY')), false);
  });
  var supportsSticky = false;
  try { RegExp('', 'y'); supportsSticky = true; } catch (e) {}
  var supportsUnicode = false;
  try { RegExp('', 'u'); supportsUnicode = true; } catch (e) {}
  it('handles regex', function() {
    eq(R.equals(/\s/, /\s/), true);
    eq(R.equals(/\s/, /\d/), false);
    eq(R.equals(/a/gi, /a/ig), true);
    eq(R.equals(/a/mgi, /a/img), true);
    eq(R.equals(/a/gi, /a/i), false);
    if (supportsSticky) {
      // eq(R.equals(/\s/y, /\s/y), true);
      // eq(R.equals(/a/mygi, /a/imgy), true);
    }
    if (supportsUnicode) {
      // eq(R.equals(/\s/u, /\s/u), true);
      // eq(R.equals(/a/mugi, /a/imgu), true);
    }
  });
  var listA = [1, 2, 3];
  var listB = [1, 3, 2];
  it('handles lists', function() {
    eq(R.equals([], {}), false);
    eq(R.equals(listA, listB), false);
  });
  var c = {}; c.v = c;
  var d = {}; d.v = d;
  var e = []; e.push(e);
  var f = []; f.push(f);
  var nestA = {a:[1, 2, {c:1}], b:1};
  var nestB = {a:[1, 2, {c:1}], b:1};
  var nestC = {a:[1, 2, {c:2}], b:1};
  it('handles recursive data structures', function() {
    eq(R.equals(c, d), true);
    eq(R.equals(e, f), true);
    eq(R.equals(nestA, nestB), true);
    eq(R.equals(nestA, nestC), false);
  });
  it('handles dates', function() {
    eq(R.equals(new Date(0), new Date(0)), true);
    eq(R.equals(new Date(1), new Date(1)), true);
    eq(R.equals(new Date(0), new Date(1)), false);
    eq(R.equals(new Date(1), new Date(0)), false);
  });
  it('requires that both objects have the same enumerable properties with the same values', function() {
    var a1 = [];
    var a2 = [];
    a2.x = 0;
    var b1 = new Boolean(false);
    var b2 = new Boolean(false);
    b2.x = 0;
    var d1 = new Date(0);
    var d2 = new Date(0);
    d2.x = 0;
    var n1 = new Number(0);
    var n2 = new Number(0);
    n2.x = 0;
    var r1 = /(?:)/;
    var r2 = /(?:)/;
    r2.x = 0;
    var s1 = new String('');
    var s2 = new String('');
    s2.x = 0;
    eq(R.equals(a1, a2), false);
    eq(R.equals(b1, b2), false);
    eq(R.equals(d1, d2), false);
    eq(R.equals(n1, n2), false);
    eq(R.equals(r1, r2), false);
    eq(R.equals(s1, s2), false);
  });
  if (typeof ArrayBuffer !== 'undefined' && typeof Int8Array !== 'undefined') {
    var typArr1 = new ArrayBuffer(10);
    typArr1[0] = 1;
    var typArr2 = new ArrayBuffer(10);
    typArr2[0] = 1;
    var typArr3 = new ArrayBuffer(10);
    var intTypArr = new Int8Array(typArr1);
    typArr3[0] = 0;
    it('handles typed arrays', function() {
      eq(R.equals(typArr1, typArr2), true);
      eq(R.equals(typArr1, typArr3), false);
      eq(R.equals(typArr1, intTypArr), false);
    });
  }
  if (typeof Promise !== 'undefined') {
    it('compares Promise objects by identity', function() {
      var p = Promise.resolve(42);
      var q = Promise.resolve(42);
      eq(R.equals(p, p), true);
      eq(R.equals(p, q), false);
  }
  if (typeof Map !== 'undefined') {
    it('compares Map objects by value', function() {
      eq(R.equals(new Map([]), new Map([])), true);
      eq(R.equals(new Map([]), new Map([[1, 'a']])), false);
      eq(R.equals(new Map([[1, 'a']]), new Map([])), false);
      eq(R.equals(new Map([[1, 'a']]), new Map([[1, 'a']])), true);
      eq(R.equals(new Map([[1, 'a'], [2, 'b']]), new Map([[2, 'b'], [1, 'a']])), true);
      eq(R.equals(new Map([[1, 'a']]), new Map([[2, 'a']])), false);
      eq(R.equals(new Map([[1, 'a']]), new Map([[1, 'b']])), false);
      eq(R.equals(new Map([[1, 'a'], [2, new Map([[3, 'c']])]]), new Map([[1, 'a'], [2, new Map([[3, 'c']])]])), true);
      eq(R.equals(new Map([[1, 'a'], [2, new Map([[3, 'c']])]]), new Map([[1, 'a'], [2, new Map([[3, 'd']])]])), false);
      eq(R.equals(new Map([[[1, 2, 3], [4, 5, 6]]]), new Map([[[1, 2, 3], [4, 5, 6]]])), true);
      eq(R.equals(new Map([[[1, 2, 3], [4, 5, 6]]]), new Map([[[1, 2, 3], [7, 8, 9]]])), false);
    it('dispatches to `equals` method recursively in Set', function() {
      var a = new Map();
      var b = new Map();
      a.set(a, a);
      eq(R.equals(a, b), false);
      a.set(b, b);
      b.set(b, b);
      b.set(a, a);
      eq(R.equals(a, b), true);
  }
  if (typeof Set !== 'undefined') {
    it('compares Set objects by value', function() {
      eq(R.equals(new Set([]), new Set([])), true);
      eq(R.equals(new Set([]), new Set([1])), false);
      eq(R.equals(new Set([1]), new Set([])), false);
      eq(R.equals(new Set([1, 2]), new Set([2, 1])), true);
      eq(R.equals(new Set([1, new Set([2, new Set([3])])]), new Set([1, new Set([2, new Set([3])])])), true);
      eq(R.equals(new Set([1, new Set([2, new Set([3])])]), new Set([1, new Set([2, new Set([4])])])), false);
      eq(R.equals(new Set([[1, 2, 3], [4, 5, 6]]), new Set([[1, 2, 3], [4, 5, 6]])), true);
      eq(R.equals(new Set([[1, 2, 3], [4, 5, 6]]), new Set([[1, 2, 3], [7, 8, 9]])), false);
    it('dispatches to `equals` method recursively in Set', function() {
      var a = new Set();
      var b = new Set();
      a.add(a);
      eq(R.equals(a, b), false);
      a.add(b);
      b.add(b);
      b.add(a);
      eq(R.equals(a, b), true);
  }
  if (typeof WeakMap !== 'undefined') {
    it('compares WeakMap objects by identity', function() {
      var m = new WeakMap([]);
      eq(R.equals(m, m), true);
      eq(R.equals(m, new WeakMap([])), false);
  }
  if (typeof WeakSet !== 'undefined') {
    it('compares WeakSet objects by identity', function() {
      var s = new WeakSet([]);
      eq(R.equals(s, s), true);
      eq(R.equals(s, new WeakSet([])), false);
  }
  it('dispatches to `equals` method recursively', function() {
    function Left(x) { this.value = x; }
    Left.prototype.equals = function(x) {
      return x instanceof Left && R.equals(x.value, this.value);
    };
    function Right(x) { this.value = x; }
    Right.prototype.equals = function(x) {
      return x instanceof Right && R.equals(x.value, this.value);
    };
    eq(R.equals(new Left([42]), new Left([42])), true);
    eq(R.equals(new Left([42]), new Left([43])), false);
    eq(R.equals(new Left(42), {value: 42}), false);
    eq(R.equals({value: 42}, new Left(42)), false);
    eq(R.equals(new Left(42), new Right(42)), false);
    eq(R.equals(new Right(42), new Left(42)), false);
    eq(R.equals([new Left(42)], [new Left(42)]), true);
    eq(R.equals([new Left(42)], [new Right(42)]), false);
    eq(R.equals([new Right(42)], [new Left(42)]), false);
    eq(R.equals([new Right(42)], [new Right(42)]), true);
  });
  it('is commutative', function() {
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }
    Point.prototype.equals = function(point) {
      return point instanceof Point &&
             this.x === point.x && this.y === point.y;
    };
    function ColorPoint(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
    }
    ColorPoint.prototype = new Point(0, 0);
    ColorPoint.prototype.equals = function(point) {
      return point instanceof ColorPoint &&
             this.x === point.x && this.y === point.y &&
             this.color === point.color;
    };
    eq(R.equals(new Point(2, 2), new ColorPoint(2, 2, 'red')), false);
    eq(R.equals(new ColorPoint(2, 2, 'red'), new Point(2, 2)), false);
  });
  // Arbitrary configured to produce any kind of values
  // from simple numbers to complex objects
  const anythingInstanceArb = fc.anything({
    withBoxedValues: true, // eg.: new Number(1), ...
    withNullPrototype: true, // eg.: Object.create(null), ...
    withObjectString: true, // eg.: "{}", "null", ...
    withMap: typeof Map !== 'undefined',
    withSet: typeof Set !== 'undefined'
  });
  it('perfect clones should be considered equal', function() {
    fc.assert(fc.property(fc.clone(anythingInstanceArb, 2), function(values) {
      eq(R.equals(values[0], values[1]), true);
    }));
  });
  it('is commutative whatever the values', function() {
    fc.assert(fc.property(anythingInstanceArb, anythingInstanceArb, function(v1, v2) {
      eq(R.equals(v1, v2), R.equals(v2, v1));
    }));
  });
});
```

> evolve

Reason for failing:  Rambda throws if `iterable` input is neither array nor object

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('evolve', function() {
  it('creates a new object by evolving the `object` according to the `transformation` functions', function() {
    var transf   = {elapsed: R.add(1), remaining: R.add(-1)};
    var object   = {name: 'Tomato', elapsed: 100, remaining: 1400};
    var expected = {name: 'Tomato', elapsed: 101, remaining: 1399};
    eq(R.evolve(transf, object), expected);
  });
  it('does not invoke function if object does not contain the key', function() {
    var transf   = {n: R.add(1), m: R.add(1)};
    var object   = {m: 3};
    var expected = {m: 4};
    eq(R.evolve(transf, object), expected);
  });
  it('is not destructive', function() {
    var transf   = {elapsed: R.add(1), remaining: R.add(-1)};
    var object   = {name: 'Tomato', elapsed: 100, remaining: 1400};
    var expected = {name: 'Tomato', elapsed: 100, remaining: 1400};
    R.evolve(transf, object);
    eq(object, expected);
  });
  it('is recursive', function() {
    var transf   = {nested: {second: R.add(-1), third: R.add(1)}};
    var object   = {first: 1, nested: {second: 2, third: 3}};
    var expected = {first: 1, nested: {second: 1, third: 4}};
    eq(R.evolve(transf, object), expected);
  });
  it('ignores primitive value transformations', function() {
    var transf   = {n: 2, m: 'foo'};
    var object   = {n: 0, m: 1};
    var expected = {n: 0, m: 1};
    eq(R.evolve(transf, object), expected);
  });
  it('ignores null transformations', function() {
    var transf   = {n: null};
    var object   = {n: 0};
    var expected = {n: 0};
    eq(R.evolve(transf, object), expected);
  });
  it('creates a new array by evolving the `array` according to the `transformation` functions', function() {
    var transf   = [R.add(1), R.add(-1)];
    var object   = [100, 1400];
    var expected = [101, 1399];
    eq(R.evolve(transf, object), expected);
  });
  it('ignores transformations if the input value is not Array and Object', function() {
    var transf   = { a: R.add(1) };
    eq(R.evolve(transf, 42), 42);
    eq(R.evolve(transf, undefined), undefined);
    eq(R.evolve(transf, null), null);
    eq(R.evolve(transf, ''), '');
  });
```

> filter

Reason for failing:  Ramda method dispatches to `filter` method of object

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var Maybe = require('./shared/Maybe');

describe('filter', function() {
  var even = function(x) {return x % 2 === 0;};
  it('reduces an array to those matching a filter', function() {
    eq(R.filter(even, [1, 2, 3, 4, 5]), [2, 4]);
  });
  it('returns an empty array if no element matches', function() {
    eq(R.filter(function(x) { return x > 100; }, [1, 9, 99]), []);
  });
  it('returns an empty array if asked to filter an empty array', function() {
    eq(R.filter(function(x) { return x > 100; }, []), []);
  });
  it('filters objects', function() {
    var positive = function(x) { return x > 0; };
    eq(R.filter(positive, {}), {});
    eq(R.filter(positive, {x: 0, y: 0, z: 0}), {});
    eq(R.filter(positive, {x: 1, y: 0, z: 0}), {x: 1});
    eq(R.filter(positive, {x: 1, y: 2, z: 0}), {x: 1, y: 2});
    eq(R.filter(positive, {x: 1, y: 2, z: 3}), {x: 1, y: 2, z: 3});
  });
  it('dispatches to passed-in non-Array object with a `filter` method', function() {
    var f = {filter: function(f) { return f('called f.filter'); }};
    eq(R.filter(function(s) { return s; }, f), 'called f.filter');
  });
  it('correctly uses fantasy-land implementations', function() {
    var m1 = Maybe.Just(-1);
    var m2 = R.filter(function(x) { return x > 0; } , m1);
    eq(m2.isNothing, true);
  });
```

> find

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var listXf = require('./helpers/listXf');

describe('find', function() {
  var obj1 = {x: 100};
  var obj2 = {x: 200};
  var a = [11, 10, 9, 'cow', obj1, 8, 7, 100, 200, 300, obj2, 4, 3, 2, 1, 0];
  var even = function(x) { return x % 2 === 0; };
  var gt100 = function(x) { return x > 100; };
  var isStr = function(x) { return typeof x === 'string'; };
  var xGt100 = function(o) { return o && o.x > 100; };
  var intoArray = R.into([]);
  it('returns the first element that satisfies the predicate', function() {
    eq(R.find(even, a), 10);
    eq(R.find(gt100, a), 200);
    eq(R.find(isStr, a), 'cow');
    eq(R.find(xGt100, a), obj2);
  });
  it('transduces the first element that satisfies the predicate into an array', function() {
    eq(intoArray(R.find(even), a), [10]);
    eq(intoArray(R.find(gt100), a), [200]);
    eq(intoArray(R.find(isStr), a), ['cow']);
    eq(intoArray(R.find(xGt100), a), [obj2]);
  });
  it('returns `undefined` when no element satisfies the predicate', function() {
    eq(R.find(even, ['zing']), undefined);
  });
  it('returns `undefined` in array when no element satisfies the predicate into an array', function() {
    eq(intoArray(R.find(even), ['zing']), [undefined]);
  });
  it('returns `undefined` when given an empty list', function() {
    eq(R.find(even, []), undefined);
  });
  it('returns `undefined` into an array when given an empty list', function() {
    eq(intoArray(R.find(even), []), [undefined]);
  });
  it('dispatches to transformer objects', function() {
    eq(R.find(R.identity, listXf), {
      f: R.identity,
      found: false,
      xf: listXf
    });
  });
```

> findIndex

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var listXf = require('./helpers/listXf');

describe('findIndex', function() {
  var obj1 = {x: 100};
  var obj2 = {x: 200};
  var a = [11, 10, 9, 'cow', obj1, 8, 7, 100, 200, 300, obj2, 4, 3, 2, 1, 0];
  var even = function(x) { return x % 2 === 0; };
  var gt100 = function(x) { return x > 100; };
  var isStr = function(x) { return typeof x === 'string'; };
  var xGt100 = function(o) { return o && o.x > 100; };
  var intoArray = R.into([]);
  it('returns the index of the first element that satisfies the predicate', function() {
    eq(R.findIndex(even, a), 1);
    eq(R.findIndex(gt100, a), 8);
    eq(R.findIndex(isStr, a), 3);
    eq(R.findIndex(xGt100, a), 10);
  });
  it('returns the index of the first element that satisfies the predicate into an array', function() {
    eq(intoArray(R.findIndex(even), a), [1]);
    eq(intoArray(R.findIndex(gt100), a), [8]);
    eq(intoArray(R.findIndex(isStr), a), [3]);
    eq(intoArray(R.findIndex(xGt100), a), [10]);
  });
  it('returns -1 when no element satisfies the predicate', function() {
    eq(R.findIndex(even, ['zing']), -1);
    eq(R.findIndex(even, []), -1);
  });
  it('returns -1 in array when no element satisfies the predicate into an array', function() {
    eq(intoArray(R.findIndex(even), ['zing']), [-1]);
  });
  it('dispatches to transformer objects', function() {
    eq(R.findIndex(R.identity, listXf), {
      f: R.identity,
      found: false,
      idx: -1,
      xf: listXf
    });
  });
```

> findLast

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var listXf = require('./helpers/listXf');

describe('findLast', function() {
  var obj1 = {x: 100};
  var obj2 = {x: 200};
  var a = [11, 10, 9, 'cow', obj1, 8, 7, 100, 200, 300, obj2, 4, 3, 2, 1, 0];
  var even = function(x) { return x % 2 === 0; };
  var gt100 = function(x) { return x > 100; };
  var isStr = function(x) { return typeof x === 'string'; };
  var xGt100 = function(o) { return o && o.x > 100; };
  var intoArray = R.into([]);
  it('returns the index of the last element that satisfies the predicate', function() {
    eq(R.findLast(even, a), 0);
    eq(R.findLast(gt100, a), 300);
    eq(R.findLast(isStr, a), 'cow');
    eq(R.findLast(xGt100, a), obj2);
  });
  it('returns the index of the last element that satisfies the predicate into an array', function() {
    eq(intoArray(R.findLast(even), a), [0]);
    eq(intoArray(R.findLast(gt100), a), [300]);
    eq(intoArray(R.findLast(isStr), a), ['cow']);
    eq(intoArray(R.findLast(xGt100), a), [obj2]);
  });
  it('returns `undefined` when no element satisfies the predicate', function() {
    eq(R.findLast(even, ['zing']), undefined);
  });
  it('returns `undefined` into an array when no element satisfies the predicate', function() {
    eq(intoArray(R.findLast(even), ['zing']), [undefined]);
  });
  it('works when the first element matches', function() {
    eq(R.findLast(even, [2, 3, 5]), 2);
  });
  it('does not go into an infinite loop on an empty array', function() {
    eq(R.findLast(even, []), undefined);
  });
  it('dispatches to transformer objects', function() {
    eq(R.findLast(R.identity, listXf), {
      f: R.identity,
      xf: listXf
    });
  });
```

> findLastIndex

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var listXf = require('./helpers/listXf');

describe('findLastIndex', function() {
  var obj1 = {x: 100};
  var obj2 = {x: 200};
  var a = [11, 10, 9, 'cow', obj1, 8, 7, 100, 200, 300, obj2, 4, 3, 2, 1, 0];
  var even = function(x) { return x % 2 === 0; };
  var gt100 = function(x) { return x > 100; };
  var isStr = function(x) { return typeof x === 'string'; };
  var xGt100 = function(o) { return o && o.x > 100; };
  var intoArray = R.into([]);
  it('returns the index of the last element that satisfies the predicate', function() {
    eq(R.findLastIndex(even, a), 15);
    eq(R.findLastIndex(gt100, a), 9);
    eq(R.findLastIndex(isStr, a), 3);
    eq(R.findLastIndex(xGt100, a), 10);
  });
  it('returns -1 when no element satisfies the predicate', function() {
    eq(R.findLastIndex(even, ['zing']), -1);
  });
  it('returns the index of the last element into an array that satisfies the predicate', function() {
    eq(intoArray(R.findLastIndex(even), a), [15]);
    eq(intoArray(R.findLastIndex(gt100), a), [9]);
    eq(intoArray(R.findLastIndex(isStr), a), [3]);
    eq(intoArray(R.findLastIndex(xGt100), a), [10]);
  });
  it('returns -1 into an array when no element satisfies the predicate', function() {
    eq(intoArray(R.findLastIndex(even), ['zing']), [-1]);
  });
  it('works when the first element matches', function() {
    eq(R.findLastIndex(even, [2, 3, 5]), 0);
  });
  it('does not go into an infinite loop on an empty array', function() {
    eq(R.findLastIndex(even, []), -1);
  });
  it('dispatches to transformer objects', function() {
    eq(R.findLastIndex(R.identity, listXf), {
      f: R.identity,
      idx: -1,
      lastIdx: -1,
      xf: listXf
    });
  });
```

> flatten

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('flatten', function() {
  it('turns a nested list into one flat list', function() {
    var nest = [1, [2], [3, [4, 5], 6, [[[7], 8]]], 9, 10];
    eq(R.flatten(nest), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    nest = [[[[3]], 2, 1], 0, [[-1, -2], -3]];
    eq(R.flatten(nest), [3, 2, 1, 0, -1, -2, -3]);
    eq(R.flatten([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  });
  it('is not destructive', function() {
    var nest = [1, [2], [3, [4, 5], 6, [[[7], 8]]], 9, 10];
    assert.notStrictEqual(R.flatten(nest), nest);
  });
  it('handles ridiculously large inputs', function() {
    this.timeout(10000);
    eq(R.flatten([new Array(1000000), R.range(0, 56000), 5, 1, 3]).length, 1056003);
  });
  it('handles array-like objects', function() {
    var o = {length: 3, 0: [1, 2, [3]], 1: [], 2: ['a', 'b', 'c', ['d', 'e']]};
    eq(R.flatten(o), [1, 2, 3, 'a', 'b', 'c', 'd', 'e']);
  });
  it('flattens an array of empty arrays', function() {
    eq(R.flatten([[], [], []]), []);
    eq(R.flatten([]), []);
  });
```

> flip

Reason for failing:  Ramda.flip returns a curried function | Rambda.flip work only for functions with arity below 5

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var fc = require('fast-check');

describe('flip', function() {
  it('returns a function which inverts the first two arguments to the supplied function', function() {
    var f = function(a, b, c) {return a + ' ' + b + ' ' + c;};
    var g = R.flip(f);
    eq(f('a', 'b', 'c'), 'a b c');
    eq(g('a', 'b', 'c'), 'b a c');
  });
  it('returns a curried function', function() {
    var f = function(a, b, c) {return a + ' ' + b + ' ' + c;};
    var g = R.flip(f)('a');
    eq(g('b', 'c'), 'b a c');
  });
  it('returns a function with the correct arity', function() {
    var f2 = function(a, b) {return a + ' ' + b;};
    var f3 = function(a, b, c) {return a + ' ' + b + ' ' + c;};
    eq(R.flip(f2).length, 2);
    eq(R.flip(f3).length, 3);
  });
describe('flip properties', function() {
  it('inverts first two arguments', function() {
    fc.assert(fc.property(fc.func(fc.anything()), fc.anything(), fc.anything(), fc.anything(), function(f, a, b, c) {
      var g = R.flip(f);
      return R.equals(f(a, b, c), g(b, a, c));
    }));
  });
```

> forEach

Reason for failing:  Ramda method dispatches to `forEach` method

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('forEach', function() {
  var list = [{x: 1, y: 2}, {x: 100, y: 200}, {x: 300, y: 400}, {x: 234, y: 345}];
  it('performs the passed in function on each element of the list', function() {
    var sideEffect = {};
    R.forEach(function(elem) { sideEffect[elem.x] = elem.y; }, list);
    eq(sideEffect, {1: 2, 100: 200, 300: 400, 234: 345});
  });
  it('returns the original list', function() {
    var s = '';
    eq(R.forEach(function(obj) { s += obj.x; }, list), list);
    eq('1100300234', s);
  });
  it('handles empty list', function() {
    eq(R.forEach(function(x) { return x * x; }, []), []);
  });
  it('dispatches to `forEach` method', function() {
    var dispatched = false;
    var fn = function() {};
    function DummyList() {}
    DummyList.prototype.forEach = function(callback) {
      dispatched = true;
      eq(callback, fn);
    };
    R.forEach(fn, new DummyList());
    eq(dispatched, true);
  });
```

> fromPairs

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('fromPairs', function() {
  it('combines an array of two-element arrays into an object', function() {
    eq(R.fromPairs([['a', 1], ['b', 2], ['c', 3]]), {a: 1, b: 2, c: 3});
  });
  it('gives later entries precedence over earlier ones', function() {
    eq(R.fromPairs([['x', 1], ['x', 2]]), {x: 2});
  });
```

> groupBy

Reason for failing:  Ramda method support transforms

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var _isTransformer = require('rambda/internal/_isTransformer');

describe('groupBy', function() {
  it('splits the list into groups according to the grouping function', function() {
    var grade = function(score) {
      return (score < 65) ? 'F' : (score < 70) ? 'D' : (score < 80) ? 'C' : (score < 90) ? 'B' : 'A';
    };
    var students = [
      {name: 'Abby', score: 84},
      {name: 'Brad', score: 73},
      {name: 'Chris', score: 89},
      {name: 'Dianne', score: 99},
      {name: 'Eddy', score: 58},
      {name: 'Fred', score: 67},
      {name: 'Gillian', score: 91},
      {name: 'Hannah', score: 78},
      {name: 'Irene', score: 85},
      {name: 'Jack', score: 69}
    ];
    var byGrade = function(student) {return grade(student.score || 0);};
    eq(R.groupBy(byGrade, students), {
      A: [{name: 'Dianne', score: 99}, {name: 'Gillian', score: 91}],
      B: [{name: 'Abby', score: 84}, {name: 'Chris', score: 89}, {name: 'Irene', score: 85}],
      C: [{name: 'Brad', score: 73}, {name: 'Hannah', score: 78}],
      D: [{name: 'Fred', score: 67}, {name: 'Jack', score: 69}],
      F: [{name: 'Eddy', score: 58}]
    });
  });
  it('returns an empty object if given an empty array', function() {
    eq(R.groupBy(R.prop('x'), []), {});
  });
  it('dispatches on transformer objects in list position', function() {
    var byType = R.prop('type');
    var xf = {
      '@@transducer/init': function() { return {}; },
      '@@transducer/result': function(x) { return x; },
      '@@transducer/step': R.mergeRight
    };
    eq(_isTransformer(R.groupBy(byType, xf)), true);
  });
```

> groupWith

Reason for failing:  Ramda method support string

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('groupWith', function() {
  it('splits the list into groups according to the grouping function', function() {
    eq(R.groupWith(R.equals, [1, 2, 2, 3]), [[1], [2, 2], [3]]);
    eq(R.groupWith(R.equals, [1, 1, 1, 1]), [[1, 1, 1, 1]]);
    eq(R.groupWith(R.equals, [1, 2, 3, 4]), [[1], [2], [3], [4]]);
  });
  it('splits the list into "streaks" testing adjacent elements', function() {
    var isConsecutive = function(a, b) { return a + 1 === b; };
    eq(R.groupWith(isConsecutive, []), []);
    eq(R.groupWith(isConsecutive, [4, 3, 2, 1]), [[4], [3], [2], [1]]);
    eq(R.groupWith(isConsecutive, [1, 2, 3, 4]), [[1, 2, 3, 4]]);
    eq(R.groupWith(isConsecutive, [1, 2, 2, 3]), [[1, 2], [2, 3]]);
    eq(R.groupWith(isConsecutive, [1, 2, 9, 3, 4]), [[1, 2], [9], [3, 4]]);
  });
  it('returns an empty array if given an empty array', function() {
    eq(R.groupWith(R.equals, []), []);
  });
  it('can be turned into the original list through concatenation', function() {
    var list = [1, 1, 2, 3, 4, 4, 5, 5];
    eq(R.unnest(R.groupWith(R.equals, list)), list);
    eq(R.unnest(R.groupWith(R.complement(R.equals), list)), list);
    eq(R.unnest(R.groupWith(R.T, list)), list);
    eq(R.unnest(R.groupWith(R.F, list)), list);
  });
  it('also works on strings', function() {
    eq(R.groupWith(R.equals)('Mississippi'), ['M','i','ss','i','ss','i','pp','i']);
  });
```

> has

Reason for failing:  Rambda method does check properties from the prototype chain

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('has', function() {
  var fred = {name: 'Fred', age: 23};
  var anon = {age: 99};
  it('returns true if the specified property is present', function() {
    eq(R.has('name', fred), true);
  });
  it('returns false if the specified property is absent', function() {
    eq(R.has('name', anon), false);
  });
  it('does not check properties from the prototype chain', function() {
    var Person = function() {};
    Person.prototype.age = function() {};
    var bob = new Person();
    eq(R.has('age', bob), false);
  });
  it('returns false for non-objects', function() {
    eq(R.has('a', undefined), false);
    eq(R.has('a', null), false);
    eq(R.has('a', true), false);
    eq(R.has('a', ''), false);
    eq(R.has('a', /a/), false);
  });
  it('tests currying', function() {
    eq(R.has('a')({ a: { b: 1 } }), true);
  });
```

> hasPath

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('hasPath', function() {
  var obj = {
    objVal: {b: {c: 'c'}},
    falseVal: false,
    nullVal: null,
    undefinedVal: undefined,
    arrayVal: ['arr']
  };
  it('returns true for existing path', function() {
    eq(R.hasPath(['objVal'], obj), true);
    eq(R.hasPath(['objVal', 'b'], obj), true);
    eq(R.hasPath(['objVal', 'b', 'c'], obj), true);
    eq(R.hasPath(['arrayVal'], obj), true);
  });
  it('returns true for existing path to falsy values', function() {
    eq(R.hasPath(['falseVal'], obj), true);
    eq(R.hasPath(['nullVal'], obj), true);
    eq(R.hasPath(['undefinedVal'], obj), true);
  });
  it('return false for a test for a child to a non-object', function() {
    eq(R.hasPath(['undefinedVal', 'child', 'grandchild'], obj), false);
    eq(R.hasPath(['falseVal', 'child', 'grandchild'], obj), false);
    eq(R.hasPath(['nullVal', 'child', 'grandchild'], obj), false);
    eq(R.hasPath(['arrayVal', 0, 'child', 'grandchild'], obj), false);
  });
  it('returns true for existing path with indexes', function() {
    eq(R.hasPath(['arrayVal', 0], obj), true);
  });
  it('returns false for non-existing path with indexes', function() {
    eq(R.hasPath(['arrayVal', 1], obj), false);
  });
  it('tests for paths in arrays', function() {
    eq(R.hasPath([0], [1, 2]), true);
    eq(R.hasPath([2], [1, 2]), false);
    eq(R.hasPath(['0'], [1, 2]), true);
    eq(R.hasPath(['2'], [1, 2]), false);
  });
  it('returns false for non-existent path', function() {
    eq(R.hasPath(['Unknown'], obj), false);
    eq(R.hasPath(['objVal', 'Unknown'], obj), false);
  });
  it('does not check properties from the prototype chain', function() {
    var Person = function() {};
    Person.prototype.age = {x: 1};
    var bob = new Person();
    eq(R.hasPath(['age'], bob), false);
    eq(R.hasPath(['age', 'x'], bob), false);
    eq(R.hasPath(['toString'], bob), false);
  });
  it('returns false for non-objects', function() {
    eq(R.hasPath([], obj), false);
  });
  it('tests paths on non-objects', function() {
    eq(R.hasPath(['a', 'b'], undefined), false);
    eq(R.hasPath(['a', 'b'], null), false);
    eq(R.hasPath('a', true), false);
    eq(R.hasPath('a', ''), false);
    eq(R.hasPath('a', /a/), false);
  });
  it('tests currying', function() {
    eq(R.hasPath(['a', 'b'])({ a: { b: 1 } }), true);
  });
```

> head

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('head', function() {
  it('returns the first element of an ordered collection', function() {
    eq(R.head([1, 2, 3]), 1);
    eq(R.head([2, 3]), 2);
    eq(R.head([3]), 3);
    eq(R.head([]), undefined);
    eq(R.head('abc'), 'a');
    eq(R.head('bc'), 'b');
    eq(R.head('c'), 'c');
    eq(R.head(''), '');
  });
  it('throws if applied to null or undefined', function() {
    assert.throws(function() { R.head(null); }, TypeError);
    assert.throws(function() { R.head(undefined); }, TypeError);
  });
```

> identical

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('identical', function() {
  var a = [];
  var b = a;
  it('has Object.is semantics', function() {
    eq(R.identical(100, 100), true);
    eq(R.identical(100, '100'), false);
    eq(R.identical('string', 'string'), true);
    eq(R.identical([], []), false);
    eq(R.identical(a, b), true);
    eq(R.identical(undefined, undefined), true);
    eq(R.identical(null, undefined), false);
    eq(R.identical(-0, 0), false);
    eq(R.identical(0, -0), false);
    eq(R.identical(NaN, NaN), true);
    eq(R.identical(NaN, 42), false);
    eq(R.identical(42, NaN), false);
    eq(R.identical(0, new Number(0)), false);
    eq(R.identical(new Number(0), 0), false);
    eq(R.identical(new Number(0), new Number(0)), false);
  });
```

> identity

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('identity', function() {
  it('returns its first argument', function() {
    eq(R.identity(undefined), undefined);
    eq(R.identity('foo'), 'foo');
    eq(R.identity('foo', 'bar'), 'foo');
  });
  it('has length 1', function() {
    eq(R.identity.length, 1);
  });
```

> ifElse

Reason for failing:  Rambda method doesn't return a curried function

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('ifElse', function() {
  var t = function(a) { return a + 1; };
  var identity = function(a) { return a; };
  var isArray = function(a) { return Object.prototype.toString.call(a) === '[object Array]'; };
  it('calls the truth case function if the validator returns a truthy value', function() {
    var v = function(a) { return typeof a === 'number'; };
    eq(R.ifElse(v, t, identity)(10), 11);
  });
  it('calls the false case function if the validator returns a falsy value', function() {
    var v = function(a) { return typeof a === 'number'; };
    eq(R.ifElse(v, t, identity)('hello'), 'hello');
  });
  it('calls the true case on array items and the false case on non array items', function() {
    var list = [[1, 2, 3, 4, 5], 10, [0, 1], 15];
    var arrayToLength = R.map(R.ifElse(isArray, R.prop('length'), identity));
    eq(arrayToLength(list), [5, 10, 2, 15]);
  });
  it('passes the arguments to the true case function', function() {
    var v = function() { return true; };
    var onTrue = function(a, b) {
      eq(a, 123);
      eq(b, 'abc');
    };
    R.ifElse(v, onTrue, identity)(123, 'abc');
  });
  it('passes the arguments to the false case function', function() {
    var v = function() { return false; };
    var onFalse = function(a, b) {
      eq(a, 123);
      eq(b, 'abc');
    };
    R.ifElse(v, identity, onFalse)(123, 'abc');
  });
  it('returns a function whose arity equals the max arity of the three arguments to `ifElse`', function() {
    function a0() { return 0; }
    function a1(x) { return x; }
    function a2(x, y) { return x + y; }
    eq(R.ifElse(a0, a1, a2).length, 2);
    eq(R.ifElse(a0, a2, a1).length, 2);
    eq(R.ifElse(a1, a0, a2).length, 2);
    eq(R.ifElse(a1, a2, a0).length, 2);
    eq(R.ifElse(a2, a0, a1).length, 2);
    eq(R.ifElse(a2, a1, a0).length, 2);
  });
  it('returns a curried function', function() {
    var v = function(a) { return typeof a === 'number'; };
    var ifIsNumber = R.ifElse(v);
    eq(ifIsNumber(t, identity)(15), 16);
    eq(ifIsNumber(t, identity)('hello'), 'hello');
    var fn = R.ifElse(R.gt, R.subtract, R.add);
    eq(fn(2)(7), 9);
    eq(fn(2, 7), 9);
    eq(fn(7)(2), 5);
    eq(fn(7, 2), 5);
  });
```

> inc

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('inc', function() {
  it('increments its argument', function() {
    eq(R.inc(-1), 0);
    eq(R.inc(0), 1);
    eq(R.inc(1), 2);
    eq(R.inc(12.34), 13.34);
    eq(R.inc(-Infinity), -Infinity);
    eq(R.inc(Infinity), Infinity);
  });
```

> includes

Reason for failing:  Ramda method pass to `equals` method if available

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('includes', function() {
  it('returns true if an element is in a list', function() {
    eq(R.includes(7, [1, 2, 3, 9, 8, 7, 100, 200, 300]), true);
  });
  it('returns false if an element is not in a list', function() {
    eq(R.includes(99, [1, 2, 3, 9, 8, 7, 100, 200, 300]), false);
  });
  it('returns false for the empty list', function() {
    eq(R.includes(1, []), false);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.includes(0, [-0]), false);
    eq(R.includes(-0, [0]), false);
    eq(R.includes(NaN, [NaN]), true);
    eq(R.includes(new Just([42]), [new Just([42])]), true);
  });
  it('returns true if substring is part of string', function() {
    eq(R.includes('ba', 'banana'), true);
  });
```

> indexBy

Reason for failing:  Ramda method can act as a transducer

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('indexBy', function() {
  it('indexes list by the given property', function() {
    var list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
    var indexed = R.indexBy(R.prop('id'), list);
    eq(indexed, {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}});
  });
  it('indexes list by the given property upper case', function() {
    var list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
    var indexed = R.indexBy(R.compose(R.toUpper, R.prop('id')), list);
    eq(indexed, {ABC: {id: 'abc', title: 'B'}, XYZ: {id: 'xyz', title: 'A'}});
  });
  it('can act as a transducer', function() {
    var list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
    var transducer = R.compose(
      R.indexBy(R.prop('id')),
      R.map(R.pipe(
        R.adjust(0, R.toUpper),
        R.adjust(1, R.omit(['id']))
      )));
    var result = R.into({}, transducer, list);
    eq(result, {ABC: {title: 'B'}, XYZ: {title: 'A'}});
  });
```

> indexOf

Reason for failing:  Ramda method dispatches to `indexOf` method

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('indexOf', function() {
  it("returns a number indicating an object's position in a list", function() {
    var list = [0, 10, 20, 30];
    eq(R.indexOf(30, list), 3);
  });
  it('returns -1 if the object is not in the list', function() {
    var list = [0, 10, 20, 30];
    eq(R.indexOf(40, list), -1);
  });
  var input = [1, 2, 3, 4, 5];
  it('returns the index of the first item', function() {
    eq(R.indexOf(1, input), 0);
  });
  it('returns the index of the last item', function() {
    eq(R.indexOf(5, input), 4);
  });
  var list = [1, 2, 3];
  list[-2] = 4; // Throw a wrench in the gears by assigning a non-valid array index as object property.
  it('finds 1', function() {
    eq(R.indexOf(1, list), 0);
  });
  it('finds 1 and is result strictly it', function() {
    eq(R.indexOf(1, list), 0);
  });
  it('does not find 4', function() {
    eq(R.indexOf(4, list), -1);
  });
  it('does not consider "1" equal to 1', function() {
    eq(R.indexOf('1', list), -1);
  });
  it('returns -1 for an empty array', function() {
    eq(R.indexOf('x', []), -1);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.indexOf(0, [-0]), -1);
    eq(R.indexOf(-0, [0]), -1);
    eq(R.indexOf(NaN, [NaN]), 0);
    eq(R.indexOf(new Just([42]), [new Just([42])]), 0);
  });
  it('dispatches to `indexOf` method', function() {
    function Empty() {}
    Empty.prototype.indexOf = R.always(-1);
    function List(head, tail) {
      this.head = head;
      this.tail = tail;
    }
    List.prototype.indexOf = function(x) {
      var idx = this.tail.indexOf(x);
      return this.head === x ? 0 : idx >= 0 ? 1 + idx : -1;
    };
    var list = new List('b',
      new List('a',
        new List('n',
          new List('a',
            new List('n',
              new List('a',
                new Empty()
              )
            )
          )
        )
      )
    );
    eq(R.indexOf('a', 'banana'), 1);
    eq(R.indexOf('x', 'banana'), -1);
    eq(R.indexOf('a', list), 1);
    eq(R.indexOf('x', list), -1);
  });
  it('finds function, compared by identity', function() {
    var f = function() {};
    var g = function() {};
    var list = [g, f, g, f];
    eq(R.indexOf(f, list), 1);
  });
  it('does not find function, compared by identity', function() {
    var f = function() {};
    var g = function() {};
    var h = function() {};
    var list = [g, f];
    eq(R.indexOf(h, list), -1);
  });
```

> init

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('init', function() {
  it('returns all but the last element of an ordered collection', function() {
    eq(R.init([1, 2, 3]), [1, 2]);
    eq(R.init([2, 3]), [2]);
    eq(R.init([3]), []);
    eq(R.init([]), []);
    eq(R.init('abc'), 'ab');
    eq(R.init('bc'), 'b');
    eq(R.init('c'), '');
    eq(R.init(''), '');
  });
  it('throws if applied to null or undefined', function() {
    assert.throws(function() { R.init(null); }, TypeError);
    assert.throws(function() { R.init(undefined); }, TypeError);
  });
  it('handles array-like object', function() {
    var args = (function() { return arguments; }(1, 2, 3, 4, 5));
    eq(R.init(args), [1, 2, 3, 4]);
  });
```

> intersection

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('intersection', function() {
  var M = [1, 2, 3, 4];
  var M2 = [1, 2, 3, 4, 1, 2, 3, 4];
  var N = [3, 4, 5, 6];
  var N2 = [3, 3, 4, 4, 5, 5, 6, 6];
  it('combines two lists into the set of common elements', function() {
    eq(R.intersection(M, N), [3, 4]);
  });
  it('does not allow duplicates in the output even if the input lists had duplicates', function() {
    eq(R.intersection(M2, N2), [3, 4]);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.intersection([0], [-0]).length, 0);
    eq(R.intersection([-0], [0]).length, 0);
    eq(R.intersection([NaN], [NaN]).length, 1);
    eq(R.intersection([new Just([42])], [new Just([42])]).length, 1);
  });
```

> intersperse

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('intersperse', function() {
  it('interposes a separator between list items', function() {
    eq(R.intersperse('n', ['ba', 'a', 'a']), ['ba', 'n', 'a', 'n', 'a']);
    eq(R.intersperse('bar', ['foo']), ['foo']);
    eq(R.intersperse('bar', []), []);
  });
  it('dispatches', function() {
    var obj = {intersperse: function(x) { return 'override ' + x; }};
    eq(R.intersperse('x', obj), 'override x');
  });
```

> is

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('is', function() {
  it('works with built-in types', function() {
    eq(R.is(Array, []), true);
    eq(R.is(Boolean, new Boolean(false)), true);
    eq(R.is(Date, new Date()), true);
    eq(R.is(Function, function() {}), true);
    eq(R.is(Number, new Number(0)), true);
    eq(R.is(Object, {}), true);
    eq(R.is(RegExp, /(?:)/), true);
    eq(R.is(String, new String('')), true);
  });
  it('works with user-defined types', function() {
    function Foo() {}
    function Bar() {}
    Bar.prototype = new Foo();
    var foo = new Foo();
    var bar = new Bar();
    eq(R.is(Foo, foo), true);
    eq(R.is(Bar, bar), true);
    eq(R.is(Foo, bar), true);
    eq(R.is(Bar, foo), false);
  });
  it('considers almost everything an object', function() {
    function Foo() {}
    var foo = new Foo();
    var isObject = R.is(Object);
    eq(isObject(foo), true);
    eq(isObject((function() { return arguments; })()), true);
    eq(isObject([]), true);
    eq(isObject(new Boolean(false)), true);
    eq(isObject(new Date()), true);
    eq(isObject(function() {}), true);
    eq(isObject(new Number(0)), true);
    eq(isObject(/(?:)/), true);
    eq(isObject(new String('')), true);
    eq(isObject(Object.create(null)), true);
    eq(isObject(null), false);
    eq(isObject(undefined), false);
  });
  it('does not coerce', function() {
    eq(R.is(Boolean, 1), false);
    eq(R.is(Number, '1'), false);
    eq(R.is(Number, false), false);
  });
  it('recognizes primitives as their object equivalents', function() {
    eq(R.is(Boolean, false), true);
    eq(R.is(Number, 0), true);
    eq(R.is(String, ''), true);
  });
  it('does not consider primitives to be instances of Object', function() {
    eq(R.is(Object, false), false);
    eq(R.is(Object, 0), false);
    eq(R.is(Object, ''), false);
  });
```

> isEmpty

Reason for failing:  Ramda method supports typed arrays

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('isEmpty', function() {
  it('returns false for null', function() {
    eq(R.isEmpty(null), false);
  });
  it('returns false for undefined', function() {
    eq(R.isEmpty(undefined), false);
  });
  it('returns true for empty string', function() {
    eq(R.isEmpty(''), true);
    eq(R.isEmpty(' '), false);
  });
  it('returns true for empty array', function() {
    eq(R.isEmpty([]), true);
    eq(R.isEmpty([[]]), false);
  });
  it('returns true for empty typed array', function() {
    eq(R.isEmpty(Uint8Array.from('')), true);
    eq(R.isEmpty(Float32Array.from('')), true);
    eq(R.isEmpty(new Float32Array([])), true);
    eq(R.isEmpty(Uint8Array.from('1')), false);
    eq(R.isEmpty(Float32Array.from('1')), false);
    eq(R.isEmpty(new Float32Array([1])), false);
  });
  it('returns true for empty object', function() {
    eq(R.isEmpty({}), true);
    eq(R.isEmpty({x: 0}), false);
  });
  it('returns true for empty arguments object', function() {
    eq(R.isEmpty((function() { return arguments; })()), true);
    eq(R.isEmpty((function() { return arguments; })(0)), false);
  });
  it('returns false for every other value', function() {
    eq(R.isEmpty(0), false);
    eq(R.isEmpty(NaN), false);
    eq(R.isEmpty(['']), false);
  });
```

> isNil

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('isNil', function() {
  it('tests a value for `null` or `undefined`', function() {
    eq(R.isNil(void 0), true);
    eq(R.isNil(null), true);
    eq(R.isNil([]), false);
    eq(R.isNil({}), false);
    eq(R.isNil(0), false);
    eq(R.isNil(''), false);
  });
```

> join

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('join', function() {
  it("concatenates a list's elements to a string, with an separator string between elements", function() {
    var list = [1, 2, 3, 4];
    eq(R.join('~', list), '1~2~3~4');
  });
```

> keys

Reason for failing:  Ramda method works for primitives

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('keys', function() {
  var obj = {a: 100, b: [1, 2, 3], c: {x: 200, y: 300}, d: 'D', e: null, f: undefined};
  function C() { this.a = 100; this.b = 200; }
  C.prototype.x = function() { return 'x'; };
  C.prototype.y = 'y';
  var cobj = new C();
  it("returns an array of the given object's own keys", function() {
    eq(R.keys(obj).sort(), ['a', 'b', 'c', 'd', 'e', 'f']);
  });
  it('works with hasOwnProperty override', function() {
    eq(R.keys({
      hasOwnProperty: false
    }), ['hasOwnProperty']);
  });
  it('works for primitives', function() {
    eq(R.keys(null), []);
    eq(R.keys(undefined), []);
    eq(R.keys(55), []);
    eq(R.keys('foo'), []);
    eq(R.keys(true), []);
    eq(R.keys(false), []);
    eq(R.keys(NaN), []);
    eq(R.keys(Infinity), []);
    eq(R.keys([]), []);
  });
  it("does not include the given object's prototype properties", function() {
    eq(R.keys(cobj).sort(), ['a', 'b']);
  });
```

> last

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('last', function() {
  it('returns the last element of an ordered collection', function() {
    eq(R.last([1, 2, 3]), 3);
    eq(R.last([1, 2]), 2);
    eq(R.last([1]), 1);
    eq(R.last([]), undefined);
    eq(R.last('abc'), 'c');
    eq(R.last('ab'), 'b');
    eq(R.last('a'), 'a');
    eq(R.last(''), '');
  });
  it('throws if applied to null or undefined', function() {
    assert.throws(function() { R.last(null); }, TypeError);
    assert.throws(function() { R.last(undefined); }, TypeError);
  });
```

> lastIndexOf

Reason for failing:  Ramda method dispatches to `lastIndexOf` method

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('lastIndexOf', function() {
  it("returns a number indicating an object's last position in a list", function() {
    var list = [0, 10, 20, 30, 0, 10, 20, 30, 0, 10];
    eq(R.lastIndexOf(30, list), 7);
  });
  it('returns -1 if the object is not in the list', function() {
    var list = [0, 10, 20, 30];
    eq(R.lastIndexOf(40, list), -1);
  });
  var input = [1, 2, 3, 4, 5, 1];
  it('returns the last index of the first item', function() {
    eq(R.lastIndexOf(1, input), 5);
  });
  it('returns the index of the last item', function() {
    eq(R.lastIndexOf(5, input), 4);
  });
  var list = ['a', 1, 'a'];
  list[-2] = 'a'; // Throw a wrench in the gears by assigning a non-valid array index as object property.
  it('finds a', function() {
    eq(R.lastIndexOf('a', list), 2);
  });
  it('does not find c', function() {
    eq(R.lastIndexOf('c', list), -1);
  });
  it('does not consider "1" equal to 1', function() {
    eq(R.lastIndexOf('1', list), -1);
  });
  it('returns -1 for an empty array', function() {
    eq(R.lastIndexOf('x', []), -1);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.lastIndexOf(0, [-0]), -1);
    eq(R.lastIndexOf(-0, [0]), -1);
    eq(R.lastIndexOf(NaN, [NaN]), 0);
    eq(R.lastIndexOf(new Just([42]), [new Just([42])]), 0);
  });
  it('dispatches to `lastIndexOf` method', function() {
    function Empty() {}
    Empty.prototype.lastIndexOf = R.always(-1);
    function List(head, tail) {
      this.head = head;
      this.tail = tail;
    }
    List.prototype.lastIndexOf = function(x) {
      var idx = this.tail.lastIndexOf(x);
      return idx >= 0 ? 1 + idx : this.head === x ? 0 : -1;
    };
    var list = new List('b',
      new List('a',
        new List('n',
          new List('a',
            new List('n',
              new List('a',
                new Empty()
              )
            )
          )
        )
      )
    );
    eq(R.lastIndexOf('a', 'banana'), 5);
    eq(R.lastIndexOf('x', 'banana'), -1);
    eq(R.lastIndexOf('a', list), 5);
    eq(R.lastIndexOf('x', list), -1);
  });
  it('finds function, compared by identity', function() {
    var f = function() {};
    var g = function() {};
    var list = [g, f, g, f];
    eq(R.lastIndexOf(f, list), 3);
  });
  it('does not find function, compared by identity', function() {
    var f = function() {};
    var g = function() {};
    var h = function() {};
    var list = [g, f];
    eq(R.lastIndexOf(h, list), -1);
  });
```

> length

Reason for failing:  Ramda method supports object with `length` method

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('length', function() {
  it('returns the length of a list', function() {
    eq(R.length([]), 0);
    eq(R.length(['a', 'b', 'c', 'd']), 4);
  });
  it('returns the length of a string', function() {
    eq(R.length(''), 0);
    eq(R.length('xyz'), 3);
  });
  it('returns the length of a function', function() {
    eq(R.length(function() {}), 0);
    eq(R.length(function(x, y, z) { return z; }), 3);
  });
  it('returns the length of an arguments object', function() {
    eq(R.length((function() { return arguments; })()), 0);
    eq(R.length((function() { return arguments; })('x', 'y', 'z')), 3);
  });
  it('returns NaN for value of unexpected type', function() {
    eq(R.identical(NaN, R.length(0)), true);
    eq(R.identical(NaN, R.length({})), true);
    eq(R.identical(NaN, R.length(null)), true);
    eq(R.identical(NaN, R.length(undefined)), true);
  });
  it('returns NaN for length property of unexpected type', function() {
    eq(R.identical(NaN, R.length({length: ''})), true);
    eq(R.identical(NaN, R.length({length: '1.23'})), true);
    eq(R.identical(NaN, R.length({length: null})), true);
    eq(R.identical(NaN, R.length({length: undefined})), true);
    eq(R.identical(NaN, R.length({})), true);
  });
```

> lensIndex

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

var testList = [{a: 1}, {b: 2}, {c: 3}];
describe('lensIndex', function() {
  describe('view', function() {
    it('focuses list element at the specified index', function() {
      eq(R.view(R.lensIndex(0), testList), {a: 1});
    });
    it('returns undefined if the specified index does not exist', function() {
      eq(R.view(R.lensIndex(10), testList), undefined);
    });
  });
  describe('set', function() {
    it('sets the list value at the specified index', function() {
      eq(R.set(R.lensIndex(0), 0, testList), [0, {b: 2}, {c: 3}]);
    });
  });
  describe('over', function() {
    it('applies function to the value at the specified list index', function() {
      eq(R.over(R.lensIndex(2), R.keys, testList), [{a: 1}, {b: 2}, ['c']]);
    });
  });
  describe('composability', function() {
    it('can be composed', function() {
      var nestedList = [0, [10, 11, 12], 1, 2];
      var composedLens = R.compose(R.lensIndex(1), R.lensIndex(0));
      eq(R.view(composedLens, nestedList), 10);
    });
  });
  describe('well behaved lens', function() {
    it('set s (get s) === s', function() {
      eq(R.set(R.lensIndex(0), R.view(R.lensIndex(0), testList), testList), testList);
    });
    it('get (set s v) === v', function() {
      eq(R.view(R.lensIndex(0), R.set(R.lensIndex(0), 0, testList)), 0);
    });
    it('get (set(set s v1) v2) === v2', function() {
      eq(
        R.view(R.lensIndex(0), R.set(R.lensIndex(0), 11, R.set(R.lensIndex(0), 10, testList))),
        11
      );
    });
  });
```

> lensPath

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

var testObj = {
  a: [{
    b: 1
  }, {
    b: 2
  }],
  d: 3
};
describe('lensPath', function() {
  describe('view', function() {
    it('focuses the specified object property', function() {
      eq(R.view(R.lensPath(['d']), testObj), 3);
      eq(R.view(R.lensPath(['a', 1, 'b']), testObj), 2);
      eq(R.view(R.lensPath([]), testObj), testObj);
    });
  });
  describe('set', function() {
    it('sets the value of the object property specified', function() {
      eq(R.set(R.lensPath(['d']), 0, testObj), {a: [{b: 1}, {b: 2}], d: 0});
      eq(R.set(R.lensPath(['a', 0, 'b']), 0, testObj), {a: [{b: 0}, {b: 2}], d: 3});
      eq(R.set(R.lensPath([]), 0, testObj), 0);
    });
    it('adds the property to the object if it doesn\'t exist', function() {
      eq(R.set(R.lensPath(['X']), 0, testObj), {a: [{b: 1}, {b: 2}], d: 3, X: 0});
      eq(R.set(R.lensPath(['a', 0, 'X']), 0, testObj), {a: [{b: 1, X: 0}, {b: 2}], d: 3});
    });
  });
  describe('over', function() {
    it('applies function to the value of the specified object property', function() {
      eq(R.over(R.lensPath(['d']), R.inc, testObj), {a: [{b: 1}, {b: 2}], d: 4});
      eq(R.over(R.lensPath(['a', 1, 'b']), R.inc, testObj), {a: [{b: 1}, {b: 3}], d: 3});
      eq(R.over(R.lensPath([]), R.toPairs, testObj), [['a', [{b: 1}, {b: 2}]], ['d', 3]]);
    });
    it('applies function to undefined and adds the property if it doesn\'t exist', function() {
      eq(R.over(R.lensPath(['X']), R.identity, testObj), {a: [{b: 1}, {b: 2}], d: 3, X: undefined});
      eq(R.over(R.lensPath(['a', 0, 'X']), R.identity, testObj), {a: [{b: 1, X: undefined}, {b: 2}], d: 3});
    });
  });
  describe('composability', function() {
    it('can be composed', function() {
      var composedLens = R.compose(R.lensPath(['a']), R.lensPath([1, 'b']));
      eq(R.view(composedLens, testObj), 2);
    });
  });
  describe('well behaved lens', function() {
    it('set s (get s) === s', function() {
      eq(R.set(R.lensPath(['d']), R.view(R.lensPath(['d']), testObj), testObj), testObj);
      eq(R.set(R.lensPath(['a', 0, 'b']), R.view(R.lensPath(['a', 0, 'b']), testObj), testObj), testObj);
    });
    it('get (set s v) === v', function() {
      eq(R.view(R.lensPath(['d']), R.set(R.lensPath(['d']), 0, testObj)), 0);
      eq(R.view(R.lensPath(['a', 0, 'b']), R.set(R.lensPath(['a', 0, 'b']), 0, testObj)), 0);
    });
    it('get (set(set s v1) v2) === v2', function() {
      var p = ['d'];
      var q = ['a', 0, 'b'];
      eq(R.view(R.lensPath(p), R.set(R.lensPath(p), 11, R.set(R.lensPath(p), 10, testObj))), 11);
      eq(R.view(R.lensPath(q), R.set(R.lensPath(q), 11, R.set(R.lensPath(q), 10, testObj))), 11);
    });
  });
```

> lensProp

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

var testObj = {
  a: 1,
  b: 2,
  c: 3
};
describe('lensProp', function() {
  describe('view', function() {
    it('focuses object the specified object property', function() {
      eq(R.view(R.lensProp('a'), testObj), 1);
    });
    it('returns undefined if the specified property does not exist', function() {
      eq(R.view(R.lensProp('X'), testObj), undefined);
    });
  });
  describe('set', function() {
    it('sets the value of the object property specified', function() {
      eq(R.set(R.lensProp('a'), 0, testObj), {a:0, b:2, c:3});
    });
    it('adds the property to the object if it doesn\'t exist', function() {
      eq(R.set(R.lensProp('d'), 4, testObj), {a:1, b:2, c:3, d:4});
    });
  });
  describe('over', function() {
    it('applies function to the value of the specified object property', function() {
      eq(R.over(R.lensProp('a'), R.inc, testObj), {a:2, b:2, c:3});
    });
    it('applies function to undefined and adds the property if it doesn\'t exist', function() {
      eq(R.over(R.lensProp('X'), R.identity, testObj), {a:1, b:2, c:3, X:undefined});
    });
  });
  describe('composability', function() {
    it('can be composed', function() {
      var nestedObj = {a: {b: 1}, c:2};
      var composedLens = R.compose(R.lensProp('a'), R.lensProp('b'));
      eq(R.view(composedLens, nestedObj), 1);
    });
  });
  describe('well behaved lens', function() {
    it('set s (get s) === s', function() {
      eq(R.set(R.lensProp('a'), R.view(R.lensProp('a'), testObj), testObj), testObj);
    });
    it('get (set s v) === v', function() {
      eq(R.view(R.lensProp('a'), R.set(R.lensProp('a'), 0, testObj)), 0);
    });
    it('get (set(set s v1) v2) === v2', function() {
      eq(
        R.view(R.lensProp('a'), R.set(R.lensProp('a'), 11, R.set(R.lensProp('a'), 10, testObj))),
        11
      );
    });
  });
```

> map

```javascript
var listXf = require('./helpers/listXf');

var R = require('../../../../../rambda/dist/rambda');
var assert = require('assert');
var eq = require('./shared/eq');
var Id = require('./shared/Id');
describe('map', function() {
  var times2 = function(x) {return x * 2;};
  var add1 = function(x) {return x + 1;};
  var dec = function(x) { return x - 1; };
  var intoArray = R.into([]);
  it('maps simple functions over arrays', function() {
    eq(R.map(times2, [1, 2, 3, 4]), [2, 4, 6, 8]);
  });
  it('maps simple functions into arrays', function() {
    eq(intoArray(R.map(times2), [1, 2, 3, 4]), [2, 4, 6, 8]);
  });
  it('maps over objects', function() {
    eq(R.map(dec, {}), {});
    eq(R.map(dec, {x: 4, y: 5, z: 6}), {x: 3, y: 4, z: 5});
  });
  it('interprets ((->) r) as a functor', function() {
    var f = function(a) { return a - 1; };
    var g = function(b) { return b * 2; };
    var h = R.map(f, g);
    eq(h(10), (10 * 2) - 1);
  });
  it('dispatches to objects that implement `map`', function() {
    var obj = {x: 100, map: function(f) { return f(this.x); }};
    eq(R.map(add1, obj), 101);
  });
  it('dispatches to transformer objects', function() {
    eq(R.map(add1, listXf), {
      f: add1,
      xf: listXf
    });
  });
  it('throws a TypeError on null and undefined', function() {
    assert.throws(function() { return R.map(times2, null); }, TypeError);
    assert.throws(function() { return R.map(times2, undefined); }, TypeError);
  });
  it('composes', function() {
    var mdouble = R.map(times2);
    var mdec = R.map(dec);
    eq(mdec(mdouble([10, 20, 30])), [19, 39, 59]);
  });
  it('can compose transducer-style', function() {
    var mdouble = R.map(times2);
    var mdec = R.map(dec);
    var xcomp = mdec(mdouble(listXf));
    eq(xcomp.xf, {xf: listXf, f: times2});
    eq(xcomp.f, dec);
  });
  it('correctly uses fantasy-land implementations', function() {
    var m1 = Id(1);
    var m2 = R.map(R.add(1), m1);
    eq(m1.value + 1, m2.value);
  });
```

> match

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('match', function() {
  var re = /[A-Z]\d\d\-[a-zA-Z]+/;
  var matching = 'B17-afn';
  var notMatching = 'B1-afn';
  it('determines whether a string matches a regex', function() {
    eq(R.match(re, matching).length, 1);
    eq(R.match(re, notMatching), []);
  });
  it('defaults to a different empty array each time', function() {
    var first = R.match(re, notMatching);
    var second = R.match(re, notMatching);
    assert.notStrictEqual(first, second);
  });
  it('throws on null input', function() {
    assert.throws(function shouldThrow() { R.match(re, null); }, TypeError);
  });
```

> mathMod

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('mathMod', function() {
  it('requires integer arguments', function() {
    assert(Number.isNaN(R.mathMod('s', 3)));
    assert(Number.isNaN(R.mathMod(3, 's')));
    assert(Number.isNaN(R.mathMod(12.2, 3)));
    assert(Number.isNaN(R.mathMod(3, 12.2)));
  });
  it('behaves differently than JS modulo', function() {
    assert.notStrictEqual(R.mathMod(-17, 5), -17 % 5);
    assert.notStrictEqual(R.mathMod(17.2, 5), 17.2 % 5);
    assert.notStrictEqual(R.mathMod(17, -5), 17 % -5);
  });
  it('computes the true modulo function', function() {
    eq(R.mathMod(-17, 5), 3);
    eq(R.identical(NaN, R.mathMod(17, -5)), true);
    eq(R.identical(NaN, R.mathMod(17, 0)), true);
    eq(R.identical(NaN, R.mathMod(17.2, 5)), true);
    eq(R.identical(NaN, R.mathMod(17, 5.5)), true);
  });
```

> max

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('max', function() {
  it('returns the larger of its two arguments', function() {
    eq(R.max(-7, 7), 7);
    eq(R.max(7, -7), 7);
  });
  it('works for any orderable type', function() {
    var d1 = new Date('2001-01-01');
    var d2 = new Date('2002-02-02');
    eq(R.max(d1, d2), d2);
    eq(R.max(d2, d1), d2);
    eq(R.max('a', 'b'), 'b');
    eq(R.max('b', 'a'), 'b');
  });
```

> maxBy

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('maxBy', function() {
  it('returns the larger value as determined by the function', function() {
    eq(R.maxBy(function(n) { return n * n; }, -3, 2), -3);
    eq(R.maxBy(R.prop('x'), {x: 3, y: 1}, {x: 5, y: 10}), {x: 5, y: 10});
  });
```

> mean

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('mean', function() {
  it('returns mean of a nonempty list', function() {
    eq(R.mean([2]), 2);
    eq(R.mean([2, 7]), 4.5);
    eq(R.mean([2, 7, 9]), 6);
    eq(R.mean([2, 7, 9, 10]), 7);
  });
  it('returns NaN for an empty list', function() {
    eq(R.identical(NaN, R.mean([])), true);
  });
  it('handles array-like object', function() {
    eq(R.mean((function() { return arguments; })(1, 2, 3)), 2);
  });
```

> median

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('median', function() {
  it('returns middle value of an odd-length list', function() {
    eq(R.median([2]), 2);
    eq(R.median([2, 9, 7]), 7);
  });
  it('returns mean of two middle values of a nonempty even-length list', function() {
    eq(R.median([7, 2]), 4.5);
    eq(R.median([7, 2, 10, 9]), 8);
  });
  it('returns NaN for an empty list', function() {
    eq(R.identical(NaN, R.median([])), true);
  });
  it('handles array-like object', function() {
    eq(R.median((function() { return arguments; })(1, 2, 3)), 2);
  });
```

> mergeAll

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('mergeAll', function() {
  it('merges a list of objects together into one object', function() {
    eq(R.mergeAll([{foo:1}, {bar:2}, {baz:3}]), {foo:1, bar:2, baz:3});
  });
  it('gives precedence to later objects in the list', function() {
    eq(R.mergeAll([{foo:1}, {foo:2}, {bar:2}]), {foo:2, bar:2});
  });
  it('ignores inherited properties', function() {
    function Foo() {}
    Foo.prototype.bar = 42;
    var foo = new Foo();
    var res = R.mergeAll([foo, {fizz: 'buzz'}]);
    eq(res, {fizz: 'buzz'});
  });
```

> mergeDeepRight

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('mergeDeepRight', function() {
  it('takes two objects, recursively merges their own properties and returns a new object', function() {
    var a = { w: 1, x: 2, y: { z: 3 }};
    var b = { a: 4, b: 5, c: { d: 6 }};
    eq(R.mergeDeepRight(a, b), { w: 1, x: 2, y: { z: 3 }, a: 4, b: 5, c: { d: 6 }});
  });
  it('overrides properties in the first object with properties in the second object', function() {
    var a = { a: { b: 1, c: 2 }, y: 0 };
    var b = { a: { b: 3, d: 4 }, z: 0 };
    eq(R.mergeDeepRight(a, b), { a: { b: 3, c: 2, d: 4 }, y: 0, z: 0 });
  });
  it('is not destructive', function() {
    var a = { w: 1, x: { y: 2 }};
    var res = R.mergeDeepRight(a, { x: { y: 3 }});
    assert.notStrictEqual(a, res);
    assert.notStrictEqual(a.x, res.x);
    eq(res, { w: 1, x: { y: 3 }});
  });
  it('reports only own properties', function() {
    var a = { w: 1, x: { y: 2 }};
    function Cla() {}
    Cla.prototype.y = 5;
    eq(R.mergeDeepRight({ x: new Cla() }, a), { w: 1, x: { y: 2 }});
    eq(R.mergeDeepRight(a, { x: new Cla() }), { w: 1, x: { y: 2 }});
  });
```

> mergeLeft

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('mergeLeft', function() {
  it('takes two objects, merges their own properties and returns a new object', function() {
    var a = {w: 1, x: 2};
    var b = {y: 3, z: 4};
    eq(R.mergeLeft(a, b), {w: 1, x: 2, y: 3, z: 4});
  });
  it('overrides properties in the second object with properties in the first object', function() {
    var a = {w: 1, x: 2};
    var b = {w: 100, y: 3, z: 4};
    eq(R.mergeLeft(a, b), {w: 1, x: 2, y: 3, z: 4});
  });
  it('is not destructive', function() {
    var a = {w: 1, x: 2};
    var res = R.mergeLeft(a, {x: 3, y: 4});
    assert.notStrictEqual(a, res);
    eq(res, {w: 1, x: 2, y: 4});
  });
  it('reports only own properties', function() {
    var a = {w: 1, x: 2};
    function Cla() {}
    Cla.prototype.x = 5;
    eq(R.mergeLeft(new Cla(), a), {w: 1, x: 2});
    eq(R.mergeLeft(a, new Cla()), {w: 1, x: 2});
  });
  it('is shallow', function() {
    var a = { x: { u: 1, v: 2 }, y: 0 };
    var b = { x: { u: 3, w: 4 }, z: 0 };
    var res = R.mergeLeft(a, b);
    assert.strictEqual(a.x, res.x);
    eq(res, { x: { u: 1, v: 2 }, y: 0, z: 0 });
  });
```

> min

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('min', function() {
  it('returns the smaller of its two arguments', function() {
    eq(R.min(-7, 7), -7);
    eq(R.min(7, -7), -7);
  });
  it('works for any orderable type', function() {
    var d1 = new Date('2001-01-01');
    var d2 = new Date('2002-02-02');
    eq(R.min(d1, d2), d1);
    eq(R.min(d2, d1), d1);
    eq(R.min('a', 'b'), 'a');
    eq(R.min('b', 'a'), 'a');
  });
```

> minBy

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('minBy', function() {
  it('returns the smaller value as determined by the function', function() {
    eq(R.minBy(function(n) { return n * n; }, -3, 2), 2);
    eq(R.minBy(R.prop('x'), {x: 3, y: 1}, {x: 5, y: 10}), {x: 3, y: 1});
  });
```

> modulo

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('modulo', function() {
  it('divides the first param by the second and returns the remainder', function() {
    eq(R.modulo(100, 2), 0);
    eq(R.modulo(100, 3), 1);
    eq(R.modulo(100, 17), 15);
  });
  it('preserves javascript-style modulo evaluation for negative numbers', function() {
    eq(R.modulo(-5, 4), -1);
  });
```

> move

Reason for failing:  Ramda method does not support negative indexes

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

var list = ['a', 'b', 'c', 'd', 'e', 'f'];
describe('move', function() {
  it('moves an element from an index to another', function() {
    eq(R.move(0, 1, list), ['b', 'a', 'c', 'd', 'e', 'f']);
    eq(R.move(2, 1, list), ['a', 'c', 'b', 'd', 'e', 'f']);
    eq(R.move(-1, 0, list), ['f', 'a', 'b', 'c', 'd', 'e']);
    eq(R.move(0, -1, list), ['b', 'c', 'd', 'e', 'f', 'a']);
  });
  it('does nothing when indexes are outside the list outbounds', function() {
    eq(R.move(-20, 2, list), list);
    eq(R.move(20, 2, list), list);
    eq(R.move(2, 20, list), list);
    eq(R.move(2, -20, list), list);
    eq(R.move(20, 20, list), list);
    eq(R.move(-20, -20, list), list);
  });
```

> multiply

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('multiply', function() {
  it('multiplies together two numbers', function() {
    eq(R.multiply(6, 7), 42);
  });
```

> negate

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('negate', function() {
  it('negates its argument', function() {
    eq(R.negate(-Infinity), Infinity);
    eq(R.negate(-1), 1);
    eq(R.negate(-0), 0);
    eq(R.negate(0), -0);
    eq(R.negate(1), -1);
    eq(R.negate(Infinity), -Infinity);
  });
```

> none

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('none', function() {
  var even = function(n) {return n % 2 === 0;};
  var T = function() {return true;};
  var intoArray = R.into([]);
  it('returns true if no elements satisfy the predicate', function() {
    eq(R.none(even, [1, 3, 5, 7, 9, 11]), true);
  });
  it('returns false if any element satisfies the predicate', function() {
    eq(R.none(even, [1, 3, 5, 7, 8, 11]), false);
  });
  it('returns true for an empty list', function() {
    eq(R.none(T, []), true);
  });
  it('returns into array', function() {
    eq(intoArray(R.none(even), [1, 3, 5, 7, 9, 11]), [true]);
    eq(intoArray(R.none(even), [1, 3, 5, 7, 8, 11]), [false]);
    eq(intoArray(R.none(T), []), [true]);
  });
  it('works with more complex objects', function() {
    var xs = [{x: 'abcd'}, {x: 'adef'}, {x: 'fghiajk'}];
    function len3(o) { return o.x.length === 3; }
    function hasA(o) { return o.x.indexOf('a') >= 0; }
    eq(R.none(len3, xs), true);
    eq(R.none(hasA, xs), false);
  });
```

> not

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('not', function() {
  it('reverses argument', function() {
    eq(R.not(false), true);
    eq(R.not(1), false);
    eq(R.not(''), true);
  });
```

> nth

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('nth', function() {
  var list = ['foo', 'bar', 'baz', 'quux'];
  it('accepts positive offsets', function() {
    eq(R.nth(0, list), 'foo');
    eq(R.nth(1, list), 'bar');
    eq(R.nth(2, list), 'baz');
    eq(R.nth(3, list), 'quux');
    eq(R.nth(4, list), undefined);
    eq(R.nth(0, 'abc'), 'a');
    eq(R.nth(1, 'abc'), 'b');
    eq(R.nth(2, 'abc'), 'c');
    eq(R.nth(3, 'abc'), '');
  });
  it('accepts negative offsets', function() {
    eq(R.nth(-1, list), 'quux');
    eq(R.nth(-2, list), 'baz');
    eq(R.nth(-3, list), 'bar');
    eq(R.nth(-4, list), 'foo');
    eq(R.nth(-5, list), undefined);
    eq(R.nth(-1, 'abc'), 'c');
    eq(R.nth(-2, 'abc'), 'b');
    eq(R.nth(-3, 'abc'), 'a');
    eq(R.nth(-4, 'abc'), '');
  });
  it('throws if applied to null or undefined', function() {
    assert.throws(function() { R.nth(0, null); }, TypeError);
    assert.throws(function() { R.nth(0, undefined); }, TypeError);
  });
```

> of

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('of', function() {
  it('returns its argument as an Array', function() {
    eq(R.of(100), [100]);
    eq(R.of([100]), [[100]]);
    eq(R.of(null), [null]);
    eq(R.of(undefined), [undefined]);
    eq(R.of([]), [[]]);
  });
```

> omit

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('omit', function() {
  var obj = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6};
  it('copies an object omitting the listed properties', function() {
    eq(R.omit(['a', 'c', 'f'], obj), {b: 2, d: 4, e: 5});
  });
  it('includes prototype properties', function() {
    var F = function(param) {this.x = param;};
    F.prototype.y = 40; F.prototype.z = 50;
    var obj = new F(30);
    obj.v = 10; obj.w = 20;
    eq(R.omit(['w', 'x', 'y'], obj), {v: 10, z: 50});
  });
```

> once

Reason for failing:  Ramda method retains arity

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('once', function() {
  it('returns a function that calls the supplied function only the first time called', function() {
    var ctr = 0;
    var fn = R.once(function() {ctr += 1;});
    fn();
    eq(ctr, 1);
    fn();
    eq(ctr, 1);
    fn();
    eq(ctr, 1);
  });
  it('passes along arguments supplied', function() {
    var fn = R.once(function(a, b) {return a + b;});
    var result = fn(5, 10);
    eq(result, 15);
  });
  it('retains and returns the first value calculated, even if different arguments are passed later', function() {
    var ctr = 0;
    var fn = R.once(function(a, b) {ctr += 1; return a + b;});
    var result = fn(5, 10);
    eq(result, 15);
    eq(ctr, 1);
    result = fn(20, 30);
    eq(result, 15);
    eq(ctr, 1);
  });
  it('retains arity', function() {
    var f = R.once(function(a, b) { return a + b; });
    eq(f.length, 2);
  });
```

> or

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('or', function() {
  it('compares two values with js ||', function() {
    eq(R.or(true, true), true);
    eq(R.or(true, false), true);
    eq(R.or(false, true), true);
    eq(R.or(false, false), false);
  });
```

> partial

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('partial', function() {
  var disc = function(a, b, c) { // note disc(3, 7, 4) => 1
    return b * b - 4 * a * c;
  };
  it('caches the initially supplied arguments', function() {
    var f = R.partial(disc, [3]);
    eq(f(7, 4), 1);
    var g = R.partial(disc, [3, 7]);
    eq(g(4), 1);
  });
  it('correctly reports the arity of the new function', function() {
    var f = R.partial(disc, [3]);
    eq(f.length, 2);
    var g = R.partial(disc, [3, 7]);
    eq(g.length, 1);
  });
```

> partition

Reason for failing:  Ramda library supports fantasy-land

```javascript
var S = require('sanctuary');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('partition', function() {
  it('splits a list into two lists according to a predicate', function() {
    var pred = function(n) { return n % 2; };
    eq(R.partition(pred, []), [[], []]);
    eq(R.partition(pred, [0, 2, 4, 6]), [[], [0, 2, 4, 6]]);
    eq(R.partition(pred, [1, 3, 5, 7]), [[1, 3, 5, 7], []]);
    eq(R.partition(pred, [0, 1, 2, 3]), [[1, 3], [0, 2]]);
  });
  it('works with objects', function() {
    var pred = function(n) { return n % 2; };
    eq(R.partition(pred, {}), [{}, {}]);
    eq(R.partition(pred, { a: 0, b: 2, c: 4, d: 6 }),
      [{}, { a: 0, b: 2, c: 4, d: 6 }]
    );
    eq(R.partition(pred, { a: 1, b: 3, c: 5, d: 7 }),
      [{ a: 1, b: 3, c: 5, d: 7 }, {}]
    );
    eq(R.partition(pred, { a: 0, b: 1, c: 2, d: 3 }),
      [{ b: 1, d: 3 }, { a: 0, c: 2 }]
    );
  });
  it('works with other filterables', function() {
    eq(R.partition(R.isEmpty, S.Just(3)),
      [S.Nothing(), S.Just(3)]
    );
    eq(R.partition(R.complement(R.isEmpty), S.Just(3)),
      [S.Just(3), S.Nothing()]
    );
  });
```

> path

Reason for failing:  Ramda method supports negative indexes

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('path', function() {
  var deepObject = {a: {b: {c: 'c'}}, falseVal: false, nullVal: null, undefinedVal: undefined, arrayVal: ['arr']};
  it('takes a path and an object and returns the value at the path or undefined', function() {
    var obj = {
      a: {
        b: {
          c: 100,
          d: 200
        },
        e: {
          f: [100, 101, 102],
          g: 'G'
        },
        h: 'H'
      },
      i: 'I',
      j: ['J']
    };
    eq(R.path(['a', 'b', 'c'], obj), 100);
    eq(R.path([], obj), obj);
    eq(R.path(['a', 'e', 'f', 1], obj), 101);
    eq(R.path(['j', 0], obj), 'J');
    eq(R.path(['j', 1], obj), undefined);
  });
  it('takes a path that contains indices into arrays', function() {
    var obj = {
      a: [[{}], [{x: 'first'}, {x: 'second'}, {x: 'third'}, {x: 'last'}]]
    };
    eq(R.path(['a', 0, 0], obj), {});
    eq(R.path(['a', 0, 1], obj), undefined);
    eq(R.path(['a', 1, 0, 'x'], obj), 'first');
    eq(R.path(['a', 1, 1, 'x'], obj), 'second');
    eq(R.path([0], ['A']), 'A');
  });
  it('takes a path that contains negative indices into arrays', function() {
    eq(R.path(['x', -2], {x: ['a', 'b', 'c', 'd']}), 'c');
    eq(R.path([-1, 'y'], [{x: 1, y: 99}, {x: 2, y: 98}, {x: 3, y: 97}]), 97);
  });
  it("gets a deep property's value from objects", function() {
    eq(R.path(['a', 'b', 'c'], deepObject), 'c');
    eq(R.path(['a'], deepObject), deepObject.a);
  });
  it('returns undefined for items not found', function() {
    eq(R.path(['a', 'b', 'foo'], deepObject), undefined);
    eq(R.path(['bar'], deepObject), undefined);
    eq(R.path(['a', 'b'], {a: null}), undefined);
  });
  it('works with falsy items', function() {
    eq(R.path(['toString'], false), Boolean.prototype.toString);
  });
```

> pathEq

Reason for failing:  Ramda library supports fantasy-land

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('pathEq', function() {
  var obj = {
    a: 1,
    b: [{
      ba: 2
    }, {
      ba: 3
    }]
  };
  it('returns true if the path matches the value', function() {
    eq(R.pathEq(['a'], 1, obj), true);
    eq(R.pathEq(['b', 1, 'ba'], 3, obj), true);
  });
  it('returns false for non matches', function() {
    eq(R.pathEq(['a'], '1', obj), false);
    eq(R.pathEq(['b', 0, 'ba'], 3, obj), false);
  });
  it('returns false for non existing values', function() {
    eq(R.pathEq(['c'], 'foo', obj), false);
    eq(R.pathEq(['c', 'd'], 'foo', obj), false);
  });
  it('accepts empty path', function() {
    eq(R.pathEq([], 42, {a: 1, b: 2}), false);
    eq(R.pathEq([], obj, obj), true);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.pathEq(['value'], 0, {value: -0}), false);
    eq(R.pathEq(['value'], -0, {value: 0}), false);
    eq(R.pathEq(['value'], NaN, {value: NaN}), true);
    eq(R.pathEq(['value'], new Just([42]), {value: new Just([42])}), true);
  });
```

> pathOr

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('pathOr', function() {
  var deepObject = {a: {b: {c: 'c'}}, falseVal: false, nullVal: null, undefinedVal: undefined, arrayVal: ['arr']};
  it('takes a path and an object and returns the value at the path or the default value', function() {
    var obj = {
      a: {
        b: {
          c: 100,
          d: 200
        },
        e: {
          f: [100, 101, 102],
          g: 'G'
        },
        h: 'H'
      },
      i: 'I',
      j: ['J']
    };
    eq(R.pathOr('Unknown', ['a', 'b', 'c'], obj), 100);
    eq(R.pathOr('Unknown', [], obj), obj);
    eq(R.pathOr('Unknown', ['a', 'e', 'f', 1], obj), 101);
    eq(R.pathOr('Unknown', ['j', 0], obj), 'J');
    eq(R.pathOr('Unknown', ['j', 1], obj), 'Unknown');
    eq(R.pathOr('Unknown', ['a', 'b', 'c'], null), 'Unknown');
  });
  it("gets a deep property's value from objects", function() {
    eq(R.pathOr('Unknown', ['a', 'b', 'c'], deepObject), 'c');
    eq(R.pathOr('Unknown', ['a'], deepObject), deepObject.a);
  });
  it('returns the default value for items not found', function() {
    eq(R.pathOr('Unknown', ['a', 'b', 'foo'], deepObject), 'Unknown');
    eq(R.pathOr('Unknown', ['bar'], deepObject), 'Unknown');
  });
  it('returns the default value for null/undefined', function() {
    eq(R.pathOr('Unknown', ['toString'], null), 'Unknown');
    eq(R.pathOr('Unknown', ['toString'], undefined), 'Unknown');
  });
  it('works with falsy items', function() {
    eq(R.pathOr('Unknown', ['toString'], false), Boolean.prototype.toString);
  });
```

> paths

Reason for failing:  Ramda method supports negative indexes

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('paths', function() {
  var obj = {
    a: {
      b: {
        c: 1,
        d: 2
      }
    },
    p: [{q: 3}, 'Hi'],
    x: {
      y: 'Alice',
      z: [[{}]]
    }
  };
  it('takes paths and returns values at those paths', function() {
    eq(R.paths([['a', 'b', 'c'], ['x', 'y']], obj), [1, 'Alice']);
    eq(R.paths([['a', 'b', 'd'], ['p', 'q']], obj), [2, undefined]);
  });
  it('takes a paths that contains indices into arrays', function() {
    eq(R.paths([['p', 0, 'q'], ['x', 'z', 0, 0]], obj), [3, {}]);
    eq(R.paths([['p', 0, 'q'], ['x', 'z', 2, 1]], obj), [3, undefined]);
  });
  it('takes a path that contains negative indices into arrays', function() {
    eq(R.paths([['p', -2, 'q'], ['p', -1]], obj), [3, 'Hi']);
    eq(R.paths([['p', -4, 'q'], ['x', 'z', -1, 0]], obj), [undefined, {}]);
  });
  it("gets a deep property's value from objects", function() {
    eq(R.paths([['a', 'b']], obj), [obj.a.b]);
    eq(R.paths([['p', 0]], obj), [obj.p[0]]);
  });
  it('returns undefined for items not found', function() {
    eq(R.paths([['a', 'x', 'y']], obj), [undefined]);
    eq(R.paths([['p', 2]], obj), [undefined]);
  });
```

> pick

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('pick', function() {
  var obj = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, 1: 7};
  it('copies the named properties of an object to the new object', function() {
    eq(R.pick(['a', 'c', 'f'], obj), {a: 1, c: 3, f: 6});
  });
  it('handles numbers as properties', function() {
    eq(R.pick([1], obj), {1: 7});
  });
  it('ignores properties not included', function() {
    eq(R.pick(['a', 'c', 'g'], obj), {a: 1, c: 3});
  });
  it('retrieves prototype properties', function() {
    var F = function(param) {this.x = param;};
    F.prototype.y = 40; F.prototype.z = 50;
    var obj = new F(30);
    obj.v = 10; obj.w = 20;
    eq(R.pick(['w', 'x', 'y'], obj), {w: 20, x: 30, y: 40});
  });
```

> pickAll

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('pickAll', function() {
  var obj = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6};
  it('copies the named properties of an object to the new object', function() {
    eq(R.pickAll(['a', 'c', 'f'], obj), {a: 1, c: 3, f: 6});
  });
  it('includes properties not present on the input object', function() {
    eq(R.pickAll(['a', 'c', 'g'], obj), {a: 1, c: 3, g: undefined});
  });
```

> pipe

Reason for failing:  Ramda method passes context to functions | Rambda composed functions have no length

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('pipe', function() {
  it('is a variadic function', function() {
    eq(typeof R.pipe, 'function');
    eq(R.pipe.length, 0);
  });
  it('performs left-to-right function composition', function() {
    //  f :: (String, Number?) -> ([Number] -> [Number])
    var f = R.pipe(parseInt, R.multiply, R.map);
    eq(f.length, 2);
    eq(f('10')([1, 2, 3]), [10, 20, 30]);
    eq(f('10', 2)([1, 2, 3]), [2, 4, 6]);
  });
  it('passes context to functions', function() {
    function x(val) {
      return this.x * val;
    }
    function y(val) {
      return this.y * val;
    }
    function z(val) {
      return this.z * val;
    }
    var context = {
      a: R.pipe(x, y, z),
      x: 4,
      y: 2,
      z: 1
    };
    eq(context.a(5), 40);
  });
  it('throws if given no arguments', function() {
    assert.throws(
      function() { R.pipe(); },
      function(err) {
        return err.constructor === Error &&
               err.message === 'pipe requires at least one argument';
      }
    );
  });
  it('can be applied to one argument', function() {
    var f = function(a, b, c) { return [a, b, c]; };
    var g = R.pipe(f);
    eq(g.length, 3);
    eq(g(1, 2, 3), [1, 2, 3]);
  });
```

> pluck

Reason for failing:  Ramda method behaves as a transducer

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('pluck', function() {
  var people = [
    {name: 'Fred', age: 23},
    {name: 'Wilma', age: 21},
    {name: 'Pebbles', age: 2}
  ];
  it('returns a function that maps the appropriate property over an array', function() {
    var nm = R.pluck('name');
    eq(typeof nm, 'function');
    eq(nm(people), ['Fred', 'Wilma', 'Pebbles']);
  });
  it('behaves as a transducer when given a transducer in list position', function() {
    var numbers = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
    var transducer = R.compose(R.pluck('a'), R.map(R.add(1)), R.take(2));
    eq(R.transduce(transducer, R.flip(R.append), [], numbers), [2, 3]);
  });
```

> prepend

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('prepend', function() {
  it('adds the element to the beginning of the list', function() {
    eq(R.prepend('x', ['y', 'z']), ['x', 'y', 'z']);
    eq(R.prepend(['a', 'z'], ['x', 'y']), [['a', 'z'], 'x', 'y']);
  });
  it('works on empty list', function() {
    eq(R.prepend(1, []), [1]);
  });
```

> product

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('product', function() {
  it('multiplies together the array of numbers supplied', function() {
    eq(R.product([1, 2, 3, 4]), 24);
  });
```

> prop

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var fc = require('fast-check');

describe('prop', function() {
  var fred = {name: 'Fred', age: 23};
  it('returns a function that fetches the appropriate property', function() {
    var nm = R.prop('name');
    eq(typeof nm, 'function');
    eq(nm(fred), 'Fred');
  });
  it('handles number as property', function() {
    var deities = ['Cthulhu', 'Dagon', 'Yog-Sothoth'];
    eq(R.prop(0, deities), 'Cthulhu');
    eq(R.prop(1, deities), 'Dagon');
    eq(R.prop(2, deities), 'Yog-Sothoth');
    eq(R.prop(-1, deities), 'Yog-Sothoth');
  });
  it('shows the same behaviour as path for a nonexistent property', function() {
    var propResult = R.prop('incorrect', fred);
    var pathResult = R.path(['incorrect'], fred);
    eq(propResult, pathResult);
  });
  it('shows the same behaviour as path for an undefined property', function() {
    var propResult = R.prop(undefined, fred);
    var pathResult = R.path([undefined], fred);
    eq(propResult, pathResult);
  });
  it('shows the same behaviour as path for a null property', function() {
    var propResult = R.prop(null, fred);
    var pathResult = R.path([null], fred);
    eq(propResult, pathResult);
  });
  it('shows the same behaviour as path for a valid property and object', function() {
    var propResult = R.prop('age', fred);
    var pathResult = R.path(['age'], fred);
    eq(propResult, pathResult);
  });
  it('shows the same behaviour as path for a null object', function() {
    var propResult = R.prop('age', null);
    var pathResult = R.path(['age'], null);
    eq(propResult, pathResult);
  });
  it('shows the same behaviour as path for an undefined object', function() {
    var propResult, propException, pathResult, pathException;
    try {
      propResult = R.prop('name', undefined);
    } catch (e) {
      propException = e;
    }
    try {
      pathResult = R.path(['name'], undefined);
    } catch (e) {
      pathException = e;
    }
    eq(propResult, pathResult);
    eq(propException, pathException);
  });
  it('returns that value associated to a property given valid one', function() {
    fc.assert(
      fc.property(fc.string(), fc.anything(), function(p, value) {
        const o = { [p]: value };
        eq(R.prop(p, o), value);
      })
    );
  });
  it('shows the same behaviour as path on any object', function() {
    fc.assert(
      fc.property(fc.string(), fc.object(), function(p, o) {
        eq(R.prop(p, o), R.path([p], o));
      })
    );
  });
  it('shows the same behaviour as path on any value', function() {
    fc.assert(
      fc.property(fc.string(), fc.anything(), function(p, o) {
        var propResult, propException, pathResult, pathException;
        try {
          propResult = R.prop(p, o);
        } catch (e) {
          propException = e;
        }
        try {
          pathResult = R.path([p], o);
        } catch (e) {
          pathException = e;
        }
        eq(propResult, pathResult);
        eq(propException, pathException);
      })
    );
  });
});
```

> propEq

Reason for failing:  Ramda method pass to `equals` method if available

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('propEq', function() {
  var obj1 = {name: 'Abby', age: 7, hair: 'blond'};
  var obj2 = {name: 'Fred', age: 12, hair: 'brown'};
  it('determines whether a particular property matches a given value for a specific object', function() {
    eq(R.propEq('name', 'Abby', obj1), true);
    eq(R.propEq('hair', 'brown', obj2), true);
    eq(R.propEq('hair', 'blond', obj2), false);
  });
  it('handles number as property', function() {
    var deities = ['Cthulhu', 'Dagon', 'Yog-Sothoth'];
    eq(R.propEq(0, 'Cthulhu', deities), true);
    eq(R.propEq(1, 'Dagon', deities), true);
    eq(R.propEq(2, 'Yog-Sothoth', deities), true);
    eq(R.propEq(-1, 'Yog-Sothoth', deities), true);
    eq(R.propEq(3, undefined, deities), true);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.propEq('value', 0, {value: -0}), false);
    eq(R.propEq('value', -0, {value: 0}), false);
    eq(R.propEq('value', NaN, {value: NaN}), true);
    eq(R.propEq('value', new Just([42]), {value: new Just([42])}), true);
  });
  it('returns false if called with a null or undefined object', function() {
    eq(R.propEq('name', 'Abby', null), false);
    eq(R.propEq('name', 'Abby', undefined), false);
  });
```

> propIs

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('propIs', function() {
  it('returns true if the specified object property is of the given type', function() {
    eq(R.propIs(Number, 'value', {value: 1}), true);
  });
  it('returns false otherwise', function() {
    eq(R.propIs(String, 'value', {value: 1}), false);
    eq(R.propIs(String, 'value', {}), false);
  });
  it('handles number as property', function() {
    var deities = ['Cthulhu', 'Dagon', 'Yog-Sothoth'];
    eq(R.propIs(String, 0, deities), true);
    eq(R.propIs(String, 1, deities), true);
    eq(R.propIs(String, 2, deities), true);
    eq(R.propIs(String, -1, deities), true);
    eq(R.propIs(String, 3, deities), false);
  });
```

> propOr

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('propOr', function() {
  var fred = {name: 'Fred', age: 23};
  var anon = {age: 99};
  var nm = R.propOr('Unknown', 'name');
  it('returns a function that fetches the appropriate property', function() {
    eq(typeof nm, 'function');
    eq(nm(fred), 'Fred');
  });
  it('returns the default value when the property does not exist', function() {
    eq(nm(anon), 'Unknown');
  });
  it('returns the default value when the object is nil', function() {
    eq(nm(null), 'Unknown');
    eq(nm(void 0), 'Unknown');
  });
  it('uses the default when supplied an object with a nil value', function() {
    eq(R.propOr('foo', 'x', {x: null}), 'foo');
    eq(R.propOr('foo', 'x', {x: undefined}), 'foo');
  });
  it('handles number as property', function() {
    var deities = ['Cthulhu', 'Dagon', 'Yog-Sothoth'];
    eq(R.propOr('Unknown', 0, deities), 'Cthulhu');
    eq(R.propOr('Unknown', 1, deities), 'Dagon');
    eq(R.propOr('Unknown', 2, deities), 'Yog-Sothoth');
    eq(R.propOr('Unknown', -1, deities), 'Yog-Sothoth');
    eq(R.propOr('Unknown', 3, deities), 'Unknown');
  });
  it('shows the same behaviour as pathOr for a nonexistent property', function() {
    var propOrResult = R.propOr('Unknown', 'incorrect', fred);
    var pathOrResult = R.pathOr('Unknown', ['incorrect'], fred);
    eq(propOrResult, pathOrResult);
  });
  it('shows the same behaviour as pathOr for an undefined property', function() {
    var propOrResult = R.propOr('Unknown', undefined, fred);
    var pathOrResult = R.pathOr('Unknown', [undefined], fred);
    eq(propOrResult, pathOrResult);
  });
  it('shows the same behaviour as pathOr for a null property', function() {
    var propOrResult = R.propOr('Unknown', null, fred);
    var pathOrResult = R.pathOr('Unknown', [null], fred);
    eq(propOrResult, pathOrResult);
  });
  it('shows the same behaviour as pathOr for a valid property and object', function() {
    var propOrResult = R.propOr('Unknown', 'age', fred);
    var pathOrResult = R.pathOr('Unknown', ['age'], fred);
    eq(propOrResult, pathOrResult);
  });
  it('shows the same behaviour as pathOr for a null object', function() {
    var propOrResult = R.propOr('Unknown', 'age', null);
    var pathOrResult = R.pathOr('Unknown', ['age'], null);
    eq(propOrResult, pathOrResult);
  });
  it('shows the same behaviour as pathOr for an undefined object', function() {
    var propOrResult = R.propOr('Unknown', 'age', undefined);
    var pathOrResult = R.pathOr('Unknown', ['age'], undefined);
    eq(propOrResult, pathOrResult);
  });
```

> props

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('props', function() {
  var obj = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6};
  it('returns empty array if no properties requested', function() {
    eq(R.props([], obj), []);
  });
  it('returns values for requested properties', function() {
    eq(R.props(['a', 'e'], obj), [1, 5]);
  });
  it('preserves order', function() {
    eq(R.props(['f', 'c', 'e'], obj), [6, 3, 5]);
  });
  it('returns undefined for nonexistent properties', function() {
    var ps = R.props(['a', 'nonexistent'], obj);
    eq(ps.length, 2);
    eq(ps[0], 1);
    eq(ps[1], void 0);
  });
```

> range

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('range', function() {
  it('returns list of numbers', function() {
    eq(R.range(0, 5), [0, 1, 2, 3, 4]);
    eq(R.range(4, 7), [4, 5, 6]);
  });
  it('returns the empty list if the first parameter is not larger than the second', function() {
    eq(R.range(7, 3), []);
    eq(R.range(5, 5), []);
  });
  it('returns an empty array if from > to', function() {
    var result = R.range(10, 5);
    eq(result, []);
    result.push(5);
    eq(R.range(10, 5), []);
  });
  it('terminates given bad input', function() {
    assert.throws(
      function() { R.range('a', 'z'); },
      function(err) {
        return err.constructor === TypeError &&
               err.message === 'Both arguments to range must be numbers';
      }
    );
  });
```

> reduce

Reason for failing:  Rambda library doesn't have `R.reduced` method | Ramda method pass to `reduce` method

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('reduce', function() {
  var add = function(a, b) {return a + b;};
  var mult = function(a, b) {return a * b;};
  it('folds simple functions over arrays with the supplied accumulator', function() {
    eq(R.reduce(add, 0, [1, 2, 3, 4]), 10);
    eq(R.reduce(mult, 1, [1, 2, 3, 4]), 24);
  });
  it('dispatches to objects that implement `reduce`', function() {
    var obj = {x: [1, 2, 3], reduce: function() { return 'override'; }};
    eq(R.reduce(add, 0, obj), 'override');
    eq(R.reduce(add, 10, obj), 'override');
  });
  it('returns the accumulator for an empty array', function() {
    eq(R.reduce(add, 0, []), 0);
    eq(R.reduce(mult, 1, []), 1);
    eq(R.reduce(R.concat, [], []), []);
  });
  it('Prefers the use of the iterator of an object over reduce (and handles short-circuits)', function() {
    var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
    function Reducible(arr) {
      this.arr = arr;
    }
    Reducible.prototype.reduce = function(f, init) {
      var acc = init;
      for (var i = 0; i < this.arr.length; i += 1) {
        acc = f(acc, this.arr[i]);
      }
      return acc;
    };
    Reducible.prototype[symIterator] = function() {
      var a = this.arr;
      return {
        _pos: 0,
        next: function() {
          if (this._pos < a.length) {
            var v = a[this._pos];
            this._pos += 1;
            return {
              value: v,
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        }
      };
    };
    var xf = R.take(2);
    var apendingT = { };
    apendingT['@@transducer/result'] = R.identity;
    apendingT['@@transducer/step'] = R.flip(R.append);
    var rfn = xf(apendingT);
    var list = new Reducible([1, 2, 3, 4, 5, 6]);
    eq(R.reduce(rfn, [], list), [1, 2]);
  });
  it('short circuits with reduced', function() {
    var addWithMaxOf10 = function(acc, val) {return acc + val > 10 ? R.reduced(acc) : acc + val;};
    eq(R.reduce(addWithMaxOf10, 0, [1, 2, 3, 4]), 10);
    eq(R.reduce(addWithMaxOf10, 0, [2, 4, 6, 8]), 6);
  });
```

> reject

Reason for failing:  Ramda method dispatches to `filter` method

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('reject', function() {
  var even = function(x) {return x % 2 === 0;};
  it('reduces an array to those not matching a filter', function() {
    eq(R.reject(even, [1, 2, 3, 4, 5]), [1, 3, 5]);
  });
  it('returns an empty array if no element matches', function() {
    eq(R.reject(function(x) { return x < 100; }, [1, 9, 99]), []);
  });
  it('returns an empty array if asked to filter an empty array', function() {
    eq(R.reject(function(x) { return x > 100; }, []), []);
  });
  it('returns an empty array if no element matches', function() {
    eq(R.reject(function(x) { return x < 100; }, [1, 9, 99]), []);
  });
  it('returns an empty array if asked to filter an empty array', function() {
    eq(R.reject(function(x) { return x > 100; }, []), []);
  });
  it('filters objects', function() {
    eq(R.reject(R.equals(0), {}), {});
    eq(R.reject(R.equals(0), {x: 0, y: 0, z: 0}), {});
    eq(R.reject(R.equals(0), {x: 1, y: 0, z: 0}), {x: 1});
    eq(R.reject(R.equals(0), {x: 1, y: 2, z: 0}), {x: 1, y: 2});
    eq(R.reject(R.equals(0), {x: 1, y: 2, z: 3}), {x: 1, y: 2, z: 3});
  });
  it('dispatches to `filter` method', function() {
    function Nothing() {}
    Nothing.value = new Nothing();
    Nothing.prototype.filter = function() {
      return this;
    };
    function Just(x) { this.value = x; }
    Just.prototype.filter = function(pred) {
      return pred(this.value) ? this : Nothing.value;
    };
    var m = new Just(42);
    eq(R.filter(R.T, m), m);
    eq(R.filter(R.F, m), Nothing.value);
    eq(R.reject(R.T, m), Nothing.value);
    eq(R.reject(R.F, m), m);
  });
```

> repeat

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('repeat', function() {
  it('returns a lazy list of identical values', function() {
    eq(R.repeat(0, 5), [0, 0, 0, 0, 0]);
  });
  it('can accept any value, including `null`', function() {
    eq(R.repeat(null, 3), [null, null, null]);
  });
```

> replace

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('replace', function() {
  it('replaces substrings of the input string', function() {
    eq(R.replace('1', 'one', '1 two three'), 'one two three');
  });
  it('replaces regex matches of the input string', function() {
    eq(R.replace(/\d+/g, 'num', '1 2 three'), 'num num three');
  });
```

> reverse

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var fc = require('fast-check');

describe('reverse', function() {
  it('reverses arrays', function() {
    eq(R.reverse([]), []);
    eq(R.reverse([1]), [1]);
    eq(R.reverse([1, 2]), [2, 1]);
    eq(R.reverse([1, 2, 3]), [3, 2, 1]);
  });
  it('reverses twice an array should be the array itself', function() {
    fc.assert(fc.property(fc.array(fc.anything()), function(array) {
      eq(R.reverse(R.reverse(array)), array);
    }));
  });
  it('reverses strings', function() {
    eq(R.reverse(''), '');
    eq(R.reverse('a'), 'a');
    eq(R.reverse('ab'), 'ba');
    eq(R.reverse('abc'), 'cba');
  });
  it('reverses twice a string should be the string itself', function() {
    fc.assert(fc.property(fc.fullUnicodeString(), function(str) {
      eq(R.reverse(R.reverse(str)), str);
    }));
  });
```

> slice

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('slice', function() {
  it('retrieves the proper sublist of a list', function() {
    var list = [8, 6, 7, 5, 3, 0, 9];
    eq(R.slice(2, 5, list), [7, 5, 3]);
  });
  it('handles array-like object', function() {
    var args = (function() { return arguments; }(1, 2, 3, 4, 5));
    eq(R.slice(1, 4, args), [2, 3, 4]);
  });
  it('can operate on strings', function() {
    eq(R.slice(0, 0, 'abc'), '');
    eq(R.slice(0, 1, 'abc'), 'a');
    eq(R.slice(0, 2, 'abc'), 'ab');
    eq(R.slice(0, 3, 'abc'), 'abc');
    eq(R.slice(0, 4, 'abc'), 'abc');
    eq(R.slice(1, 0, 'abc'), '');
    eq(R.slice(1, 1, 'abc'), '');
    eq(R.slice(1, 2, 'abc'), 'b');
    eq(R.slice(1, 3, 'abc'), 'bc');
    eq(R.slice(1, 4, 'abc'), 'bc');
    eq(R.slice(0, -4, 'abc'), '');
    eq(R.slice(0, -3, 'abc'), '');
    eq(R.slice(0, -2, 'abc'), 'a');
    eq(R.slice(0, -1, 'abc'), 'ab');
    eq(R.slice(0, -0, 'abc'), '');
    eq(R.slice(-2, -4, 'abc'), '');
    eq(R.slice(-2, -3, 'abc'), '');
    eq(R.slice(-2, -2, 'abc'), '');
    eq(R.slice(-2, -1, 'abc'), 'b');
    eq(R.slice(-2, -0, 'abc'), '');
  });
```

> sort

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('sort', function() {
  it('sorts the elements of a list', function() {
    eq(R.sort(function(a, b) {return a - b;}, [3, 1, 8, 1, 2, 5]), [1, 1, 2, 3, 5, 8]);
  });
  it('does not affect the list passed supplied', function() {
    var list = [3, 1, 8, 1, 2, 5];
    eq(R.sort(function(a, b) {return a - b;}, list), [1, 1, 2, 3, 5, 8]);
    eq(list, [3, 1, 8, 1, 2, 5]);
  });
```

> sortBy

Reason for failing:  Ramda method works with array-like objects

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

var albums = [
  {title: 'Art of the Fugue', artist: 'Glenn Gould', genre: 'Baroque'},
  {title: 'A Farewell to Kings', artist: 'Rush', genre: 'Rock'},
  {title: 'Timeout', artist: 'Dave Brubeck Quartet', genre: 'Jazz'},
  {title: 'Fly By Night', artist: 'Rush', genre: 'Rock'},
  {title: 'Goldberg Variations', artist: 'Daniel Barenboim', genre: 'Baroque'},
  {title: 'New World Symphony', artist: 'Leonard Bernstein', genre: 'Romantic'},
  {title: 'Romance with the Unseen', artist: 'Don Byron', genre: 'Jazz'},
  {title: 'Somewhere In Time', artist: 'Iron Maiden', genre: 'Metal'},
  {title: 'In Times of Desparation', artist: 'Danny Holt', genre: 'Modern'},
  {title: 'Evita', artist: 'Various', genre: 'Broadway'},
  {title: 'Five Leaves Left', artist: 'Nick Drake', genre: 'Folk'},
  {title: 'The Magic Flute', artist: 'John Eliot Gardiner', genre: 'Classical'}
];
describe('sortBy', function() {
  it('sorts by a simple property of the objects', function() {
    var sortedAlbums = R.sortBy(R.prop('title'), albums);
    eq(sortedAlbums.length, albums.length);
    eq(sortedAlbums[0].title, 'A Farewell to Kings');
    eq(sortedAlbums[11].title, 'Timeout');
  });
  it('preserves object identity', function() {
    var a = {value: 'a'};
    var b = {value: 'b'};
    var result = R.sortBy(R.prop('value'), [b, a]);
    eq(result[0], a);
    eq(result[1], b);
  });
  it('sorts array-like object', function() {
    var args = (function() { return arguments; }('c', 'a', 'b'));
    var result = R.sortBy(R.identity, args);
    eq(result[0], 'a');
    eq(result[1], 'b');
    eq(result[2], 'c');
  });
```

> split

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('split', function() {
  it('splits a string into an array', function() {
    eq(R.split('.', 'a.b.c.xyz.d'), ['a', 'b', 'c', 'xyz', 'd']);
  });
  it('the split string can be arbitrary', function() {
    eq(R.split('at', 'The Cat in the Hat sat on the mat'), ['The C', ' in the H', ' s', ' on the m', '']);
  });
```

> splitAt

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('splitAt', function() {
  it('splits an array at a given index', function() {
    eq(R.splitAt(1, [1, 2, 3]), [[1], [2, 3]]);
  });
  it('splits a string at a given index', function() {
    eq(R.splitAt(5, 'hello world'), ['hello', ' world']);
  });
  it('can handle index greater than array length', function() {
    eq(R.splitAt(4, [1, 2]), [[1, 2], []]);
  });
  it('can support negative index', function() {
    eq(R.splitAt(-1, 'foobar'), ['fooba', 'r']);
  });
```

> splitEvery

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('splitEvery', function() {
  it('splits a collection into slices of the specified length', function() {
    eq(R.splitEvery(1, [1, 2, 3, 4]), [[1], [2], [3], [4]]);
    eq(R.splitEvery(2, [1, 2, 3, 4]), [[1, 2], [3, 4]]);
    eq(R.splitEvery(3, [1, 2, 3, 4]), [[1, 2, 3], [4]]);
    eq(R.splitEvery(4, [1, 2, 3, 4]), [[1, 2, 3, 4]]);
    eq(R.splitEvery(5, [1, 2, 3, 4]), [[1, 2, 3, 4]]);
    eq(R.splitEvery(3, []), []);
    eq(R.splitEvery(1, 'abcd'), ['a', 'b', 'c', 'd']);
    eq(R.splitEvery(2, 'abcd'), ['ab', 'cd']);
    eq(R.splitEvery(3, 'abcd'), ['abc', 'd']);
    eq(R.splitEvery(4, 'abcd'), ['abcd']);
    eq(R.splitEvery(5, 'abcd'), ['abcd']);
    eq(R.splitEvery(3, ''), []);
  });
  it('throws if first argument is not positive', function() {
    var test = function(err) {
      return err.constructor === Error &&
             err.message === 'First argument to splitEvery must be a positive integer';
    };
    assert.throws(function() { R.splitEvery(0, []); }, test);
    assert.throws(function() { R.splitEvery(0, ''); }, test);
    assert.throws(function() { R.splitEvery(-1, []); }, test);
    assert.throws(function() { R.splitEvery(-1, ''); }, test);
  });
```

> splitWhen

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('splitWhen', function() {
  it('splits an array at the first instance to satisfy the predicate', function() {
    eq(R.splitWhen(R.equals(2), [1, 2, 3]), [[1], [2, 3]]);
  });
  it('retains all original elements', function() {
    eq(R.splitWhen(R.T, [1, 1, 1]), [[], [1, 1, 1]]);
  });
  it('only splits once', function() {
    eq(R.splitWhen(R.equals(2), [1, 2, 3, 1, 2, 3]), [[1], [2, 3, 1, 2, 3]]);
  });
```

> startsWith

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('startsWith', function() {
  it('should return true when a string starts with the provided value', function() {
    eq(R.startsWith('a', 'abc'), true);
  });
  it('should return true when a long string starts with the provided value', function() {
    eq(R.startsWith('astro', 'astrology'), true);
  });
  it('should return false when a string does not start with the provided value', function() {
    eq(R.startsWith('b', 'abc'), false);
  });
  it('should return false when a long string does not start with the provided value', function() {
    eq(R.startsWith('stro', 'astrology'), false);
  });
  it('should return true when an array starts with the provided value', function() {
    eq(R.startsWith(['a'], ['a', 'b', 'c']), true);
  });
  it('should return true when an array starts with the provided values', function() {
    eq(R.startsWith(['a', 'b'], ['a', 'b', 'c']), true);
  });
  it('should return false when an array does not start with the provided value', function() {
    eq(R.startsWith(['b'], ['a', 'b', 'c']), false);
  });
  it('should return false when an array does not start with the provided values', function() {
    eq(R.startsWith(['b', 'c'], ['a', 'b', 'c']), false);
  });
```

> subtract

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('subtract', function() {
  it('subtracts two numbers', function() {
    eq(R.subtract(22, 7), 15);
  });
  it('coerces its arguments to numbers', function() {
    eq(R.subtract('1', '2'), -1);
    eq(R.subtract(1, '2'), -1);
    eq(R.subtract(true, false), 1);
    eq(R.subtract(null, null), 0);
    eq(R.subtract(undefined, undefined), NaN);
    eq(R.subtract(new Date(1), new Date(2)), -1);
  });
```

> sum

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('sum', function() {
  it('adds together the array of numbers supplied', function() {
    eq(R.sum([1, 2, 3, 4]), 10);
  });
  it('does not save the state of the accumulator', function() {
    eq(R.sum([1, 2, 3, 4]), 10);
    eq(R.sum([1]), 1);
    eq(R.sum([5, 5, 5, 5, 5]), 25);
  });
```

> symmetricDifference

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var fc = require('fast-check');

describe('symmetricDifference', function() {
  var M = [1, 2, 3, 4];
  var M2 = [1, 2, 3, 4, 1, 2, 3, 4];
  var N = [3, 4, 5, 6];
  var N2 = [3, 3, 4, 4, 5, 5, 6, 6];
  var Z = [3, 4, 5, 6, 10];
  var Z2 = [1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8];
  it('finds the set of all elements in the first or second list but not both', function() {
    eq(R.symmetricDifference(M, N), [1, 2, 5, 6]);
  });
  it('does not allow duplicates in the output even if the input lists had duplicates', function() {
    eq(R.symmetricDifference(M2, N2), [1, 2, 5, 6]);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.symmetricDifference([0], [-0]).length, 2);
    eq(R.symmetricDifference([-0], [0]).length, 2);
    eq(R.symmetricDifference([NaN], [NaN]).length, 0);
    eq(R.symmetricDifference([new Just([42])], [new Just([42])]).length, 0);
  });
  it('works for arrays of different lengths', function() {
    eq(R.symmetricDifference(Z, Z2), [10, 1, 2, 7, 8]);
    eq(R.symmetricDifference(Z2, Z), [1, 2, 7, 8, 10]);
  });
  it('will not create a "sparse" array', function() {
    eq(R.symmetricDifference(M2, [3]).length, 3);
  });
  it('returns an empty array if there are no different elements', function() {
    eq(R.symmetricDifference(M2, M), []);
    eq(R.symmetricDifference(M, M2), []);
  });
  // Arbitrary producing arrays of unique values (with respect to R.equals)
  var compatibleREquals = fc.array(fc.anything({
    maxDepth: 0,
    withBoxedValues: true,
    withNullPrototype: true,
    withObjectString: true
  })).map(array => R.uniq(array));
  it('returns empty arrays when receiving twice the same array', function() {
    fc.assert(fc.property(fc.clone(compatibleREquals, 2), function(arrays) {
      var A1 = arrays[0];
      var A2 = arrays[1];
      eq(R.symmetricDifference(A1, A2), []);
    }));
  });
  it('returns empty arrays when receiving an array and a permutation of it', function() {
    fc.assert(fc.property(fc.clone(compatibleREquals, 2).chain(function(arrays) {
      return fc.tuple(fc.constant(arrays[0]), fc.shuffledSubarray(arrays[1], arrays[1].length, arrays[1].length));
    }), function(arrays) {
      var A1 = arrays[0];
      var A2 = arrays[1];
      eq(R.symmetricDifference(A1, A2), []);
    }));
  });
  it('returns missing items when receiving an array and a permuted subset of it', function() {
    fc.assert(fc.property(fc.clone(compatibleREquals, 2).chain(function(arrays) {
      return fc.tuple(fc.constant(arrays[0]), fc.shuffledSubarray(arrays[1]));
    }), function(arrays) {
      var A1 = arrays[0];
      var A2 = arrays[1];
      eq(R.symmetricDifference(A1, A2).length, A1.length - A2.length);
    }));
  });
  it('returns an array not containing too many items', function() {
    fc.assert(fc.property(compatibleREquals, compatibleREquals, compatibleREquals, compatibleREquals, compatibleREquals, function(A1, A2, B, C1, C2) {
      var M = R.uniq(A1.concat(B).concat(C1));
      var N = R.uniq(A2.concat(B).concat(C2));
      var difference = R.symmetricDifference(M, N);
      var upperBoundDifferenceLength = A1.length + A2.length + C1.length + C2.length;
      eq(difference.length <= upperBoundDifferenceLength, true);
    }));
  });
  it('returns an array containing only items coming from one of the sources', function() {
    fc.assert(fc.property(compatibleREquals, compatibleREquals, compatibleREquals, compatibleREquals, compatibleREquals, function(A1, A2, B, C1, C2) {
      var M = R.uniq(A1.concat(B).concat(C1));
      var N = R.uniq(A2.concat(B).concat(C2));
      var MN = R.uniq(M.concat(N));
      var difference = R.symmetricDifference(M, N);
      eq(R.symmetricDifference(difference, MN).length, MN.length - difference.length);
    }));
  });
});
```

> tail

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('tail', function() {
  it('returns the tail of an ordered collection', function() {
    eq(R.tail([1, 2, 3]), [2, 3]);
    eq(R.tail([2, 3]), [3]);
    eq(R.tail([3]), []);
    eq(R.tail([]), []);
    eq(R.tail('abc'), 'bc');
    eq(R.tail('bc'), 'c');
    eq(R.tail('c'), '');
    eq(R.tail(''), '');
  });
  it('throws if applied to null or undefined', function() {
    assert.throws(function() { R.tail(null); }, TypeError);
    assert.throws(function() { R.tail(undefined); }, TypeError);
  });
```

> take

Reason for failing:  Rambda library doesn't have 'R.into` method

```javascript
var assert = require('assert');
var sinon = require('sinon');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('take', function() {
  it('takes only the first `n` elements from a list', function() {
    eq(R.take(3, ['a', 'b', 'c', 'd', 'e', 'f', 'g']), ['a', 'b', 'c']);
  });
  it('returns only as many as the array can provide', function() {
    eq(R.take(3, [1, 2]), [1, 2]);
    eq(R.take(3, []), []);
  });
  it('returns an equivalent list if `n` is < 0', function() {
    eq(R.take(-1, [1, 2, 3]), [1, 2, 3]);
    eq(R.take(-Infinity, [1, 2, 3]), [1, 2, 3]);
  });
  it('never returns the input array', function() {
    var xs = [1, 2, 3];
    assert.notStrictEqual(R.take(3, xs), xs);
    assert.notStrictEqual(R.take(Infinity, xs), xs);
    assert.notStrictEqual(R.take(-1, xs), xs);
  });
  it('can operate on strings', function() {
    eq(R.take(3, 'Ramda'), 'Ram');
    eq(R.take(2, 'Ramda'), 'Ra');
    eq(R.take(1, 'Ramda'), 'R');
    eq(R.take(0, 'Ramda'), '');
  });
  it('handles zero correctly (#1224)', function() {
    eq(R.into([], R.take(0), [1, 2, 3]), []);
  });
  it('steps correct number of times', function() {
    var spy = sinon.spy();
    R.into([], R.compose(R.map(spy), R.take(2)), [1, 2, 3]);
    sinon.assert.calledTwice(spy);
  });
  it('transducer called for every member of list if `n` is < 0', function() {
    var spy = sinon.spy();
    R.into([], R.compose(R.map(spy), R.take(-1)), [1, 2, 3]);
    sinon.assert.calledThrice(spy);
  });
```

> takeLast

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('takeLast', function() {
  it('takes only the last `n` elements from a list', function() {
    eq(R.takeLast(3, ['a', 'b', 'c', 'd', 'e', 'f', 'g']), ['e', 'f', 'g']);
  });
  it('returns only as many as the array can provide', function() {
    eq(R.takeLast(3, [1, 2]), [1, 2]);
    eq(R.takeLast(3, []), []);
  });
  it('returns an equivalent list if `n` is < 0', function() {
    eq(R.takeLast(-1, [1, 2, 3]), [1, 2, 3]);
    eq(R.takeLast(-Infinity, [1, 2, 3]), [1, 2, 3]);
  });
  it('never returns the input array', function() {
    var xs = [1, 2, 3];
    assert.notStrictEqual(R.takeLast(3, xs), xs);
    assert.notStrictEqual(R.takeLast(Infinity, xs), xs);
    assert.notStrictEqual(R.takeLast(-1, xs), xs);
  });
  it('can operate on strings', function() {
    eq(R.takeLast(3, 'Ramda'), 'mda');
  });
  it('handles zero correctly (#1224)', function() {
    eq(R.takeLast(0, [1, 2, 3]), []);
  });
```

> takeLastWhile

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('takeLastWhile', function() {
  it('continues taking elements while the function reports `true`', function() {
    eq(R.takeLastWhile(function(x) {return x !== 5;}, [1, 3, 5, 7, 9]), [7, 9]);
  });
  it('starts at the right arg and acknowledges undefined', function() {
    eq(R.takeLastWhile(function() { assert(false); }, []), []);
    eq(R.takeLastWhile(function(x) {return x !== void 0;}, [1, 3, void 0, 5, 7]), [5, 7]);
  });
  it('can operate on strings', function() {
    eq(R.takeLastWhile(function(x) { return x !== 'R'; }, 'Ramda'), 'amda');
  });
```

> takeWhile

Reason for failing:  Ramda method works with strings not only arrays

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('takeWhile', function() {
  it('continues taking elements while the function reports `true`', function() {
    eq(R.takeWhile(function(x) {return x !== 5;}, [1, 3, 5, 7, 9]), [1, 3]);
  });
  it('starts at the right arg and acknowledges undefined', function() {
    eq(R.takeWhile(function() { assert(false); }, []), []);
    eq(R.takeWhile(function(x) {return x !== void 0;}, [1, 3, void 0, 5, 7]), [1, 3]);
  });
  it('can operate on strings', function() {
    eq(R.takeWhile(function(x) { return x !== 'd'; }, 'Ramda'), 'Ram');
  });
```

> tap

Reason for failing:  Ramda method can act as a transducer

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var listXf = require('./helpers/listXf');
var _curry2 = require('rambda/internal/_curry2');

describe('tap', function() {
  var pushToList = _curry2(function(lst, x) { lst.push(x); });
  it('returns a function that always returns its argument', function() {
    var f = R.tap(R.identity);
    eq(typeof f, 'function');
    eq(f(100), 100);
    eq(f(undefined), undefined);
    eq(f(null), null);
  });
  it("may take a function as the first argument that executes with tap's argument", function() {
    var sideEffect = 0;
    eq(sideEffect, 0);
    var rv = R.tap(function(x) { sideEffect = 'string ' + x; }, 200);
    eq(rv, 200);
    eq(sideEffect, 'string 200');
  });
  it('can act as a transducer', function() {
    var sideEffect = [];
    var numbers = [1,2,3,4,5];
    var xf = R.compose(R.map(R.identity), R.tap(pushToList(sideEffect)));
    eq(R.into([], xf, numbers), numbers);
    eq(sideEffect, numbers);
  });
  it('dispatches to transformer objects', function() {
    var sideEffect = [];
    var pushToSideEffect = pushToList(sideEffect);
    eq(R.tap(pushToSideEffect, listXf), {
      f: pushToSideEffect,
      xf: listXf
    });
  });
```

> test

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('test', function() {
  it('returns true if string matches pattern', function() {
    eq(R.test(/^x/, 'xyz'), true);
  });
  it('returns false if string does not match pattern', function() {
    eq(R.test(/^y/, 'xyz'), false);
  });
  it('is referentially transparent', function() {
    var pattern = /x/g;
    eq(pattern.lastIndex, 0);
    eq(R.test(pattern, 'xyz'), true);
    eq(pattern.lastIndex, 0);
    eq(R.test(pattern, 'xyz'), true);
  });
  it('throws if first argument is not a regexp', function() {
    assert.throws(
      function() { R.test('foo', 'bar'); },
      function(err) {
        return err.constructor === TypeError &&
               err.message === '‘test’ requires a value of type RegExp ' +
                               'as its first argument; received "foo"';
      }
    );
  });
```

> times

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
describe('times', function() {
  it('takes a map func', function() {
    eq(R.times(R.identity, 5), [0, 1, 2, 3, 4]);
    eq(R.times(function(x) {
      return x * 2;
    }, 5), [0, 2, 4, 6, 8]);
  });
  it('throws if second argument is not a valid array length', function() {
    assert.throws(function() { R.times(3)('cheers!'); }, RangeError);
    assert.throws(function() { R.times(R.identity, -1); }, RangeError);
  });
```

> toLower

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('toLower', function() {
  it('returns the lower-case equivalent of the input string', function() {
    eq(R.toLower('XYZ'), 'xyz');
  });
```

> toPairs

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('toPairs', function() {
  it('converts an object into an array of two-element [key, value] arrays', function() {
    eq(R.toPairs({a: 1, b: 2, c: 3}), [['a', 1], ['b', 2], ['c', 3]]);
  });
  it("only iterates the object's own properties", function() {
    var F = function() {
      this.x = 1;
      this.y = 2;
    };
    F.prototype.protoProp = 'you can\'t see me';
    var f = new F();
    eq(R.toPairs(f), [['x', 1], ['y', 2]]);
  });
```

> toString

```javascript
var assert = require('assert');

var R = require('../../../../../rambda/dist/rambda');
describe('toString', function() {
  it('returns the string representation of null', function() {
    assert.strictEqual(R.toString(null), 'null');
  });
  it('returns the string representation of undefined', function() {
    assert.strictEqual(R.toString(undefined), 'undefined');
  });
  it('returns the string representation of a Boolean primitive', function() {
    assert.strictEqual(R.toString(true), 'true');
    assert.strictEqual(R.toString(false), 'false');
  });
  it('returns the string representation of a number primitive', function() {
    assert.strictEqual(R.toString(0), '0');
    assert.strictEqual(R.toString(-0), '-0');
    assert.strictEqual(R.toString(1.23), '1.23');
    assert.strictEqual(R.toString(-1.23), '-1.23');
    assert.strictEqual(R.toString(1e+23), '1e+23');
    assert.strictEqual(R.toString(-1e+23), '-1e+23');
    assert.strictEqual(R.toString(1e-23), '1e-23');
    assert.strictEqual(R.toString(-1e-23), '-1e-23');
    assert.strictEqual(R.toString(Infinity), 'Infinity');
    assert.strictEqual(R.toString(-Infinity), '-Infinity');
    assert.strictEqual(R.toString(NaN), 'NaN');
  });
  it('returns the string representation of a string primitive', function() {
    assert.strictEqual(R.toString('abc'), '"abc"');
    assert.strictEqual(R.toString('x "y" z'), '"x \\"y\\" z"');
    assert.strictEqual(R.toString("' '"), '"\' \'"');
    assert.strictEqual(R.toString('" "'), '"\\" \\""');
    assert.strictEqual(R.toString('\b \b'), '"\\b \\b"');
    assert.strictEqual(R.toString('\f \f'), '"\\f \\f"');
    assert.strictEqual(R.toString('\n \n'), '"\\n \\n"');
    assert.strictEqual(R.toString('\r \r'), '"\\r \\r"');
    assert.strictEqual(R.toString('\t \t'), '"\\t \\t"');
    assert.strictEqual(R.toString('\v \v'), '"\\v \\v"');
    assert.strictEqual(R.toString('\0 \0'), '"\\0 \\0"');
    assert.strictEqual(R.toString('\\ \\'), '"\\\\ \\\\"');
  });
  it('returns the string representation of a Boolean object', function() {
    assert.strictEqual(R.toString(new Boolean(true)), 'new Boolean(true)');
    assert.strictEqual(R.toString(new Boolean(false)), 'new Boolean(false)');
  });
  it('returns the string representation of a Number object', function() {
    assert.strictEqual(R.toString(new Number(0)), 'new Number(0)');
    assert.strictEqual(R.toString(new Number(-0)), 'new Number(-0)');
  });
  it('returns the string representation of a String object', function() {
    assert.strictEqual(R.toString(new String('abc')), 'new String("abc")');
    assert.strictEqual(R.toString(new String('x "y" z')), 'new String("x \\"y\\" z")');
    assert.strictEqual(R.toString(new String("' '")), 'new String("\' \'")');
    assert.strictEqual(R.toString(new String('" "')), 'new String("\\" \\"")');
    assert.strictEqual(R.toString(new String('\b \b')), 'new String("\\b \\b")');
    assert.strictEqual(R.toString(new String('\f \f')), 'new String("\\f \\f")');
    assert.strictEqual(R.toString(new String('\n \n')), 'new String("\\n \\n")');
    assert.strictEqual(R.toString(new String('\r \r')), 'new String("\\r \\r")');
    assert.strictEqual(R.toString(new String('\t \t')), 'new String("\\t \\t")');
    assert.strictEqual(R.toString(new String('\v \v')), 'new String("\\v \\v")');
    assert.strictEqual(R.toString(new String('\0 \0')), 'new String("\\0 \\0")');
    assert.strictEqual(R.toString(new String('\\ \\')), 'new String("\\\\ \\\\")');
  });
  it('returns the string representation of a Date object', function() {
    assert.strictEqual(R.toString(new Date('2001-02-03T04:05:06.000Z')), 'new Date("2001-02-03T04:05:06.000Z")');
    assert.strictEqual(R.toString(new Date('XXX')), 'new Date(NaN)');
  });
  it('returns the string representation of a RegExp object', function() {
    assert.strictEqual(R.toString(/(?:)/), '/(?:)/');
    assert.strictEqual(R.toString(/\//g), '/\\//g');
  });
  it('returns the string representation of a function', function() {
    var add = function add(a, b) { return a + b; };
    assert.strictEqual(R.toString(add), add.toString());
  });
  it('returns the string representation of an array', function() {
    assert.strictEqual(R.toString([]), '[]');
    assert.strictEqual(R.toString([1, 2, 3]), '[1, 2, 3]');
    assert.strictEqual(R.toString([1, [2, [3]]]), '[1, [2, [3]]]');
    assert.strictEqual(R.toString(['x', 'y']), '["x", "y"]');
  });
  it('returns the string representation of an array with non-numeric property names', function() {
    var xs = [1, 2, 3];
    xs.foo = 0;
    xs.bar = 0;
    xs.baz = 0;
    assert.strictEqual(R.toString(xs), '[1, 2, 3, "bar": 0, "baz": 0, "foo": 0]');
  });
  it('returns the string representation of an arguments object', function() {
    assert.strictEqual(R.toString((function() { return arguments; })()), '(function() { return arguments; }())');
    assert.strictEqual(R.toString((function() { return arguments; })(1, 2, 3)), '(function() { return arguments; }(1, 2, 3))');
    assert.strictEqual(R.toString((function() { return arguments; })(['x', 'y'])), '(function() { return arguments; }(["x", "y"]))');
  });
  it('returns the string representation of a plain object', function() {
    assert.strictEqual(R.toString({}), '{}');
    assert.strictEqual(R.toString({foo: 1, bar: 2, baz: 3}), '{"bar": 2, "baz": 3, "foo": 1}');
    assert.strictEqual(R.toString({'"quoted"': true}), '{"\\"quoted\\"": true}');
    assert.strictEqual(R.toString({a: {b: {c: {}}}}), '{"a": {"b": {"c": {}}}}');
  });
  it('treats instance without custom `toString` method as plain object', function() {
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }
    assert.strictEqual(R.toString(new Point(1, 2)), '{"x": 1, "y": 2}');
  });
  it('dispatches to custom `toString` method', function() {
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }
    Point.prototype.toString = function() {
      return 'new Point(' + this.x + ', ' + this.y + ')';
    };
    assert.strictEqual(R.toString(new Point(1, 2)), 'new Point(1, 2)');
    function Just(x) {
      if (!(this instanceof Just)) {
        return new Just(x);
      }
      this.value = x;
    }
    Just.prototype.toString = function() {
      return 'Just(' + R.toString(this.value) + ')';
    };
    assert.strictEqual(R.toString(Just(42)), 'Just(42)');
    assert.strictEqual(R.toString(Just([1, 2, 3])), 'Just([1, 2, 3])');
    assert.strictEqual(R.toString(Just(Just(Just('')))), 'Just(Just(Just("")))');
    assert.strictEqual(R.toString({toString: R.always('x')}), 'x');
  });
  it('handles object with no `toString` method', function() {
    if (typeof Object.create === 'function') {
      var a = Object.create(null);
      var b = Object.create(null); b.x = 1; b.y = 2;
      assert.strictEqual(R.toString(a), '{}');
      assert.strictEqual(R.toString(b), '{"x": 1, "y": 2}');
    }
  });
  it('handles circular references', function() {
    var a = [];
    a[0] = a;
    assert.strictEqual(R.toString(a), '[<Circular>]');
    var o = {};
    o.o = o;
    assert.strictEqual(R.toString(o), '{"o": <Circular>}');
    var b = ['bee'];
    var c = ['see'];
    b[1] = c;
    c[1] = b;
    assert.strictEqual(R.toString(b), '["bee", ["see", <Circular>]]');
    assert.strictEqual(R.toString(c), '["see", ["bee", <Circular>]]');
    var p = {};
    var q = {};
    p.q = q;
    q.p = p;
    assert.strictEqual(R.toString(p), '{"q": {"p": <Circular>}}');
    assert.strictEqual(R.toString(q), '{"p": {"q": <Circular>}}');
    var x = [];
    var y = {};
    x[0] = y;
    y.x = x;
    assert.strictEqual(R.toString(x), '[{"x": <Circular>}]');
    assert.strictEqual(R.toString(y), '{"x": [<Circular>]}');
  });
});
```

> toUpper

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('toUpper', function() {
  it('returns the upper-case equivalent of the input string', function() {
    eq(R.toUpper('abc'), 'ABC');
  });
```

> transpose

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('transpose', function() {
  it('returns an array of two arrays', function() {
    var input = [['a', 1], ['b', 2], ['c', 3]];
    eq(R.transpose(input), [['a', 'b', 'c'], [1, 2, 3]]);
  });
  it('skips elements when rows are shorter', function() {
    var actual = R.transpose([[10, 11], [20], [], [30, 31, 32]]);
    var expected = [[10, 20, 30], [11, 31], [32]];
    eq(actual, expected);
  });
  it('copes with empty arrays', function() {
    eq(R.transpose([]), []);
  });
  it('copes with true, false, null & undefined elements of arrays', function() {
    var actual = R.transpose([[true, false, undefined, null], [null, undefined, false, true]]);
    var expected = [[true, null], [false, undefined], [undefined, false], [null, true]];
    eq(actual, expected);
  });
```

> trim

Reason for failing:  Ramda method trims all ES5 whitespace

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('trim', function() {
  var test = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFFHello, World!\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
  it('trims a string', function() {
    eq(R.trim('   xyz  '), 'xyz');
  });
  it('trims all ES5 whitespace', function() {
    eq(R.trim(test), 'Hello, World!');
    eq(R.trim(test).length, 13);
  });
  it('does not trim the zero-width space', function() {
    eq(R.trim('\u200b'), '\u200b');
    eq(R.trim('\u200b').length, 1);
  });
  if (typeof String.prototype.trim !== 'function') {
    it('falls back to a shim if String.prototype.trim is not present', function() {
      eq(R.trim('   xyz  '), 'xyz');
      eq(R.trim(test), 'Hello, World!');
      eq(R.trim(test).length, 13);
      eq(R.trim('\u200b'), '\u200b');
      eq(R.trim('\u200b').length, 1);
    });
  }
```

> tryCatch

Reason for failing:  Ramda method returns a function with the same arity

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('tryCatch', function() {
  function headX(ls) {
    return ls[0].x;
  }
  function catcher() {
    return 10101;
  }
  it('takes two functions and return a function', function() {
    var mayThrow = R.tryCatch(headX, catcher);
    eq(typeof mayThrow, 'function');
  });
  it('returns a function with the same arity as the `tryer` function', function() {
    function a1(a) { return a; }
    function a2(a, b) { return b; }
    function a3(a, b, c) { return c; }
    function a4(a, b, c, d) { return d; }
    eq(R.tryCatch(a1, catcher).length, a1.length);
    eq(R.tryCatch(a2, catcher).length, a2.length);
    eq(R.tryCatch(a3, catcher).length, a3.length);
    eq(R.tryCatch(a4, catcher).length, a4.length);
  });
  it('returns the value of the first function if it does not throw', function() {
    var mayThrow = R.tryCatch(headX, catcher);
    eq(mayThrow([{x: 10}, {x: 20}, {x: 30}]), 10);
  });
  it('returns the value of the second function if the first function throws', function() {
    function throw10() {
      throw new Error(10);
    }
    function eCatcher(e) {
      return Number(e.message);
    }
    var mayThrow = R.tryCatch(headX, catcher);
    eq(mayThrow([]), 10101);
    var willThrow = R.tryCatch(throw10, eCatcher);
    eq(willThrow([]), 10);
    eq(willThrow([{}, {}, {}]), 10);
  });
  it('the second function gets passed the error object and the same arguments as the first function', function() {
    function thrower(a, b, c) {
      void c;
      throw new Error('throwerError');
    }
    function catch3(e, a, b, c) {
      return [e.message, a, b, c].join(' ');
    }
    var mayThrow = R.tryCatch(thrower, catch3);
    eq(mayThrow('A', 'B', 'C'), 'throwerError A B C');
  });
```

> type

Reason for failing:  Ramda method returns 'Number' type to NaN input, while Rambda method returns 'NaN'

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('type', function() {
  it('"Array" if given an array literal', function() {
    eq(R.type([1, 2, 3]), 'Array');
  });
  // it('"Arguments" if given an arguments object', function() {
  //   var args = (function() { return arguments; }());
  //   eq(R.type(args), 'Arguments');
  // });
  it('"Object" if given an object literal', function() {
    eq(R.type({batman: 'na na na na na na na'}), 'Object');
  });
  it('"RegExp" if given a RegExp literal', function() {
    eq(R.type(/[A-z]/), 'RegExp');
  });
  it('"Number" if given a numeric value', function() {
    eq(R.type(4), 'Number');
  });
  it('"Number" if given the NaN value', function() {
    eq(R.type(NaN), 'Number');
  });
  it('"String" if given a String literal', function() {
    eq(R.type('Gooooodd Mornning Ramda!!'), 'String');
  });
  it('"String" if given a String object', function() {
    eq(R.type(new String('I am a String object')), 'String');
  });
  it('"Null" if given the null value', function() {
    eq(R.type(null), 'Null');
  });
  it('"Undefined" if given the undefined value', function() {
    eq(R.type(undefined), 'Undefined');
  });
```

> union

Reason for failing:  Ramda library supports fantasy-land

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('union', function() {
  var M = [1, 2, 3, 4];
  var N = [3, 4, 5, 6];
  it('combines two lists into the set of all their elements', function() {
    eq(R.union(M, N), [1, 2, 3, 4, 5, 6]);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.union([0], [-0]).length, 2);
    eq(R.union([-0], [0]).length, 2);
    eq(R.union([NaN], [NaN]).length, 1);
    eq(R.union([new Just([42])], [new Just([42])]).length, 1);
  });
```

> uniq

Reason for failing:  Ramda method pass to `uniq` method | Ramda method uses reference equality for functions

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('uniq', function() {
  it('returns a set from any array (i.e. purges duplicate elements)', function() {
    var list = [1, 2, 3, 1, 2, 3, 1, 2, 3];
    eq(R.uniq(list), [1, 2, 3]);
  });
  it('keeps elements from the left', function() {
    eq(R.uniq([1, 2, 3, 4, 1]), [1, 2, 3, 4]);
  });
  it('returns an empty array for an empty array', function() {
    eq(R.uniq([]), []);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.uniq([-0, -0]).length, 1);
    eq(R.uniq([0, -0]).length, 2);
    eq(R.uniq([NaN, NaN]).length, 1);
    eq(R.uniq([[1], [1]]).length, 1);
    eq(R.uniq([new Just([42]), new Just([42])]).length, 1);
  });
  it('handles null and undefined elements', function() {
    eq(R.uniq([void 0, null, void 0, null]), [void 0, null]);
  });
  it('uses reference equality for functions', function() {
    eq(R.uniq([R.add, R.identity, R.add, R.identity, R.add, R.identity]).length, 2);
  });
```

> uniqWith

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('uniqWith', function() {
  var objs = [
    {x: R.T, i: 0}, {x: R.F, i: 1}, {x: R.T, i: 2}, {x: R.T, i: 3},
    {x: R.F, i: 4}, {x: R.F, i: 5}, {x: R.T, i: 6}, {x: R.F, i: 7}
  ];
  var objs2 = [
    {x: R.T, i: 0}, {x: R.F, i: 1}, {x: R.T, i: 2}, {x: R.T, i: 3},
    {x: R.F, i: 0}, {x: R.T, i: 1}, {x: R.F, i: 2}, {x: R.F, i: 3}
  ];
  function eqI(x, accX) { return x.i === accX.i; }
  it('returns a set from any array (i.e. purges duplicate elements) based on predicate', function() {
    eq(R.uniqWith(eqI, objs), objs);
    eq(R.uniqWith(eqI, objs2), [{x: R.T, i: 0}, {x: R.F, i: 1}, {x: R.T, i: 2}, {x: R.T, i: 3}]);
  });
  it('keeps elements from the left', function() {
    eq(R.uniqWith(eqI, [{i: 1}, {i: 2}, {i: 3}, {i: 4}, {i: 1}]), [{i: 1}, {i: 2}, {i: 3}, {i: 4}]);
  });
  it('returns an empty array for an empty array', function() {
    eq(R.uniqWith(eqI, []), []);
  });
```

> unless

Reason for failing:  Rambda library doesn't have `R.of`

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');
var _isArrayLike = require('rambda/internal/_isArrayLike');

describe('unless', function() {
  it('calls the whenFalse function if the validator returns a falsy value', function() {
    eq(R.unless(_isArrayLike, R.of)(10), [10]);
  });
  it('returns the argument unmodified if the validator returns a truthy value', function() {
    eq(R.unless(_isArrayLike, R.of)([10]), [10]);
  });
  it('returns a curried function', function() {
    eq(R.unless(_isArrayLike)(R.of)(10), [10]);
    eq(R.unless(_isArrayLike)(R.of)([10]), [10]);
  });
```

> update

Reason for failing:  Ramda method accepts an array-like object

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('update', function() {
  it('updates the value at the given index of the supplied array', function() {
    eq(R.update(2, 4, [0, 1, 2, 3]), [0, 1, 4, 3]);
  });
  it('offsets negative indexes from the end of the array', function() {
    eq(R.update(-3, 4, [0, 1, 2, 3]), [0, 4, 2, 3]);
  });
  it('returns the original array if the supplied index is out of bounds', function() {
    var list = [0, 1, 2, 3];
    eq(R.update(4, 4, list), list);
    eq(R.update(-5, 4, list), list);
  });
  it('does not mutate the original array', function() {
    var list = [0, 1, 2, 3];
    eq(R.update(2, 4, list), [0, 1, 4, 3]);
    eq(list, [0, 1, 2, 3]);
  });
  it('curries the arguments', function() {
    eq(R.update(2)(4)([0, 1, 2, 3]), [0, 1, 4, 3]);
  });
  it('accepts an array-like object', function() {
    function args() {
      return arguments;
    }
    eq(R.update(2, 4, args(0, 1, 2, 3)), [0, 1, 4, 3]);
  });
```

> values

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('values', function() {
  var obj = {a: 100, b: [1, 2, 3], c: {x: 200, y: 300}, d: 'D', e: null, f: undefined};
  function C() { this.a = 100; this.b = 200; }
  C.prototype.x = function() { return 'x'; };
  C.prototype.y = 'y';
  var cobj = new C();
  it("returns an array of the given object's values", function() {
    var vs = R.values(obj).sort();
    var ts = [[1, 2, 3], 100, 'D', {x: 200, y: 300}, null, undefined];
    eq(vs.length, ts.length);
    eq(vs[0], ts[0]);
    eq(vs[1], ts[1]);
    eq(vs[2], ts[2]);
    eq(vs[3], ts[3]);
    eq(vs[4], ts[4]);
    eq(vs[5], ts[5]);
    eq(R.values({
      hasOwnProperty: false
    }), [false]);
  });
  it("does not include the given object's prototype properties", function() {
    eq(R.values(cobj), [100, 200]);
  });
  it('returns an empty object for primitives', function() {
    eq(R.values(null), []);
    eq(R.values(undefined), []);
    eq(R.values(55), []);
    eq(R.values('foo'), []);
    eq(R.values(true), []);
    eq(R.values(false), []);
    eq(R.values(NaN), []);
    eq(R.values(Infinity), []);
    eq(R.values([]), []);
  });
```

> when

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('when', function() {
  it('calls the whenTrue function if the validator returns a truthy value', function() {
    eq(R.when(R.is(Number), R.add(1))(10), 11);
  });
  it('returns the argument unmodified if the validator returns a falsy value', function() {
    eq(R.when(R.is(Number), R.add(1))('hello'), 'hello');
  });
  it('returns a curried function', function() {
    var ifIsNumber = R.when(R.is(Number));
    eq(ifIsNumber(R.add(1))(15), 16);
    eq(ifIsNumber(R.add(1))('hello'), 'hello');
  });
```

> where

Reason for failing:  Ramba method looks inside `prototype` property

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('where', function() {
  it('returns true if the test object satisfies the spec', function() {
    var spec = {x: R.equals(1), y: R.equals(2)};
    var test1 = {x: 0, y: 200};
    var test2 = {x: 0, y: 10};
    var test3 = {x: 1, y: 101};
    var test4 = {x: 1, y: 2};
    eq(R.where(spec, test1), false);
    eq(R.where(spec, test2), false);
    eq(R.where(spec, test3), false);
    eq(R.where(spec, test4), true);
  });
  it('does not need the spec and the test object to have the same interface (the test object will have a superset of the specs properties)', function() {
    var spec = {x: R.equals(100)};
    var test1 = {x: 20, y: 100, z: 100};
    var test2 = {w: 1, x: 100, y: 100, z: 100};
    eq(R.where(spec, test1), false);
    eq(R.where(spec, test2), true);
  });
  it('matches specs that have undefined properties', function() {
    var spec = {x: R.equals(undefined)};
    var test1 = {};
    var test2 = {x: null};
    var test3 = {x: undefined};
    var test4 = {x: 1};
    eq(R.where(spec, test1), true);
    eq(R.where(spec, test2), false);
    eq(R.where(spec, test3), true);
    eq(R.where(spec, test4), false);
  });
  it('is true for an empty spec', function() {
    eq(R.where({}, {a: 1}), true);
  });
  it('matches inherited properties', function() {
    var spec = {
      toString: R.equals(Object.prototype.toString),
      valueOf: R.equals(Object.prototype.valueOf)
    };
    eq(R.where(spec, {}), true);
  });
  it('does not match inherited spec', function() {
    function Spec() { this.y = R.equals(6); }
    Spec.prototype.x = R.equals(5);
    var spec = new Spec();
    eq(R.where(spec, {y: 6}), true);
    eq(R.where(spec, {x: 5}), false);
  });
```

> whereEq

Reason for failing:  Ramba method looks inside `prototype` property | Rambda.equals doesn't support equality of functions

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('whereEq', function() {
  it('returns true if the test object satisfies the spec', function() {
    var spec = {x: 1, y: 2};
    var test1 = {x: 0, y: 200};
    var test2 = {x: 0, y: 10};
    var test3 = {x: 1, y: 101};
    var test4 = {x: 1, y: 2};
    eq(R.whereEq(spec, test1), false);
    eq(R.whereEq(spec, test2), false);
    eq(R.whereEq(spec, test3), false);
    eq(R.whereEq(spec, test4), true);
  });
  it('does not need the spec and the test object to have the same interface (the test object will have a superset of the specs properties)', function() {
    var spec = {x: 100};
    var test1 = {x: 20, y: 100, z: 100};
    var test2 = {w: 1, x: 100, y: 100, z: 100};
    eq(R.whereEq(spec, test1), false);
    eq(R.whereEq(spec, test2), true);
  });
  it('matches specs that have undefined properties', function() {
    var spec = {x: undefined};
    var test1 = {};
    var test2 = {x: null};
    var test3 = {x: undefined};
    var test4 = {x: 1};
    eq(R.whereEq(spec, test1), true);
    eq(R.whereEq(spec, test2), false);
    eq(R.whereEq(spec, test3), true);
    eq(R.whereEq(spec, test4), false);
  });
  it('is true for an empty spec', function() {
    eq(R.whereEq({}, {a: 1}), true);
  });
  it('reports true when the object equals the spec', function() {
    eq(R.whereEq(R, R), true);
  });
  function Parent() {
    this.y = 6;
  }
  Parent.prototype.a = undefined;
  Parent.prototype.x = 5;
  var parent = new Parent();
  it('matches inherited props', function() {
    eq(R.whereEq({y: 6}, parent), true);
    eq(R.whereEq({x: 5}, parent), true);
    eq(R.whereEq({x: 5, y: 6}, parent), true);
    eq(R.whereEq({x: 4, y: 6}, parent), false);
  });
  it('does not match inherited spec', function() {
    eq(R.whereEq(parent, {y: 6}), true);
    eq(R.whereEq(parent, {x: 5}), false);
  });
```

> without

Reason for failing:  Ramda method act as a transducer | Ramda method pass to `equals` method

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('without', function() {
  it('returns an array not containing values in the first argument', function() {
    eq(R.without([1, 2], [1, 2, 1, 4, 5]), [4, 5]);
  });
  it('can act as a transducer', function() {
    eq(R.into([], R.without([1]), [1]), []);
  });
  it('has R.equals semantics', function() {
    function Just(x) { this.value = x; }
    Just.prototype.equals = function(x) {
      return x instanceof Just && R.equals(x.value, this.value);
    };
    eq(R.without([0], [-0]).length, 1);
    eq(R.without([-0], [0]).length, 1);
    eq(R.without([NaN], [NaN]).length, 0);
    eq(R.without([[1]], [[1]]).length, 0);
    eq(R.without([new Just([42])], [new Just([42])]).length, 0);
  });
```

> xor

Reason for failing:  Ramda method support empty call of method

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('xor', function() {
  it('compares two values with exclusive or', function() {
    eq(R.xor(true, true), false);
    eq(R.xor(true, false), true);
    eq(R.xor(false, true), true);
    eq(R.xor(false, false), false);
  });
  it('when both values are truthy, it should return false', function() {
    eq(R.xor(true, 'foo'), false);
    eq(R.xor(42, true), false);
    eq(R.xor('foo', 42), false);
    eq(R.xor({}, true), false);
    eq(R.xor(true, []), false);
    eq(R.xor([], {}), false);
    eq(R.xor(new Date(), true), false);
    eq(R.xor(true, Infinity), false);
    eq(R.xor(Infinity, new Date()), false);
  });
  it('when both values are falsy, it should return false', function() {
    eq(R.xor(null, false), false);
    eq(R.xor(false, undefined), false);
    eq(R.xor(undefined, null), false);
    eq(R.xor(0, false), false);
    eq(R.xor(false, NaN), false);
    eq(R.xor(NaN, 0), false);
    eq(R.xor('', false), false);
  });
  it('when one argument is truthy and the other is falsy, it should return true', function() {
    eq(R.xor('foo', null), true);
    eq(R.xor(null, 'foo'), true);
    eq(R.xor(undefined, 42), true);
    eq(R.xor(42, undefined), true);
    eq(R.xor(Infinity, NaN), true);
    eq(R.xor(NaN, Infinity), true);
    eq(R.xor({}, ''), true);
    eq(R.xor('', {}), true);
    eq(R.xor(new Date(), 0), true);
    eq(R.xor(0, new Date()), true);
    eq(R.xor([], null), true);
    eq(R.xor(undefined, []), true);
  });
  it('returns a curried function', function() {
    eq(R.xor()(true)(true), false);
    eq(R.xor()(true)(false), true);
    eq(R.xor()(false)(true), true);
    eq(R.xor()(false)(false), false);
  });
```

> zip

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('zip', function() {
  it('returns an array of "tuples"', function() {
    var a = [1, 2, 3];
    var b = [100, 200, 300];
    eq(R.zip(a, b), [[1, 100], [2, 200], [3, 300]]);
  });
  it('returns a list as long as the shorter of the lists input', function() {
    var a = [1, 2, 3];
    var b = [100, 200, 300, 400];
    var c = [10, 20];
    eq(R.zip(a, b), [[1, 100], [2, 200], [3, 300]]);
    eq(R.zip(a, c), [[1, 10], [2, 20]]);
  });
```

> zipObj

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('zipObj', function() {
  it('combines an array of keys with an array of values into a single object', function() {
    eq(R.zipObj(['a', 'b', 'c'], [1, 2, 3]), {a: 1, b: 2, c: 3});
  });
  it('ignores extra values', function() {
    eq(R.zipObj(['a', 'b', 'c'], [1, 2, 3, 4, 5, 6, 7]), {a: 1, b: 2, c: 3});
  });
  it('ignores extra keys', function() {
    eq(R.zipObj(['a', 'b', 'c', 'd', 'e', 'f'], [1, 2, 3]), {a: 1, b: 2, c: 3});
  });
  it('last one in wins when there are duplicate keys', function() {
    eq(R.zipObj(['a', 'b', 'c', 'a'], [1, 2, 3, 'LAST']), {a: 'LAST', b: 2, c: 3});
  });
```

> zipWith

```javascript
var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('zipWith', function() {
  var a = [1, 2, 3];
  var b = [100, 200, 300];
  var c = [10, 20, 30, 40, 50, 60];
  var add = function(a, b) { return a + b; };
  var x = function(a, b) { return a * b; };
  var s = function(a, b) { return a + ' cow ' + b; };
  it('returns an array created by applying its passed-in function pair-wise on its passed in arrays', function() {
    eq(R.zipWith(add, a, b), [101, 202, 303]);
    eq(R.zipWith(x, a, b), [100, 400, 900]);
    eq(R.zipWith(s, a, b), ['1 cow 100', '2 cow 200', '3 cow 300']);
  });
  it('returns an array whose length is equal to the shorter of its input arrays', function() {
    eq(R.zipWith(add, a, c).length, a.length);
  });
```

