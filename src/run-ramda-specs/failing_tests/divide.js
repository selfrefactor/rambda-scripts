var R = require('../../../../../rambda/dist/rambda');
var eq = require('./shared/eq');

describe('divide', function() {
  it('divides two numbers', function() {
    eq(R.divide(28, 7), 4);
  });