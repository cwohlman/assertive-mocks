module.exports = function (wallaby) {
  return {
    files: [
      'lib/**/*.js',
      '!lib/**/*-spec.js',
      'app/**/*.js',
      '!app/**/*-spec.js',
    ],

    tests: [
      'lib/**/*-spec.js',
      'app/**/*-spec.js',
    ],

    env: {
      type: 'node'
    },

    compilers: {
      'lib/**/*.js': wallaby.compilers.babel(),
      'app/**/*.js': wallaby.compilers.babel(),
    },

    testFramework: 'mocha',

    setup: () => {
      require("babel-polyfill");
      global.expect = require('chai').expect;
    },
  };
};