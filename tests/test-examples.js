/**
 * Entry point for all tests in ./example-cases/*
 * This is here to prevent webpack from creating a seperate bundle for each
 * test case.  See:  https://github.com/webpack/karma-webpack/issues/23
 */

var tests = require.context('./example-cases', true, /.*\.js$/);
tests.keys().forEach(tests);

