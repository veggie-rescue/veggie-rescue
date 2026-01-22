/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['out/**/*', '.next/**/*', 'node_modules/**/*'],
  rules: {
    'selector-class-pattern': null,
  },
};
