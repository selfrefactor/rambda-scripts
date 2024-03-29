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