'use strict';

var assert = require('assert');
var eachAsync = require('each-async');
var _ = require('lodash');
var rocambole = require('rocambole');
var grunt = require('grunt');

// inject nodes between two not-necessarily-consecutive nodes
// WARNING: any nodes between first and last will be removed
var injectNodes = function (first, middle, last) {
    middle = _.isArray(middle) ? middle : [middle];

    if (middle.length) {
        for (var i = 0; i < middle.length - 1; ++i) {
            middle[i].next = middle[i + 1];
        }
        for (var i = i; i < middle.length; ++i) {
            middle[i].prev = middle[i - 1];
        }
        _.last(middle).next = last;
        last.prev = _.last(middle);
        _.first(middle).prev = first;
        first.next = _.first(middle);    
    } else {
        first.next = last;
        last.prev = first;
    }
}

var injectNodesAfter = function (node, nodes) {
    return injectNodes(node, nodes, node.next);
};

var amdCommonJsWrapper = function (src) {
    return rocambole.moonwalk(src, function (node) {
        if (node.type === 'CallExpression' && node.callee.name === 'define') {
            var nameArgument = node.arguments[0];
            var dependencyArgument = node.arguments[1];
            var callbackArgument = node.arguments[2];

            // the name is optional, so adjust args if necesary
            if (nameArgument.type !== 'Literal') {
                callbackArgument = dependencyArgument;
                dependencyArgument = nameArgument;
                nameArgument = void 0;
            }

            // the dependency array is optional as well
            if (dependencyArgument.type !== 'ArrayExpression') {
                callbackArgument = dependencyArgument;
                dependencyArgument = void 0;
            }

            if (!dependencyArgument) {
                grunt.log.writeln('Module is already a commonjs wrapper. Skipping this module.')
                return;
            }

            // we only know what to do if the first argument is an array of args, and the second is the callback
            assert(dependencyArgument.type === 'ArrayExpression', 'expected an array of dependencies');
            if (callbackArgument.type === 'Identifier') {
                grunt.log.warn('Unsafe to rewrite a potentionally re-usable functions. Skipping this module.');
                return;
            }
            assert(callbackArgument.type === 'FunctionExpression', 'expected a function callback that receives the dependencies, not ' + callbackArgument.type);

            // get the list of deps [string]
            var dependencyNames = [];
            for (var argNode = dependencyArgument.startToken; argNode !== dependencyArgument.endToken; argNode = argNode.next) {
                if (argNode.type === 'String') {
                    dependencyNames.push(argNode.value);
                }
            }
            // get the list of argument names that we'll map those dependencies to
            var dependencyVariableNames = _.pluck(callbackArgument.params, 'name');


            // remove the array of dependencies as the first argument
            dependencyArgument.startToken.prev.next = callbackArgument.startToken;

            if (callbackArgument.params.length) {
                var first = _.first(callbackArgument.params);
                var last = _.last(callbackArgument.params);

                // replace the callback arguments with [require, exports, module]
                var argNodes = [
                    { type: 'Identifier', value: 'require' },
                    { type: 'Punctuator', value: ',' },
                    { type: 'WhiteSpace', value: ' ' },
                    { type: 'Identifier', value: 'exports' },
                    { type: 'Punctuator', value: ',' },
                    { type: 'WhiteSpace', value: ' ' },
                    { type: 'Identifier', value: 'module' }
                ];
                injectNodes(first.startToken.prev, argNodes, last.endToken.next);
            }

            // add `var name = require('dep')` for each dependency
            var functionBlock = callbackArgument.body;
            assert(functionBlock.type === 'BlockStatement', 'expected the function body to be a block statement');
            assert(functionBlock.startToken.value === '{', 'expected a curly bracket to start the function body');

            // try to match the newline/indentation of the file
            var whitespaceNodes = [];
            var current = functionBlock.startToken;
            while (current.next.type === 'WhiteSpace' || current.next.type === 'LineBreak') {
                whitespaceNodes.push(_.pick(current.next, 'type', 'value'));
                current = current.next;
            }
            // if there is a 'use strict' statement at the top of the function,
            // add any code below it
            if (current.next.type === 'String' && current.next.value === '\'use strict\'') {
                current = current.next;
                // then cruise through any ;/whitespace to find the appropriate place to start
                // sprinkling our dependency declarations
                while (current.next.type === 'WhiteSpace' || current.next.type === 'LineBreak' || (current.next.type === 'Punctuator' && current.next.value === ';')) {
                    current = current.next;
                }
            }
            assert(dependencyNames.length >= dependencyVariableNames.length, 'not enough dependencies to fill all the variables');
            for (var i = dependencyNames.length - 1; i >= 0 ; --i) {
                injectNodes(current, _.map(whitespaceNodes, _.clone), current.next);
                var declarationNodes = (dependencyVariableNames.length <= i ? [] :
                    [
                        { type: 'Keyword', value: 'var' },
                        { type: 'WhiteSpace', value: ' '},
                        { type: 'Identifier', value: dependencyVariableNames[i] },
                        { type: 'WhiteSpace', value: ' ' },
                        { type: 'Punctuator', value: '=' },
                        { type: 'WhiteSpace', value: ' ' }
                    ]
                ).concat([
                    { type: 'Identifier', value: 'require' },
                    { type: 'Punctuator', value: '(' },
                    { type: 'String', value: dependencyNames[i] },
                    { type: 'Punctuator', value: ')' },
                    { type: 'Punctuator', value: ';' }
                ]);
                injectNodes(current, declarationNodes, current.next);
            }
        }
    });
    return src;
};

module.exports = function (grunt) {
    grunt.registerMultiTask('amd-commonjs-wrapper', 'Convert AMD Modules with declared dependencies into the Simplified CommonJS Wrapper style', function () {
        eachAsync(this.files, function (el, i, next) {
            grunt.file.write(el.dest, amdCommonJsWrapper(grunt.file.read(el.src[0])));
            next();
        }, this.async());
    });
};