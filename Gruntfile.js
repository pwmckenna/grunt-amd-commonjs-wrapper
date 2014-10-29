'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        'amd-commonjs-wrapper': {
            test: {
                files: {
                    'fixtures/tmp/fixture-after.js': 'fixtures/fixture-before.js'
                }
            }
        },
        simplemocha: {
            test: {
                src: 'test.js'
            }
        },
        clean: {
            test: ['tmp']
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