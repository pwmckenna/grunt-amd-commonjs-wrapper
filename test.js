'use strict';
var assert = require('assert');
var grunt = require('grunt');

it('should convert file to commonjs wrapper style', function () {
    var converted = grunt.file.read('fixtures/tmp/1-after.js');
    var expected = grunt.file.read('fixtures/1-after.js');
    assert.equal(converted, expected);
});

it('should require dependencies that are not assigned to variables', function () {
    var converted = grunt.file.read('fixtures/tmp/2-after.js');
    var expected = grunt.file.read('fixtures/2-after.js');
    assert.equal(converted, expected);
});

it('should support named modules', function () {
    var converted = grunt.file.read('fixtures/tmp/3-after.js');
    var expected = grunt.file.read('fixtures/3-after.js');
    assert.equal(converted, expected);
});