module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'functional'],
  extends: [
  ],
  rules: {
    'functional/prefer-readonly-type': [
      2, {
        allowLocalMutation: false,
        allowMutableReturnType: true,
        checkImplicit: false,
        ignoreClass: false,
        ignoreInterface: false,
        ignoreCollections: false,
      }
    ]
  },
}
