'use strict';

const {
  defineConfig,
} = require('eslint/config');

const config = require('@kellyselden/eslint-config');

module.exports = defineConfig([
  config,

  {
    rules: {
      'mocha/no-nested-tests': 'off',
    },
  },
]);
