'use strict';
var assert = require('assert');
var grunt = require('grunt');

it('should convert file', function () {
    var converted = grunt.file.read('fixtures/tmp/fixture-after.js');
    var expected = grunt.file.read('fixtures/fixture-after.js');
    assert.equal(converted, expected);
});