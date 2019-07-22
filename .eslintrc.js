module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: 'sane-node',
  env: {
    es6: true
  },
  overrides: [
    {
      files: 'test/**',
      plugins: [
        'mocha'
      ],
      extends: 'plugin:mocha/recommended',
      env: {
        mocha: true
      },
      rules: {
        'mocha/no-nested-tests': 0
      },
    }
  ]
};
