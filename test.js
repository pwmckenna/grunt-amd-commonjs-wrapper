'use strict';
var assert = require('assert');
var grunt = require('grunt');

it('should convert file to commonjs wrapper style', function () {
    var converted = grunt.file.read('fixtures/tmp/basic.js');
    var expected = grunt.file.read('fixtures/after/basic.js');
    assert.equal(converted, expected);
});

it('should require dependencies that are not assigned to variables', function () {
    var converted = grunt.file.read('fixtures/tmp/no-var.js');
    var expected = grunt.file.read('fixtures/after/no-var.js');
    assert.equal(converted, expected);
});

it('should support named modules', function () {
    var converted = grunt.file.read('fixtures/tmp/named.js');
    var expected = grunt.file.read('fixtures/after/named.js');
    assert.equal(converted, expected);
});

it('should support modules with no dependencies', function () {
    var converted = grunt.file.read('fixtures/tmp/no-deps.js');
    var expected = grunt.file.read('fixtures/after/no-deps.js');
    assert.equal(converted, expected);
});