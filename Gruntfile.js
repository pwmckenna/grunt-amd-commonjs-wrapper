'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        'amd-commonjs-wrapper': {
            'basic': {
                src: 'fixtures/before/basic.js',
                dest: 'fixtures/tmp/basic.js'
            },
            'commonjs-wrapper': {
                src: 'fixtures/before/commonjs-wrapper.js',
                dest: 'fixtures/tmp/commonjs-wrapper.js'
            },
            'named-cb': {
                src: 'fixtures/before/named-cb.js',
                dest: 'fixtures/tmp/named-cb.js'
            },
            'named-commonjs-wrapper': {
                src: 'fixtures/before/named-commonjs-wrapper.js',
                dest: 'fixtures/tmp/named-commonjs-wrapper.js'
            },
            'named': {
                src: 'fixtures/before/named.js',
                dest: 'fixtures/tmp/named.js'
            },
            'no-deps': {
                src: 'fixtures/before/no-deps.js',
                dest: 'fixtures/tmp/no-deps.js'
            },
            'no-var': {
                src: 'fixtures/before/no-var.js',
                dest: 'fixtures/tmp/no-var.js'
            },
            'use-strict-semicolon': {
                src: 'fixtures/before/use-strict-semicolon.js',
                dest: 'fixtures/tmp/use-strict-semicolon.js'
            },
            'use-strict': {
                src: 'fixtures/before/use-strict.js',
                dest: 'fixtures/tmp/use-strict.js'
            },
        },
        simplemocha: {
            test: {
                src: 'test.js'
            }
        },
        clean: {
            test: ['fixtures/tmp']
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-simple-mocha');

    grunt.registerTask('default', [
        'clean',
        'amd-commonjs-wrapper',
        'simplemocha',
        'clean'
    ]);
};