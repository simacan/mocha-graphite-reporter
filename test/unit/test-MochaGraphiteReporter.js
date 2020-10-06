var common         = require('../common');

var test           = require('utest');
var assert         = require('assert');
var GraphiteReporter = common.mochaGraphiteReporter;

test('mochaGraphiteReporter.sanitize', {
  'returns a sanitized string': function() {
    const inputString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+-=[]{};':,.?";
    const outputString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_____________________,__";

    assert.equal(inputString.sanitize(), outputString);
  }
});

