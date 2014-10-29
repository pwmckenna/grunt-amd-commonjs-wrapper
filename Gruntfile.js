'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        'amd-commonjs-wrapper': {
            test: {
                files: {
                    'fixtures/tmp/1-after.js': 'fixtures/1-before.js',
                    'fixtures/tmp/2-after.js': 'fixtures/2-before.js',
                    'fixtures/tmp/3-after.js': 'fixtures/3-before.js'
                }
            }
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
        // 'clean'
    ]);
};