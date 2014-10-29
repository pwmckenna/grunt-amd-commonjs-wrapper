'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        'amd-commonjs-wrapper': {
            test: {
                expand: true,
                cwd: 'fixtures/before',
                src: '*.js',
                dest: 'fixtures/tmp'
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