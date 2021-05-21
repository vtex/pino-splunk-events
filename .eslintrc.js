/**
 * @type import('eslint').Linter.Config
 */
module.exports = {
  extends: ['vtex'],
  ignorePatterns: ['lib'],
  rules: {
    'jest/no-mocks-import': 'off',
  },
}
